'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ShoppingCart, Leaf, Drumstick } from 'lucide-react';
import Link from 'next/link';

const dishes = [
  {
    id: 1,
    name: 'Truffle Risotto',
    description: 'Black truffle, aged parmesan, arborio rice, wild herbs',
    price: 2450,
    rating: 4.9,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=600&q=80',
  },
  {
    id: 2,
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon, lemon beurre blanc, asparagus, capers',
    price: 3200,
    rating: 4.8,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  },
  {
    id: 3,
    name: 'Grilled Tenderloin',
    description: 'Prime beef tenderloin, red wine jus, truffle butter, roasted vegetables',
    price: 4800,
    rating: 4.9,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  },
  {
    id: 4,
    name: 'Lobster Bisque',
    description: 'Maine lobster, cognac cream, saffron, chives, toasted brioche',
    price: 1850,
    rating: 4.7,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
  },
  {
    id: 5,
    name: 'Foie Gras Torchon',
    description: 'Duck foie gras, brioche toast, cherry compote, micro greens',
    price: 2800,
    rating: 4.8,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
  },
  {
    id: 6,
    name: 'Dark Chocolate Soufflé',
    description: 'Valrhona dark chocolate, vanilla bean ice cream, gold dust',
    price: 1200,
    rating: 5.0,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as any } },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.floor(rating)
              ? 'fill-[#C9A84C] text-[#C9A84C]'
              : 'fill-none text-[#C9A84C]/40'
          }`}
        />
      ))}
      <span className="text-xs text-[#0D0D0D]/60 ml-1">{rating}</span>
    </div>
  );
}

export default function FeaturedDishesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="bg-[#0D0D0D] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
              Our Menu
            </span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            Signature Creations
          </h2>
          <p className="text-[#F5ECD7]/60 max-w-xl mx-auto">
            Each dish is a masterpiece — carefully composed, artfully presented,
            and crafted to delight the most discerning palates.
          </p>
        </motion.div>

        {/* Dishes Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {dishes.map((dish) => (
            <motion.div
              key={dish.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group bg-[#111111] border border-white/5 overflow-hidden hover:border-[#C9A84C]/50 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] transition-all duration-400 cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Veg/Non-Veg Badge */}
                <div
                  className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                    dish.isVeg
                      ? 'bg-green-900/80 text-green-300 border border-green-600/50'
                      : 'bg-red-900/80 text-red-300 border border-red-600/50'
                  } backdrop-blur-sm`}
                >
                  {dish.isVeg ? (
                    <Leaf className="w-3 h-3" />
                  ) : (
                    <Drumstick className="w-3 h-3" />
                  )}
                  {dish.isVeg ? 'Veg' : 'Non-Veg'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-lg text-white group-hover:text-[#C9A84C] transition-colors">
                    {dish.name}
                  </h3>
                  <span className="text-[#C9A84C] font-semibold text-sm whitespace-nowrap ml-2">
                    ₹{dish.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[#F5ECD7]/50 text-sm mb-4 leading-relaxed line-clamp-2">
                  {dish.description}
                </p>
                <div className="flex items-center justify-between">
                  <StarRating rating={dish.rating} />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#0D0D0D] text-xs font-semibold uppercase tracking-wider hover:bg-[#F5ECD7] transition-colors duration-200"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-14"
        >
          <Link
            href="/menu"
            className="inline-block px-10 py-4 border border-[#C9A84C] text-[#C9A84C] uppercase tracking-widest text-sm font-semibold hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-300"
          >
            View Full Menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
