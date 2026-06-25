'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  Leaf,
  Award,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { MenuItem } from './MenuPageClient';
import toast from 'react-hot-toast';

interface ItemDetailModalProps {
  item: MenuItem;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < full
              ? 'fill-[#c9a84c] text-[#c9a84c]'
              : i === full && hasHalf
              ? 'fill-[#c9a84c]/50 text-[#c9a84c]'
              : 'fill-none text-[#e8e0d0] dark:text-[#3a3a3a]'
          }`}
        />
      ))}
    </div>
  );
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    Record<string, { label: string; price: number }>
  >({});
  const addItem = useCartStore((s) => s.addItem);

  const images = item.images ?? [item.image];

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const customizationPrice = Object.values(selectedCustomizations).reduce(
    (sum, { price }) => sum + price,
    0
  );
  const basePrice = item.discountPrice ?? item.price;
  const unitPrice = basePrice + customizationPrice;
  const totalPrice = unitPrice * quantity;

  const handleCustomization = (group: string, option: { label: string; price: number }) => {
    setSelectedCustomizations((prev) => ({
      ...prev,
      [group]: option,
    }));
  };

  const handleAddToCart = () => {
    const customizations = Object.entries(selectedCustomizations).map(([group, opt]) => ({
      group,
      option: opt.label,
      price: opt.price,
    }));

    // Validate required customizations
    const missingRequired = (item.customizations ?? [])
      .filter((g) => g.required && !selectedCustomizations[g.group])
      .map((g) => g.group);

    if (missingRequired.length > 0) {
      toast.error(`Please select: ${missingRequired.join(', ')}`);
      return;
    }

    addItem({
      id: item.id,
      name: item.name,
      image: item.image,
      basePrice,
      quantity,
      customizations,
      totalPrice,
      isVeg: item.isVeg,
      category: item.category,
    });

    toast.success(`${item.name} added to cart!`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0d0d0d]/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-[#2a2a2a] flex items-center justify-center text-[#0d0d0d] dark:text-[#f5ecd7] hover:bg-[#f5ecd7] dark:hover:bg-[#3a3a3a] transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={images[currentImageIndex]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentImageIndex ? 'bg-[#c9a84c] w-4' : 'bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Veg indicator */}
            <div
              className={`absolute top-3 left-3 w-7 h-7 rounded border-2 flex items-center justify-center bg-white ${
                item.isVeg ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            {/* Chef Special Ribbon */}
            {item.isChefSpecial && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a84c] text-white text-xs font-bold rounded-full">
                <Award className="w-3.5 h-3.5" />
                Chef&apos;s Special
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-0px)] lg:max-h-[90vh]">
            {/* Category */}
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[#c9a84c]">
              {item.category}
            </span>

            {/* Name */}
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#0d0d0d] dark:text-[#f5ecd7] mt-1 mb-3">
              {item.name}
            </h2>

            {/* Rating + Meta */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <StarRating rating={item.rating} />
                <span className="text-sm font-semibold text-[#0d0d0d] dark:text-[#f5ecd7]">
                  {item.rating}
                </span>
                <span className="text-xs text-[#7a7a7a]">({item.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#7a7a7a]">
                <Clock className="w-3.5 h-3.5" />
                ~{item.prepTime} min
              </div>
              {item.calories && (
                <span className="text-xs text-[#7a7a7a]">{item.calories} kcal</span>
              )}
            </div>

            {/* Dietary Badges */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {item.isVeg && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-800">
                  Vegetarian
                </span>
              )}
              {item.isVegan && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-800">
                  <Leaf className="w-3 h-3" />
                  Vegan
                </span>
              )}
              {item.isGlutenFree && (
                <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800">
                  Gluten-Free
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#4a4a4a] dark:text-[#c8b99a] leading-relaxed mb-5">
              {item.longDescription}
            </p>

            {/* Allergens */}
            {item.allergens.length > 0 && (
              <div className="flex items-start gap-2 mb-5 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Allergens</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500">{item.allergens.join(', ')}</p>
                </div>
              </div>
            )}

            {/* Customizations */}
            {item.customizations && item.customizations.length > 0 && (
              <div className="space-y-4 mb-6">
                {item.customizations.map((group) => (
                  <div key={group.group}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-[#0d0d0d] dark:text-[#f5ecd7]">
                        {group.group}
                      </p>
                      {group.required && (
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const isSelected = selectedCustomizations[group.group]?.label === opt.label;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleCustomization(group.group, opt)}
                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] text-white shadow-md'
                                : 'border border-[#e8e0d0] dark:border-[#2e2a22] text-[#4a4a4a] dark:text-[#c8b99a] hover:border-[#c9a84c] hover:text-[#c9a84c]'
                            }`}
                          >
                            {opt.label}
                            {opt.price > 0 && (
                              <span className={`ml-1.5 text-xs ${isSelected ? 'text-white/80' : 'text-[#c9a84c]'}`}>
                                +₹{opt.price}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity + Price */}
            <div className="border-t border-[#e8e0d0] dark:border-[#2e2a22] pt-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-[#7a7a7a] mb-1">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl border border-[#e8e0d0] dark:border-[#2e2a22] flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-display text-xl font-bold text-[#0d0d0d] dark:text-[#f5ecd7] w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-xl border border-[#e8e0d0] dark:border-[#2e2a22] flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#7a7a7a] mb-1">Total Price</p>
                  <div>
                    {item.discountPrice && (
                      <span className="text-sm text-[#7a7a7a] line-through mr-2">
                        ₹{(item.price * quantity).toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="font-display text-2xl font-bold text-[#0d0d0d] dark:text-[#f5ecd7]">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] text-white font-bold text-base rounded-2xl hover:shadow-xl hover:shadow-[#c9a84c]/30 hover:scale-[1.02] transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ₹{totalPrice.toLocaleString('en-IN')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
