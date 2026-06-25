'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

const stats = [
  { value: '15', label: 'Years of Excellence' },
  { value: '12', label: 'Master Chefs on Team' },
];

export default function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="bg-[#F5ECD7] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Decorative Gold Line + Label */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
              Our Story
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] leading-tight mb-8">
            Crafted with Passion,
            <br />
            <span className="text-[#C9A84C]">Served with Grace</span>
          </h2>

          {/* Paragraphs */}
          <div className="space-y-5 text-[#0D0D0D]/70 leading-relaxed">
            <p>
              Born in the heart of Paris in 2010, Lumiere was founded on a
              singular belief: that a meal is more than sustenance — it is an
              experience that engages all the senses, a story told through
              flavour, texture, and presentation.
            </p>
            <p>
              Our culinary philosophy draws from the rich traditions of French
              haute cuisine, reimagined through a contemporary lens. Every dish
              on our menu is the result of meticulous sourcing, rigorous
              technique, and an unwavering commitment to seasonal, sustainable
              ingredients.
            </p>
            <p>
              From our intimate candlelit dining rooms to our celebrated
              tasting menus, Lumiere invites you to slow down, savour, and
              celebrate the art of fine dining. We do not simply serve food —
              we curate memories.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
              >
                <div className="font-display text-5xl text-[#C9A84C] font-bold whitespace-nowrap">
                  {stat.value}
                  <span className="text-3xl">+</span>
                </div>
                <div className="text-[#0D0D0D]/60 text-sm mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Image with Gold Frame Effect */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="relative"
        >
          {/* Gold border frame offset */}
          <div className="absolute top-6 left-6 right-0 bottom-0 border-2 border-[#C9A84C] z-0" />
          {/* Image container */}
          <div className="relative z-10 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-[520px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
                alt="Beautifully plated Lumiere dish"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
            {/* Bottom caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D0D0D]/80 to-transparent p-6">
              <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1">
                Lumiere Signature
              </p>
              <p className="text-white font-display text-xl">
                The Art of French Cuisine
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
