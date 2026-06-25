'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    couponCode,
    discount,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    getTotalItems
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');

  // Lock scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (success) {
      toast.success(`Coupon "${couponInput.toUpperCase()}" applied successfully!`);
      setCouponInput('');
    } else {
      toast.error('Invalid coupon code. Try LUMIERE10 or WELCOME20');
    }
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/cart');
  };

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();
  const discountAmount = Math.round(subtotal * (discount / 100));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black z-[300] backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-charcoal-950 border-l border-gold-900/20 text-neutral-200 z-[400] flex flex-col shadow-2xl shadow-black"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h3 className="font-display text-xl text-white font-semibold">Your Selection</h3>
                <span className="bg-gold-950/80 border border-gold-900/30 text-gold text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-900/80 text-neutral-400 hover:text-white transition-all duration-200"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body - Scrollable Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-12">
                  <div className="w-20 h-20 rounded-full bg-neutral-900/50 flex items-center justify-center text-neutral-600 border border-neutral-850">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-white font-medium">Your bag is empty</h4>
                    <p className="text-neutral-500 text-sm mt-1 max-w-[260px] mx-auto">
                      Explore our menu and add our gourmet creations to your selection.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      closeCart();
                      router.push('/menu');
                    }}
                    className="px-6 py-2.5 border border-gold text-gold text-xs font-semibold uppercase tracking-wider hover:bg-gold hover:text-charcoal transition-all duration-300"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.id}__${item.customizations.map(c => c.option).join('_')}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 bg-charcoal-900/40 border border-neutral-900/50 hover:border-gold-900/25 transition-all duration-300 rounded-sm"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 shrink-0 relative overflow-hidden bg-neutral-900 border border-neutral-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display text-md text-white font-medium truncate group-hover:text-gold transition-colors">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id, item.customizations)}
                            className="text-neutral-500 hover:text-danger-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.customizations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.customizations.map((c, idx) => (
                              <span
                                key={idx}
                                className="text-3xs bg-neutral-950 border border-neutral-850 px-1.5 py-0.5 rounded text-neutral-400"
                              >
                                {c.group}: {c.option} (+₹{c.price})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-neutral-800 bg-neutral-950 rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.customizations)}
                            className="p-1 px-2.5 text-neutral-500 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm px-2 text-white font-medium select-none min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                            className="p-1 px-2.5 text-neutral-500 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-semibold text-gold text-sm">
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Drawer Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-neutral-900 bg-charcoal-950 p-6 space-y-6">
                
                {/* Coupon Code Section */}
                {!couponCode ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Apply coupon (e.g., LUMIERE10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-none py-2.5 pl-10 pr-4 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors duration-300"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-gold text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-gold-950/20 border border-gold-900/30 p-3 rounded-sm">
                    <div className="flex items-center gap-2 text-xs text-gold">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <div>
                        <p className="font-semibold">{couponCode} Active</p>
                        <p className="text-3xs text-gold-400/80">{discount}% discount applied</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-neutral-400 hover:text-danger-500 underline transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-sm font-sans text-neutral-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-neutral-200">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-gold">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-neutral-200">
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (5% GST)</span>
                    <span className="text-neutral-200">₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  {deliveryFee > 0 && (
                    <p className="text-3xs text-neutral-500 text-right">
                      Add ₹{(500 - subtotal).toLocaleString('en-IN')} more for free delivery
                    </p>
                  )}

                  <div className="h-[1px] bg-neutral-900 my-3" />

                  <div className="flex justify-between text-base font-semibold text-white">
                    <span>Total Amount</span>
                    <span className="text-gold font-display text-lg">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-gold hover:bg-gradient-gold-shimmer text-charcoal font-sans text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-gold transition-all duration-300"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
