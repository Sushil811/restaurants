'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram } from '@/components/shared/BrandIcons';

const photos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    alt: 'Exquisite plating at Lumiere',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
    alt: 'Chef at work in the kitchen',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
    alt: 'Artisan dessert creation',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80',
    alt: 'Elegant cocktail service',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    alt: 'Fresh seasonal ingredients',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    alt: 'Signature Lumiere dish',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as any } },
};

export default function InstagramFeedSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="bg-[#F5ECD7] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <Instagram className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
              Instagram
            </span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-3">
            Follow Our Journey
          </h2>
          <a
            href="https://instagram.com/lumiere.restaurant"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C9A84C] hover:text-[#0D0D0D] transition-colors duration-200 font-medium"
          >
            @lumiere.restaurant
          </a>
        </motion.div>

        {/* Photo Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3"
        >
          {photos.map((photo) => (
            <motion.a
              key={photo.id}
              variants={itemVariants}
              href="https://instagram.com/lumiere.restaurant"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group aspect-square overflow-hidden block"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gold hover overlay */}
              <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/70 transition-all duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Instagram className="w-10 h-10 text-[#0D0D0D]" strokeWidth={1.5} />
                </motion.div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com/lumiere.restaurant"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[#C9A84C] text-[#C9A84C] text-sm uppercase tracking-widest font-semibold hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-300"
          >
            <Instagram className="w-4 h-4" />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
