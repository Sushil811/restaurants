'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Star, Award, Users } from 'lucide-react';

const stats = [
  { icon: Award, label: '15+ Awards', value: '15+' },
  { icon: Star, label: '200+ Dishes', value: '200+' },
  { icon: Users, label: '50k+ Guests', value: '50k+' },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center justify-center"
    >
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
          alt="Lumiere Restaurant Interior"
          className="w-full h-full object-cover object-center scale-110"
          fetchPriority="high"
          decoding="async"
        />
      </motion.div>

      {/* Dark Gradient Overlay with Gold Tint */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0D0D0D]/80 via-[#0D0D0D]/60 to-[#0D0D0D]/90" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#C9A84C]/10 via-transparent to-[#C9A84C]/5" />

      {/* Main Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto"
      >
        {/* Top Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#C9A84C] uppercase tracking-[0.4em] text-xs sm:text-sm font-medium mb-6"
        >
          Est. 2010 &bull; Paris
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-tight mb-6"
        >
          Where Cuisine
          <br />
          <span className="text-[#C9A84C]">Meets Art</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[#F5ECD7]/80 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
        >
          An extraordinary culinary journey through French haute cuisine, where
          every plate tells a story of passion, precision, and artistry. Welcome
          to Lumiere — where memories are crafted one bite at a time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link
            href="/reservation"
            className="px-8 py-4 bg-[#C9A84C] text-[#0D0D0D] font-semibold text-sm uppercase tracking-widest rounded-none hover:bg-[#F5ECD7] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#C9A84C]/30"
          >
            Reserve a Table
          </Link>
          <Link
            href="/menu"
            className="px-8 py-4 border border-[#C9A84C] text-[#C9A84C] font-semibold text-sm uppercase tracking-widest rounded-none hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-300 hover:scale-105"
          >
            View Our Menu
          </Link>
        </motion.div>

        {/* Floating Stats Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.15 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-[#C9A84C]/30 text-white rounded-full whitespace-nowrap"
              >
                <Icon className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-sm font-medium whitespace-nowrap">{stat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[#F5ECD7]/50 text-xs uppercase tracking-[0.3em]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-[#C9A84C]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
