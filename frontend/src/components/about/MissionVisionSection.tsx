'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Eye, Leaf, Award, Lightbulb, Heart } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Authenticity',
    description: 'Every dish tells an honest story of its origins and the hands that crafted it.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We accept nothing less than the finest — in ingredients, technique, and service.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We source responsibly, reduce waste, and honour the planet that feeds us.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Classical foundations, contemporary vision — always pushing culinary boundaries.',
  },
];

export default function MissionVisionSection() {
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
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
              Purpose
            </span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-[#0D0D0D]">
            Our Mission &amp; Vision
          </h2>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative p-10 border border-[#C9A84C]/30 bg-white/60 backdrop-blur-md overflow-hidden group hover:border-[#C9A84C]/70 transition-colors duration-300"
          >
            {/* Glassmorphism sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />
            {/* Gold corner */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#C9A84C]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#C9A84C]" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#C9A84C]" />
              </div>
              <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
                Our Mission
              </span>
              <h3 className="font-display text-2xl text-[#0D0D0D] mt-3 mb-5 leading-snug">
                Creating Extraordinary Dining Experiences
              </h3>
              <p className="text-[#0D0D0D]/60 leading-relaxed">
                To create extraordinary dining experiences that transcend the
                ordinary — where every guest feels seen, celebrated, and nourished
                in body and spirit. We exist to transform a meal into a memory
                that endures long after the last course is served.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative p-10 border border-[#C9A84C]/30 bg-white/60 backdrop-blur-md overflow-hidden group hover:border-[#C9A84C]/70 transition-colors duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#C9A84C]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#C9A84C]" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-[#C9A84C]" />
              </div>
              <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
                Our Vision
              </span>
              <h3 className="font-display text-2xl text-[#0D0D0D] mt-3 mb-5 leading-snug">
                Redefining Luxury Dining Globally
              </h3>
              <p className="text-[#0D0D0D]/60 leading-relaxed">
                To redefine luxury dining for a new generation — proving that the
                highest standards of gastronomy need not come at the expense of
                warmth, sustainability, or cultural sensitivity. Lumiere will
                be the restaurant that the world talks about, and the world comes
                back to.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mb-10"
        >
          <h3 className="font-display text-3xl text-[#0D0D0D] mb-2">Core Values</h3>
          <div className="h-px w-16 bg-[#C9A84C] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="text-center p-6 border border-[#C9A84C]/20 hover:border-[#C9A84C]/60 hover:bg-white/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C9A84C]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <h4 className="font-display text-lg text-[#0D0D0D] mb-2">{value.title}</h4>
                <p className="text-[#0D0D0D]/55 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
