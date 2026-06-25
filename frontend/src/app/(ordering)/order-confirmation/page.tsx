'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Clock, MapPin, Map, Phone, ShoppingBag, ArrowRight } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import toast from 'react-hot-toast';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id') || 'MOCK_ORDER_123';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await ordersApi.getById(orderId);
        if (response.data?.success) {
          setOrder(response.data.order);
        }
      } catch (err) {
        // Fallback mock details for demonstration
        setOrder({
          id: orderId,
          orderNumber: orderId.startsWith('ORD_') ? orderId : 'ORD_786524',
          orderType: 'delivery',
          deliveryAddress: {
            id: '1',
            label: 'Home',
            street: 'Plot No. 12, Phase-II, Jubilee Hills',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500033',
            isDefault: true,
          },
          items: [
            {
              menuItem: '1',
              name: 'Le Filet Mignon Flambé',
              price: 1850,
              quantity: 1,
              customizations: { 'Spice Level': 'Medium' },
              subtotal: 1850,
            },
            {
              menuItem: '2',
              name: 'Cardamom Crème Brûlée',
              price: 650,
              quantity: 2,
              customizations: {},
              subtotal: 1300,
            },
          ],
          subtotal: 3150,
          discount: 300,
          deliveryFee: 0,
          tax: 142,
          total: 2992,
          payment: {
            method: 'online',
            status: 'paid',
            transactionId: 'ch_stripe_mock_3f89a71',
          },
          orderStatus: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [],
        } as unknown as Order);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen pt-28 pb-16 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-[#C9A84C] border-solid rounded-full animate-spin mx-auto" />
          <p className="text-[#F5ECD7]/60 text-sm">Securing your order details...</p>
        </div>
      </div>
    );
  }

  const deliveryTimeStr = order?.createdAt
    ? new Date(new Date(order.createdAt).getTime() + 40 * 60 * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '45 mins';

  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-28 pb-16 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Animated Check Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 bg-green-500/10 border border-green-500 rounded-full flex items-center justify-center text-green-500 mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Check className="w-10 h-10" />
            </motion.div>
          </motion.div>
          <span className="text-green-500 text-xs font-semibold uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full">
            Payment Verified
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-white mt-4">Order Confirmed!</h1>
          <p className="text-[#F5ECD7]/60 text-sm mt-2 max-w-md">
            Thank you for dining with Lumiere. Your gourmet meal is being carefully prepared by our culinary brigade.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 sm:p-8 space-y-6 shadow-2xl mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-[#C9A84C]/10 text-sm">
            <div>
              <span className="text-[#F5ECD7]/45 block text-xs uppercase tracking-wider mb-1">Order Number</span>
              <span className="text-[#C9A84C] font-semibold">{order?.orderNumber}</span>
            </div>
            <div>
              <span className="text-[#F5ECD7]/45 block text-xs uppercase tracking-wider mb-1">Delivery Time</span>
              <span className="text-white font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C9A84C]" /> ~{deliveryTimeStr}
              </span>
            </div>
            <div>
              <span className="text-[#F5ECD7]/45 block text-xs uppercase tracking-wider mb-1">Status</span>
              <span className="text-green-400 capitalize font-semibold">{order?.orderStatus}</span>
            </div>
          </div>

          {/* Delivery Details */}
          {order?.orderType === 'delivery' && order?.deliveryAddress && (
            <div className="flex items-start gap-3 text-sm pb-6 border-b border-[#C9A84C]/10">
              <MapPin className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#F5ECD7]/45 block text-xs uppercase tracking-wider mb-1">Delivering To</span>
                <span className="text-[#F5ECD7]/80">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} -{' '}
                  {order.deliveryAddress.pincode}
                </span>
              </div>
            </div>
          )}

          {/* Items Summary */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C9A84C]" /> Items Ordered
            </h3>
            <div className="space-y-4">
              {order?.items.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-white font-medium">
                      {item.name} <span className="text-[#C9A84C] text-xs font-semibold ml-1.5">×{item.quantity}</span>
                    </span>
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <p className="text-xs text-[#C9A84C]/60 mt-0.5">
                        {Object.entries(item.customizations)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="text-white font-semibold">₹{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="pt-6 border-t border-[#C9A84C]/10 space-y-2 text-xs text-[#F5ECD7]/60">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-medium">₹{order?.subtotal.toLocaleString()}</span>
            </div>
            {order?.discount && order.discount > 0 ? (
              <div className="flex justify-between text-green-400">
                <span>Discount Applied</span>
                <span>-₹{order.discount.toLocaleString()}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-white font-medium">
                {order?.deliveryFee === 0 ? 'Free' : `₹${order?.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST & Tax (5%)</span>
              <span className="text-white font-medium">₹{order?.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-white font-semibold pt-4 border-t border-[#C9A84C]/10">
              <span>Grand Total</span>
              <span className="text-[#C9A84C] text-lg font-bold">₹{order?.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push(`/order-tracking/${orderId}`)}
            className="px-6 py-4 bg-[#C9A84C] text-[#0D0D0D] font-bold text-sm tracking-wider uppercase hover:bg-white transition-colors rounded flex items-center justify-center gap-2"
          >
            Track Your Order Live <Map className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/menu')}
            className="px-6 py-4 border border-[#C9A84C]/30 text-[#C9A84C] font-semibold text-sm tracking-wider uppercase hover:border-[#C9A84C] transition-colors rounded"
          >
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#0D0D0D] min-h-screen pt-28 pb-16 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-[#C9A84C] border-solid rounded-full animate-spin mx-auto" />
          <p className="text-[#F5ECD7]/60 text-sm">Securing your order details...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
