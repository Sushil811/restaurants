'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  X,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function CartPage() {
  const {
    items,
    couponCode,
    discount,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const discountAmount = Math.round(subtotal * (discount / 100));
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setTimeout(() => {
      const success = applyCoupon(couponInput);
      if (success) {
        toast.success(`Coupon "${couponInput.toUpperCase()}" applied! ${discount}% off`);
        setCouponInput('');
      } else {
        toast.error('Invalid coupon code. Try: LUMIERE10, WELCOME20, FEAST15');
      }
      setCouponLoading(false);
    }, 600);
  };

  // ── Empty Cart ──
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f9f6f0] dark:bg-[#0d0d0d] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-32 h-32 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center mx-auto mb-8 shadow-xl">
            <ShoppingBag className="w-16 h-16 text-[#c9a84c]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#0d0d0d] dark:text-[#f5ecd7] mb-3">
            Your cart is empty
          </h1>
          <p className="text-[#7a7a7a] mb-8 leading-relaxed">
            Looks like you haven't added any culinary masterpieces yet. Explore our menu and add your favourite dishes.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-[#c9a84c]/30 hover:scale-105 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            Browse Our Menu
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f6f0] dark:bg-[#0d0d0d]">
      <div className="container-lumiere py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm text-[#7a7a7a] hover:text-[#c9a84c] transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0d0d0d] dark:text-[#f5ecd7]">
              Your Cart
            </h1>
            <p className="text-[#7a7a7a] mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={() => { clearCart(); toast.success('Cart cleared'); }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${item.customizations.map(c => c.option).join('-')}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#e8e0d0] dark:border-[#2e2a22] p-4 sm:p-5"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute top-1.5 left-1.5 w-4 h-4 rounded border-2 flex items-center justify-center bg-white ${
                          item.isVeg ? 'border-green-500' : 'border-red-500'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-[#0d0d0d] dark:text-[#f5ecd7] truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#7a7a7a]">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.customizations)}
                          className="text-[#7a7a7a] hover:text-red-500 transition-colors flex-shrink-0 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customizations */}
                      {item.customizations.length > 0 && (
                        <div className="mt-2 space-y-0.5">
                          {item.customizations.map((c) => (
                            <p key={c.group} className="text-xs text-[#7a7a7a]">
                              {c.group}: <span className="text-[#4a4a4a] dark:text-[#c8b99a]">{c.option}</span>
                              {c.price > 0 && <span className="text-[#c9a84c] ml-1">+₹{c.price}</span>}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Quantity + Price row */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.customizations)}
                            className="w-7 h-7 rounded-lg border border-[#e8e0d0] dark:border-[#2e2a22] flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-sm w-6 text-center text-[#0d0d0d] dark:text-[#f5ecd7]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                            className="w-7 h-7 rounded-lg border border-[#e8e0d0] dark:border-[#2e2a22] flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#7a7a7a]">
                            ₹{(item.totalPrice / item.quantity).toLocaleString('en-IN')} × {item.quantity}
                          </p>
                          <p className="font-bold text-[#0d0d0d] dark:text-[#f5ecd7]">
                            ₹{item.totalPrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#e8e0d0] dark:border-[#2e2a22] p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-[#0d0d0d] dark:text-[#f5ecd7] mb-6">
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="mb-5">
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                        {couponCode} ({discount}% off)
                      </span>
                    </div>
                    <button
                      onClick={() => { removeCoupon(); toast.success('Coupon removed'); }}
                      className="text-green-600 dark:text-green-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-[#7a7a7a] uppercase tracking-wider mb-2 block">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="LUMIERE10"
                        className="flex-1 input-lumiere text-sm"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-4 py-2 bg-[#c9a84c] text-white text-sm font-semibold rounded-xl hover:bg-[#b8922e] transition-all disabled:opacity-60"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    <p className="text-[10px] text-[#7a7a7a] mt-1.5">
                      Try: LUMIERE10 · WELCOME20 · FEAST15
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 border-t border-[#e8e0d0] dark:border-[#2e2a22]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a7a7a]">Subtotal</span>
                  <span className="font-medium text-[#0d0d0d] dark:text-[#f5ecd7]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">Coupon Discount ({discount}%)</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a7a7a]">Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600 dark:text-green-400' : 'text-[#0d0d0d] dark:text-[#f5ecd7]'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[10px] text-[#7a7a7a]">
                    Add ₹{(500 - subtotal).toLocaleString('en-IN')} more for free delivery
                  </p>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a7a7a]">Tax (5% GST)</span>
                  <span className="font-medium text-[#0d0d0d] dark:text-[#f5ecd7]">
                    ₹{tax.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-t-2 border-[#c9a84c]/30 mb-5">
                <span className="font-display text-lg font-bold text-[#0d0d0d] dark:text-[#f5ecd7]">Total</span>
                <span className="font-display text-2xl font-bold text-[#c9a84c]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] text-white font-bold text-base rounded-2xl hover:shadow-xl hover:shadow-[#c9a84c]/30 hover:scale-[1.02] transition-all duration-300"
              >
                Proceed to Checkout
                <ChevronRight className="w-5 h-5" />
              </Link>

              <Link
                href="/menu"
                className="mt-3 w-full flex items-center justify-center gap-2 py-3 text-sm text-[#7a7a7a] hover:text-[#c9a84c] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
