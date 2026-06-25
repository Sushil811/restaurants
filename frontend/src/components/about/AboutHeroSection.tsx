'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function AboutHeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative h-[70vh] min-h-[500px] flex flex-col justify-end overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1920&q=80"
          alt="Lumiere Restaurant Interior"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-[#0D0D0D]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-[#F5ECD7]/50 mb-6"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-[#C9A84C] transition-colors">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#C9A84C]">About</span>
        </motion.nav>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-px w-10 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
            Est. 2010 • Paris
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl text-white leading-none"
        >
          Our{' '}
          <span className="text-[#C9A84C]">Story</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-[#F5ECD7]/60 text-lg max-w-xl mt-4"
        >
          A journey of passion, dedication, and the relentless pursuit of
          culinary excellence — from Paris to the world.
        </motion.p>
      </div>
    </section>
  );
}
