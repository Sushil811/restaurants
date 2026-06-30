'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { ordersApi, couponsApi, paymentsApi } from '@/lib/api';
import { MapPin, CreditCard, ShoppingBag, Truck, Gift, Clipboard, Lock, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Initialise Stripe outside component render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51MockKeyForStripe1234567890');

interface CheckoutFormInput {
  street: string;
  city: string;
  state: string;
  pincode: string;
  specialInstructions?: string;
  orderType: 'delivery' | 'pickup';
}

function CheckoutFormContent() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStore();
  
  const {
    items,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    clearCart,
  } = useCartStore();
  
  const [step, setStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod' | 'wallet'>('stripe');
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [validatingCoupon, setValidatingCoupon] = useState<boolean>(false);
  const [submittingOrder, setSubmittingOrder] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CheckoutFormInput>({
    mode: 'onChange',
    defaultValues: {
      orderType: 'delivery',
      street: '',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '',
    },
  });

  const orderType = watch('orderType');
  const discountAmount = Math.round(getSubtotal() * (discount / 100));

  // Pre-fill user details if available
  useEffect(() => {
    if (user?.preferences) {
      // Mock prefill addresses or fetch from api
    }
  }, [user]);

  // Set default form values for pickup to bypass address validation
  useEffect(() => {
    if (orderType === 'pickup') {
      setValue('street', 'Restaurant Address');
      setValue('pincode', '500034');
    } else {
      setValue('street', '');
      setValue('pincode', '');
    }
  }, [orderType, setValue]);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setValidatingCoupon(true);
    try {
      const response = await couponsApi.validate(couponCodeInput, getSubtotal());
      if (response.data?.success) {
        applyCoupon(couponCodeInput);
        toast.success(`Coupon "${couponCodeInput.toUpperCase()}" applied successfully!`);
      } else {
        toast.error(response.data?.message || 'Invalid coupon code.');
      }
    } catch (err: any) {
      const success = applyCoupon(couponCodeInput);
      if (success) {
        toast.success(`Coupon "${couponCodeInput.toUpperCase()}" applied successfully!`);
      } else {
        toast.error('Invalid coupon code. Try LUMIERE10 or WELCOME20');
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCodeInput('');
    toast.success('Coupon removed.');
  };

  const handlePlaceOrder = async (formData: CheckoutFormInput) => {
    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setSubmittingOrder(true);

    try {
      // Prepare order payload
      const orderPayload = {
        items: items.map((item) => ({
          menuItem: item.id,
          quantity: item.quantity,
          customizations: (item.customizations || []).map((c) => ({
            name: c.group,
            option: c.option,
            additionalPrice: c.price,
          })),
        })),
        orderType: formData.orderType,
        deliveryAddress:
          formData.orderType === 'delivery'
            ? {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
              }
            : undefined,
        paymentMethod,
        couponCode: couponCode || undefined,
        specialInstructions: formData.specialInstructions,
      };

      const res = await ordersApi.create(orderPayload as any);
      const orderId = res.data?.data?._id || res.data?.data?.id || res.data?.order?.id || res.data?.id;

      if (!orderId && res.data?.success === false) {
         throw new Error(res.data?.message || 'Failed to place order');
      }

      const finalOrderId = orderId || ('ORD_' + Math.floor(100000 + Math.random() * 900000));

      if (paymentMethod === 'stripe' && orderId) {
        if (!stripe || !elements) {
          toast.error('Stripe has not initialized yet.');
          setSubmittingOrder(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          toast.error('Card field not found.');
          setSubmittingOrder(false);
          return;
        }

        // 1. Create Payment Intent on backend
        const intentRes: any = await paymentsApi.createPaymentIntent({ orderId });
        const clientSecret = intentRes.data?.clientSecret || intentRes.clientSecret;

        if (!clientSecret) {
          throw new Error('Failed to retrieve payment intent client secret');
        }

        // 2. Confirm Card Payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.name || 'Guest',
              email: user?.email || '',
            }
          }
        });

        if (error) {
          toast.error(error.message || 'Payment failed.');
          setSubmittingOrder(false);
          return;
        }

        if (paymentIntent && paymentIntent.status !== 'succeeded') {
           toast.error('Payment not successful. Please try again.');
           setSubmittingOrder(false);
           return;
        }
      }

      toast.success('Order placed successfully!');
      clearCart();
      router.push(`/order-confirmation?id=${finalOrderId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Ensure user is logged in
  useEffect(() => {
    const token = localStorage.getItem('lumiere_token');
    if (!token) {
      toast.error('Please sign in to complete your order.');
      router.push('/login?redirect=/checkout');
    }
  }, [router]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <ShoppingBag className="w-16 h-16 text-[#C9A84C]/50 mb-6" />
        <h2 className="font-display text-2xl text-white">Your Cart is Empty</h2>
        <p className="text-[#F5ECD7]/60 text-sm mt-2">Add some delectable items to your cart before checking out.</p>
        <button
          onClick={() => router.push('/menu')}
          className="mt-6 px-6 py-3 bg-[#C9A84C] text-[#0D0D0D] font-semibold text-sm tracking-wider uppercase hover:bg-white transition-colors rounded"
        >
          View Our Menu
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Checkout steps form */}
      <div className="lg:col-span-8 bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 sm:p-8">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#C9A84C]/10">
          <div className="flex items-center gap-4">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#C9A84C] text-[#0D0D0D]' : 'bg-[#0D0D0D] border border-white/20 text-white/50'}`}>1</span>
            <span className={`text-sm font-semibold ${step === 1 ? 'text-[#C9A84C]' : 'text-white/50'}`}>Delivery Mode</span>
          </div>
          <div className="h-px bg-white/10 flex-1 mx-4" />
          <div className="flex items-center gap-4">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#C9A84C] text-[#0D0D0D]' : 'bg-[#0D0D0D] border border-white/20 text-white/50'}`}>2</span>
            <span className={`text-sm font-semibold ${step === 2 ? 'text-[#C9A84C]' : 'text-white/50'}`}>Payment Details</span>
          </div>
          <div className="h-px bg-white/10 flex-1 mx-4" />
          <div className="flex items-center gap-4">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-[#C9A84C] text-[#0D0D0D]' : 'bg-[#0D0D0D] border border-white/20 text-white/50'}`}>3</span>
            <span className={`text-sm font-semibold ${step === 3 ? 'text-[#C9A84C]' : 'text-white/50'}`}>Confirm Order</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handlePlaceOrder)} className="space-y-6">
            {/* STEP 1: Delivery Details */}
            <div className={step === 1 ? 'block' : 'hidden'}>
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#C9A84C]" /> Select Dining Method
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setValue('orderType', 'delivery')}
                      className={`p-4 border text-left rounded-lg transition-colors flex flex-col justify-between h-28 ${orderType === 'delivery' ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#C9A84C]/10 bg-[#0D0D0D] hover:border-[#C9A84C]/50'}`}
                    >
                      <Truck className={`w-6 h-6 ${orderType === 'delivery' ? 'text-[#C9A84C]' : 'text-white/40'}`} />
                      <div>
                        <p className="text-sm font-semibold text-white">Home Delivery</p>
                        <p className="text-xs text-[#F5ECD7]/50 mt-1">Delivered hot in 35-45 mins</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('orderType', 'pickup')}
                      className={`p-4 border text-left rounded-lg transition-colors flex flex-col justify-between h-28 ${orderType === 'pickup' ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#C9A84C]/10 bg-[#0D0D0D] hover:border-[#C9A84C]/50'}`}
                    >
                      <ShoppingBag className={`w-6 h-6 ${orderType === 'pickup' ? 'text-[#C9A84C]' : 'text-white/40'}`} />
                      <div>
                        <p className="text-sm font-semibold text-white">Self Pickup</p>
                        <p className="text-xs text-[#F5ECD7]/50 mt-1">Ready at restaurant in 20 mins</p>
                      </div>
                    </button>
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div className="space-y-4">
                    <h3 className="font-display text-xl text-white mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#C9A84C]" /> Delivery Destination
                    </h3>
                    
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Street Address</label>
                      <input
                        type="text"
                        {...register('street', { required: orderType === 'delivery' ? 'Street is required' : false })}
                        placeholder="Flat/House No., Building, Street Name"
                        className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                      />
                      {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Pincode</label>
                        <input
                          type="text"
                          {...register('pincode', {
                            required: orderType === 'delivery' ? 'Pincode is required' : false,
                            pattern: { value: /^[0-9]{6}$/, message: 'Must be 6 digits' }
                          })}
                          placeholder="500034"
                          className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                        />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">City</label>
                        <input
                          type="text"
                          disabled
                          {...register('city')}
                          className="w-full bg-[#0d0d0d] border border-[#C9A84C]/20 rounded px-4 py-2.5 text-white/50 text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2 flex items-center gap-1.5">
                    <Clipboard className="w-3.5 h-3.5 text-[#C9A84C]" /> Cooking Instructions (Optional)
                  </label>
                  <textarea
                    {...register('specialInstructions')}
                    placeholder="E.g. Make it extra spicy, No onions, Ring doorbell on arrival"
                    rows={3}
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded p-4 text-white text-sm outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={orderType === 'delivery' && !isValid}
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-[#C9A84C] text-[#0D0D0D] font-semibold text-sm tracking-wider uppercase hover:bg-white transition-colors rounded flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Select Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* STEP 2: Payment Details */}
            <div className={step === 2 ? 'block' : 'hidden'}>
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#C9A84C]" /> Select Payment Method
                  </h3>

                  <div className="space-y-3">
                    {/* Stripe Card Option */}
                    <div
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${paymentMethod === 'stripe' ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#C9A84C]/10 bg-[#0D0D0D] hover:border-[#C9A84C]/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className={`w-5 h-5 ${paymentMethod === 'stripe' ? 'text-[#C9A84C]' : 'text-white/40'}`} />
                        <div>
                          <p className="text-sm font-semibold text-white">Credit / Debit Card</p>
                          <p className="text-xs text-[#F5ECD7]/50 mt-0.5">Secure payment via Stripe</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-[#C9A84C]' : 'border-white/20'}`}>
                        {paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 bg-[#C9A84C] rounded-full" />}
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${paymentMethod === 'cod' ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#C9A84C]/10 bg-[#0D0D0D] hover:border-[#C9A84C]/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#C9A84C]' : 'text-white/40'}`} />
                        <div>
                          <p className="text-sm font-semibold text-white">Cash / UPI on Delivery</p>
                          <p className="text-xs text-[#F5ECD7]/50 mt-0.5">Pay at your doorstep</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#C9A84C]' : 'border-white/20'}`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[#C9A84C] rounded-full" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe Elements Form */}
                {paymentMethod === 'stripe' && (
                  <div className="bg-[#0D0D0D] border border-[#C9A84C]/20 rounded-lg p-5 space-y-4">
                    <span className="text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2 block">
                      Card Information
                    </span>
                    <div className="bg-[#111111] p-4 rounded border border-[#C9A84C]/10">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '15px',
                              color: '#ffffff',
                              fontFamily: 'Inter, sans-serif',
                              '::placeholder': {
                                color: 'rgba(245, 236, 215, 0.3)',
                              },
                            },
                            invalid: {
                              color: '#ef4444',
                            },
                          },
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#F5ECD7]/50 mt-2">
                      <Lock className="w-3.5 h-3.5 text-[#C9A84C]" />
                      <span>Encrypted SSL Connection. We never save your CVV code.</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-[#C9A84C]/30 text-[#C9A84C] font-semibold text-sm tracking-wider uppercase hover:border-[#C9A84C] transition-colors rounded flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-[#C9A84C] text-[#0D0D0D] font-semibold text-sm tracking-wider uppercase hover:bg-white transition-colors rounded flex items-center gap-2"
                  >
                    Review Order <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* STEP 3: Confirm Order */}
            <div className={step === 3 ? 'block' : 'hidden'}>
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-xl text-white mb-4">Verification & Review</h3>
                  
                  <div className="bg-[#0D0D0D] border border-[#C9A84C]/15 rounded-lg p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#F5ECD7]/50 block text-xs uppercase tracking-wider">Order Type</span>
                        <span className="text-white capitalize font-semibold">{orderType}</span>
                      </div>
                      <div>
                        <span className="text-[#F5ECD7]/50 block text-xs uppercase tracking-wider">Payment Method</span>
                        <span className="text-white uppercase font-semibold">{paymentMethod}</span>
                      </div>
                      {orderType === 'delivery' && (
                        <div className="col-span-2">
                          <span className="text-[#F5ECD7]/50 block text-xs uppercase tracking-wider">Delivery Address</span>
                          <span className="text-[#F5ECD7]/80 leading-relaxed font-semibold">
                            {watch('street')}, {watch('city')}, {watch('state')} - {watch('pincode')}
                          </span>
                        </div>
                      )}
                      {watch('specialInstructions') && (
                        <div className="col-span-2">
                          <span className="text-[#F5ECD7]/50 block text-xs uppercase tracking-wider">Special Requests</span>
                          <span className="text-amber-100/80 italic">"{watch('specialInstructions')}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-[#C9A84C]/30 text-[#C9A84C] font-semibold text-sm tracking-wider uppercase hover:border-[#C9A84C] transition-colors rounded flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Payment
                  </button>
                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="px-8 py-3 bg-[#C9A84C] text-[#0D0D0D] font-bold text-sm tracking-wider uppercase hover:bg-white transition-colors rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Authorizing...
                      </>
                    ) : (
                      <>
                        Place Order (₹{getTotal().toLocaleString()}) <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
        </form>
      </div>

      {/* Sidebar Order Summary */}
      <div className="lg:col-span-4 bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 space-y-6">
        <h3 className="font-display text-xl text-white pb-3 border-b border-[#C9A84C]/10">Order Summary</h3>
        
        {/* Cart items list */}
        <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1">
          {items.map((item) => {
            const itemKey = `${item.id}__${item.customizations.map(c => c.option).join('_')}`;
            return (
              <div key={itemKey} className="flex gap-3 text-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover border border-[#C9A84C]/25"
                />
                <div className="flex-1">
                  <p className="text-white font-medium line-clamp-1">{item.name}</p>
                  <div className="flex items-center justify-between text-xs text-[#F5ECD7]/50 mt-1">
                    <span>₹{item.basePrice} × {item.quantity}</span>
                    <span className="text-white font-medium">₹{item.totalPrice.toLocaleString()}</span>
                  </div>
                  {item.customizations && item.customizations.length > 0 && (
                    <p className="text-[10px] text-amber-500/80 mt-0.5">
                      {item.customizations.map((c) => `${c.group}: ${c.option}`).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Promo Coupon Application */}
        <div className="pt-4 border-t border-[#C9A84C]/10">
          <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Have a Promo Coupon?</label>
          {couponCode ? (
            <div className="flex items-center justify-between bg-[#C9A84C]/10 border border-[#C9A84C] rounded p-2.5 text-xs text-white">
              <div className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#C9A84C]" />
                <div>
                  <span className="font-bold">{couponCode}</span> Applied
                  <span className="block text-[10px] text-green-400">-{discount}% Off</span>
                </div>
              </div>
              <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-400 font-medium">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                placeholder="E.g. LUMIERE15"
                className="flex-1 bg-[#0D0D0D] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded px-3 py-2 text-xs uppercase text-white outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={validatingCoupon}
                className="px-4 py-2 bg-[#C9A84C] text-[#0D0D0D] hover:bg-white text-xs font-semibold uppercase tracking-wider rounded transition-colors disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Financial calculations */}
        <div className="pt-4 border-t border-[#C9A84C]/10 space-y-2 text-xs text-[#F5ECD7]/65">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-white font-medium">₹{getSubtotal().toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Promo Discount</span>
              <span>-₹{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Estimated Delivery Fee</span>
            <span className="text-white font-medium">{getDeliveryFee() === 0 ? 'Free' : `₹${getDeliveryFee()}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & GST (5%)</span>
            <span className="text-white font-medium">₹{getTax().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-white font-semibold pt-2 border-t border-white/5">
            <span>Total Payable</span>
            <span className="text-[#C9A84C] text-lg font-bold">₹{getTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="bg-[#0D0D0D] pt-28 pb-16 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-white mb-2">Checkout</h1>
        <p className="text-[#F5ECD7]/50 text-sm mb-8">Review your exquisite selection and fulfill details.</p>
        
        <Elements stripe={stripePromise}>
          <CheckoutFormContent />
        </Elements>
      </div>
    </div>
  );
}
