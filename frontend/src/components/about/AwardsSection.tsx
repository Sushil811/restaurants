'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Star, Wine, Trophy, ShieldCheck, Landmark } from 'lucide-react';

interface AwardItem {
  icon: React.ReactNode;
  title: string;
  organization: string;
  year: string;
  description: string;
}

export default function AwardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const awards: AwardItem[] = [
    {
      icon: (
        <div className="flex gap-1 justify-center">
          <Star className="w-5 h-5 text-gold fill-gold animate-pulse" />
          <Star className="w-5 h-5 text-gold fill-gold animate-pulse" style={{ animationDelay: '0.2s' }} />
          <Star className="w-5 h-5 text-gold fill-gold animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      ),
      title: 'Three Michelin Stars',
      organization: 'Michelin Guide',
      year: '2021 – 2026',
      description: 'Awarded three Michelin Stars for exceptional cuisine, representing the highest culinary honor in gastronomy.',
    },
    {
      icon: <Trophy className="w-8 h-8 text-gold" />,
      title: "World's 50 Best Restaurants",
      organization: 'S.Pellegrino & Acqua Panna',
      year: 'Ranked #8 Globally',
      description: 'Recognized among the top 10 finest dining destinations in the world, celebrating innovation and hospitality.',
    },
    {
      icon: <Wine className="w-8 h-8 text-gold" />,
      title: 'Grand Award',
      organization: 'Wine Spectator',
      year: '2023 – 2026',
      description: 'Honored for our cellar of over 1,500 selections, representing the pinnacle of wine list programs worldwide.',
    },
    {
      icon: <Award className="w-8 h-8 text-gold" />,
      title: '5-Star Rating',
      organization: 'Forbes Travel Guide',
      year: 'Consecutive Recipient',
      description: 'Reflecting our dedication to flawless luxury service, pristine environment, and outstanding overall experience.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gold" />,
      title: 'Best Culinary Team',
      organization: 'International Gastronomy Association',
      year: 'Winner 2025',
      description: 'Acknowledging the creativity, technical precision, and collaborative spirit of our kitchen and pastry team.',
    },
    {
      icon: <Landmark className="w-8 h-8 text-gold" />,
      title: 'Heritage Preservation Award',
      organization: 'L’Art de Vivre Foundation',
      year: 'Excellence In Architecture',
      description: 'Celebrating the exquisite restoration and design of our historic dining room, blending classicism and modernism.',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section ref={containerRef} className="py-24 bg-charcoal-900 border-t border-b border-neutral-900/50 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-950/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-950/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-gold-500" />
            <span className="text-gold tracking-[0.25em] text-xs font-semibold uppercase">
              Distinctions & Accolades
            </span>
            <div className="h-[1px] w-8 bg-gold-500" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white font-bold leading-tight mb-4">
            Global Recognition
          </h2>
          <p className="text-sm font-sans text-neutral-400 leading-relaxed">
            Our unwavering commitment to culinary art, exceptional wine programs, and hospitality standards has earned Lumiere the industry’s most prestigious accolades.
          </p>
        </div>

        {/* Awards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {awards.map((award, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="bg-charcoal-950 border border-neutral-850 p-8 flex flex-col items-center text-center group hover:border-gold-900/40 hover:shadow-glow transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mb-6 group-hover:scale-105 border border-neutral-800 transition-all duration-300">
                {award.icon}
              </div>

              {/* Title & Info */}
              <span className="text-gold-500 text-3xs font-semibold tracking-widest uppercase mb-1">
                {award.organization}
              </span>
              <h3 className="font-display text-lg text-white font-semibold mb-2 group-hover:text-gold transition-colors">
                {award.title}
              </h3>
              <span className="inline-block px-3 py-1 text-2xs bg-neutral-900 border border-neutral-800 text-neutral-400 font-medium rounded-full mb-4">
                {award.year}
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-auto">
                {award.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
