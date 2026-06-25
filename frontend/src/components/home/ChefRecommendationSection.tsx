'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const recommendedDish = {
  name: 'Tournedos Rossini',
  description:
    'Pan-seared prime beef tenderloin atop toasted brioche, crowned with seared duck foie gras, drizzled with Périgueux truffle sauce and finished with gold leaf.',
  price: 5800,
  image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
};

export default function ChefRecommendationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="bg-[#F5ECD7] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <div className="h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
            Chef's Corner
          </span>
          <div className="h-px w-12 bg-[#C9A84C]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Chef Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            {/* Gold decorative corner elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-[#C9A84C] z-20" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-[#C9A84C] z-20" />

            <div className="overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5 }}
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80"
                alt="Chef Antoine Dubois"
                className="w-full h-[560px] object-cover object-top"
              />
            </div>

            {/* Name Badge overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#0D0D0D]/85 backdrop-blur-sm p-5 border-l-4 border-[#C9A84C]">
              <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1">Executive Chef</p>
              <p className="font-display text-2xl text-white">Chef Antoine Dubois</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(2)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C9A84C] text-[#C9A84C]" />
                ))}
                <span className="text-[#F5ECD7]/60 text-xs ml-1">Michelin Stars</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <h2 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-8 leading-tight">
              A Dish Born from
              <br />
              <span className="text-[#C9A84C]">Pure Obsession</span>
            </h2>

            {/* Quote */}
            <div className="relative mb-10">
              <Quote className="absolute -top-2 -left-2 w-10 h-10 text-[#C9A84C]/20 fill-[#C9A84C]/20" />
              <blockquote className="pl-6 text-[#0D0D0D]/70 text-lg leading-relaxed italic font-display">
                "Cooking is not merely a profession for me — it is a devotion.
                Every ingredient I touch carries the memory of the earth it came
                from. My greatest joy is when a guest closes their eyes at the
                first bite. In that moment, the art is complete."
              </blockquote>
            </div>

            {/* Stylized Signature */}
            <div className="mb-10">
              <p
                className="font-display text-3xl text-[#C9A84C] italic"
                style={{ fontStyle: 'italic' }}
              >
                — Antoine
              </p>
              <p className="text-[#0D0D0D]/40 text-xs uppercase tracking-widest mt-1">
                Executive Chef & Co-Founder, Lumiere
              </p>
            </div>

            {/* Recommended Dish Card */}
            <div className="border border-[#C9A84C]/30 p-1 bg-white/50">
              <div className="flex gap-4 p-4">
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                  <img
                    src={recommendedDish.image}
                    alt={recommendedDish.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#C9A84C] text-xs uppercase tracking-widest font-medium">
                      Chef Recommends
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-[#0D0D0D] mb-1">
                    {recommendedDish.name}
                  </h3>
                  <p className="text-[#0D0D0D]/60 text-xs leading-relaxed line-clamp-2 mb-2">
                    {recommendedDish.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-[#C9A84C]">
                      ₹{recommendedDish.price.toLocaleString('en-IN')}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-4 py-1.5 bg-[#C9A84C] text-[#0D0D0D] text-xs font-semibold uppercase tracking-wider hover:bg-[#0D0D0D] hover:text-[#C9A84C] transition-colors"
                    >
                      Order
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold accent dots */}
            <div className="flex gap-2 mt-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === 0 ? 'bg-[#C9A84C]' : 'bg-[#C9A84C]/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
