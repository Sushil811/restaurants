'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Instagram, Twitter, Linkedin } from '@/components/shared/BrandIcons';

const chefs = [
  {
    id: 1,
    name: 'Chef Antoine Dubois',
    role: 'Executive Chef & Co-Founder',
    bio: 'Trained at Le Cordon Bleu Paris and honed his craft under the legendary Alain Ducasse. Antoine brings 25 years of Michelin-starred experience to every dish, believing that cooking is ultimately an act of love made visible.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80',
    social: {
      instagram: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    id: 2,
    name: 'Chef Isabelle Martin',
    role: 'Sous Chef',
    bio: 'A graduate of École Ferrandi Paris, Isabelle spent five years in Lyon before joining Lumiere. Her mastery of classical sauces and ability to develop complex flavour profiles make her the backbone of the kitchen brigade.',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80',
    social: {
      instagram: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    id: 3,
    name: 'Chef Raj Sharma',
    role: 'Pastry Chef',
    bio: 'Raj blends French pâtisserie precision with subtle South Asian influences to create desserts that are as intellectually stimulating as they are delicious. His signature cardamom mille-feuille has a six-month waiting list.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    social: {
      instagram: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    id: 4,
    name: 'Chef Priya Nair',
    role: 'Head of Desserts',
    bio: 'Priya\'s desserts are edible poetry — each one a careful composition of colour, texture, and unexpected flavour. Her chocolate work has been featured in Condé Nast Traveller and she holds a gold medal from the World Pastry Championship.',
    image: 'https://images.unsplash.com/photo-1583394293214-ce65bdda4d70?w=400&q=80',
    social: {
      instagram: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
];

function ChefCard({ chef, index }: { chef: (typeof chefs)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={chef.image}
          alt={chef.name}
          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-600"
        />

        {/* Hover Bio Overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#0D0D0D]/90 flex flex-col justify-center p-8"
            >
              <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3">
                {chef.role}
              </p>
              <h3 className="font-display text-2xl text-white mb-4">{chef.name}</h3>
              <p className="text-[#F5ECD7]/70 text-sm leading-relaxed">{chef.bio}</p>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                <a
                  href={chef.social.instagram}
                  className="w-9 h-9 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-200"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={chef.social.twitter}
                  className="w-9 h-9 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-200"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={chef.social.linkedin}
                  className="w-9 h-9 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom gradient (default) */}
        {!hovered && (
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
        )}
      </div>

      {/* Card Footer */}
      <div className="bg-[#111111] border-t border-[#C9A84C]/20 px-6 py-5 group-hover:border-[#C9A84C]/60 transition-colors">
        <h3 className="font-display text-lg text-white group-hover:text-[#C9A84C] transition-colors">
          {chef.name}
        </h3>
        <p className="text-[#F5ECD7]/50 text-sm mt-1">{chef.role}</p>
      </div>
    </motion.div>
  );
}

export default function ChefsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section className="bg-[#0D0D0D] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
              Our Team
            </span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            The Artists Behind
            <br />
            <span className="text-[#C9A84C]">Every Dish</span>
          </h2>
          <p className="text-[#F5ECD7]/60 max-w-xl mx-auto">
            World-class talent united by a shared obsession with perfection.
            Hover over a card to learn their story.
          </p>
        </motion.div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chefs.map((chef, index) => (
            <ChefCard key={chef.id} chef={chef} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
