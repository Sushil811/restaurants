'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, ShoppingBag, Tag } from 'lucide-react';

const specials = [
  {
    id: 1,
    name: "Duck à l'Orange",
    description: 'Slow-braised duck confit with orange beurre blanc, wild mushroom duxelles, and haricots verts.',
    originalPrice: 3800,
    specialPrice: 2650,
    badge: "Chef's Pick",
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  },
  {
    id: 2,
    name: 'Sea Bass en Papillote',
    description: 'Chilean sea bass steamed in parchment with saffron, cherry tomatoes, olives, and fennel.',
    originalPrice: 4200,
    specialPrice: 2990,
    badge: 'Today Only',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  },
  {
    id: 3,
    name: 'Crème Brûlée Tasting',
    description: 'A trio of classic vanilla, lavender honey, and dark chocolate crème brûlée with seasonal berries.',
    originalPrice: 1500,
    specialPrice: 990,
    badge: 'Limited',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
  },
];

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function getTimeUntilMidnight() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.floor((midnight.getTime() - now.getTime()) / 1000);
      return {
        hours: Math.floor(diff / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
      };
    }

    setTimeLeft(getTimeUntilMidnight());
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] font-display text-3xl font-bold w-16 h-16 flex items-center justify-center">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[#F5ECD7]/50 text-xs uppercase tracking-widest mt-1.5">{label}</span>
    </div>
  );
}

export default function TodaysSpecialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const { hours, minutes, seconds } = useCountdown();

  return (
    <section
      ref={sectionRef}
      className="bg-[#0A0A0A] py-24 px-4 sm:px-6 lg:px-8 border-t border-[#C9A84C]/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <Tag className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
              Daily Specials
            </span>
            <Tag className="w-4 h-4 text-[#C9A84C]" />
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            Today's Chef's Selection
          </h2>
          <p className="text-[#F5ECD7]/60 max-w-xl mx-auto mb-8">
            Exclusive creations available only for today. Reserve your experience before they're gone.
          </p>

          {/* Countdown Timer */}
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 text-[#F5ECD7]/60 text-sm">
              <Clock className="w-4 h-4 text-[#C9A84C]" />
              Offer ends at midnight
            </div>
            <div className="flex items-center gap-3">
              <CountdownUnit value={hours} label="Hours" />
              <span className="text-[#C9A84C] font-display text-3xl font-bold pb-5">:</span>
              <CountdownUnit value={minutes} label="Mins" />
              <span className="text-[#C9A84C] font-display text-3xl font-bold pb-5">:</span>
              <CountdownUnit value={seconds} label="Secs" />
            </div>
          </div>
        </motion.div>

        {/* Specials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {specials.map((special, index) => (
            <motion.div
              key={special.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-[#141414] border border-white/5 overflow-hidden hover:border-[#C9A84C]/40 transition-all duration-400 hover:shadow-[0_0_25px_rgba(201,168,76,0.12)]"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={special.image}
                  alt={special.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Special Badge */}
                <div className="absolute top-3 right-3 bg-[#C9A84C] text-[#0D0D0D] text-xs font-bold uppercase px-3 py-1 tracking-wider">
                  {special.badge}
                </div>
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl text-white mb-2 group-hover:text-[#C9A84C] transition-colors">
                  {special.name}
                </h3>
                <p className="text-[#F5ECD7]/50 text-sm leading-relaxed mb-5">
                  {special.description}
                </p>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-end gap-3">
                    <span className="font-display text-2xl font-bold text-[#C9A84C]">
                      ₹{special.specialPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#F5ECD7]/30 line-through text-sm pb-0.5">
                      ₹{special.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="bg-green-900/40 border border-green-600/30 text-green-400 text-xs px-2 py-1 rounded">
                    {Math.round(((special.originalPrice - special.specialPrice) / special.originalPrice) * 100)}% OFF
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A84C] text-[#0D0D0D] text-sm font-semibold uppercase tracking-widest hover:bg-[#F5ECD7] transition-colors duration-200"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
