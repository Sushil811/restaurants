'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CalendarDays, Clock, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ReservationCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
          alt="Lumiere Restaurant"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0D0D0D]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/50 via-transparent to-[#0D0D0D]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
              Reservations
            </span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>

          <h2 className="font-display text-5xl sm:text-6xl text-white mb-6 leading-tight">
            Reserve Your
            <br />
            <span className="text-[#C9A84C]">Table</span>
          </h2>

          <p className="text-[#F5ECD7]/70 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Every great evening begins with a reservation. Secure your table
            at Lumiere and let us craft an unforgettable experience tailored
            to every detail of your occasion.
          </p>

          {/* Quick Info Pills */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { icon: CalendarDays, text: 'Open 7 days a week' },
              { icon: Clock, text: 'Lunch & Dinner Service' },
              { icon: Users, text: 'Private Dining Available' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 text-[#F5ECD7]/80 text-sm"
                >
                  <Icon className="w-4 h-4 text-[#C9A84C]" />
                  {item.text}
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href="/reservation"
              className="inline-flex items-center gap-3 px-12 py-5 bg-[#C9A84C] text-[#0D0D0D] font-semibold text-sm uppercase tracking-widest hover:bg-[#F5ECD7] transition-all duration-300 shadow-lg shadow-[#C9A84C]/30 hover:shadow-[#C9A84C]/50 hover:scale-105"
            >
              Make a Reservation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Phone */}
          <p className="text-[#F5ECD7]/40 text-sm mt-8">
            Or call us at{' '}
            <a
              href="tel:+911234567890"
              className="text-[#C9A84C] hover:underline"
            >
              +91 12345 67890
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
