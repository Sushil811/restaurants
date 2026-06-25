'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Eye, Award, Leaf, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { MenuItem } from './MenuPageClient';
import toast from 'react-hot-toast';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  onViewDetails: () => void;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < full
                ? 'fill-[#c9a84c] text-[#c9a84c]'
                : i === full && hasHalf
                ? 'fill-[#c9a84c]/50 text-[#c9a84c]'
                : 'fill-none text-[#e8e0d0] dark:text-[#3a3a3a]'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-[#7a7a7a]">({count})</span>
    </div>
  );
}

export default function MenuCard({ item, index, onViewDetails }: MenuCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const price = item.discountPrice ?? item.price;
    addItem({
      id: item.id,
      name: item.name,
      image: item.image,
      basePrice: price,
      customizations: [],
      totalPrice: price,
      isVeg: item.isVeg,
      category: item.category,
    });
    toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: t.visible ? 1 : 0, y: t.visible ? 0 : 20 }}
          className="flex items-center gap-3 bg-white dark:bg-[#1a1a1a] px-4 py-3 rounded-2xl shadow-xl border border-[#e8e0d0] dark:border-[#2e2a22] max-w-xs"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-sm text-[#0d0d0d] dark:text-[#f5ecd7]">{item.name}</p>
            <p className="text-xs text-[#c9a84c]">Added to cart ✓</p>
          </div>
        </motion.div>
      ),
      { duration: 2500, position: 'bottom-right' }
    );
  };

  const discountPercent = item.discountPrice
    ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#e8e0d0] dark:border-[#2e2a22] hover:border-[#c9a84c]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#c9a84c]/10 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-[#0d0d0d]/60 flex items-center justify-center gap-3"
        >
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.05 }}
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#b8922e] text-white text-sm font-semibold rounded-full transition-all hover:scale-105"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.1 }}
            onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-semibold rounded-full border border-white/30 transition-all hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            Details
          </motion.button>
        </motion.div>

        {/* Badges: top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {item.isChefSpecial && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-[#c9a84c] text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-md">
              <Award className="w-3 h-3" />
              Chef's Special
            </span>
          )}
          {item.isPopular && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-[#0d0d0d]/80 backdrop-blur-sm text-[#c9a84c] text-[10px] font-bold tracking-wider uppercase rounded-full border border-[#c9a84c]/40">
              <Zap className="w-3 h-3" />
              Popular
            </span>
          )}
        </div>

        {/* Discount badge: top-right */}
        {discountPercent && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full">
            -{discountPercent}%
          </span>
        )}

        {/* Veg / Non-Veg indicator */}
        <div
          className={`absolute bottom-3 right-3 w-6 h-6 rounded border-2 flex items-center justify-center bg-white ${
            item.isVeg ? 'border-green-500' : 'border-red-500'
          }`}
          title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
        >
          <div className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category tag */}
        <span className="inline-block text-[10px] font-semibold tracking-[0.12em] uppercase text-[#c9a84c] mb-2">
          {item.category}
        </span>

        {/* Name */}
        <h3 className="font-display text-lg font-bold text-[#0d0d0d] dark:text-[#f5ecd7] leading-tight mb-2 line-clamp-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#7a7a7a] leading-relaxed line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Ratings */}
        <StarRating rating={item.rating} count={item.reviewCount} />

        {/* Dietary tags */}
        <div className="flex gap-1.5 mt-2 mb-4">
          {item.isVegan && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-semibold rounded-full border border-green-200 dark:border-green-800">
              <Leaf className="w-2.5 h-2.5" />
              Vegan
            </span>
          )}
          {item.isGlutenFree && (
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-semibold rounded-full border border-blue-200 dark:border-blue-800">
              Gluten-Free
            </span>
          )}
          {item.hasCustomization && (
            <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-[10px] font-semibold rounded-full border border-purple-200 dark:border-purple-800">
              Customizable
            </span>
          )}
        </div>

        {/* Price + Add Button */}
        <div className="flex items-center justify-between">
          <div>
            {item.discountPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#0d0d0d] dark:text-[#f5ecd7]">
                  ₹{item.discountPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-[#7a7a7a] line-through">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-[#0d0d0d] dark:text-[#f5ecd7]">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
            )}
            {item.prepTime && (
              <p className="text-[10px] text-[#7a7a7a] mt-0.5">~{item.prepTime} min prep</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-[#c9a84c]/30 hover:scale-105 transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
