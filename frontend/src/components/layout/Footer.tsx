'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  ArrowRight
} from 'lucide-react';
import { Facebook, Instagram, Twitter } from '@/components/shared/BrandIcons';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com', label: 'Twitter' },
  ];

  const quickLinks = [
    { name: 'Our Menu', href: '/menu' },
    { name: 'About Us', href: '/about' },
    { name: 'Reservations', href: '/reservation' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="relative bg-charcoal-950 text-neutral-300 pt-20 pb-10 border-t border-gold-900/30 overflow-hidden">
      {/* Decorative Gold Light Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Column 1: About (Logo & Desc) */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl lg:text-3xl text-gold tracking-luxury font-bold">
                LUMIERE
              </span>
              <p className="text-2xs text-gold-400 tracking-widest uppercase mt-1">
                Haute Cuisine & Lounge
              </p>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">
              Experience the pinnacle of culinary artistry at Lumiere. We combine classic French heritage with modern gastronomy, crafting memorable moments in a setting of timeless elegance.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-neutral-800 text-neutral-400 hover:border-gold hover:text-gold transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6 md:pl-8 lg:pl-12">
            <h4 className="font-display text-lg text-gold tracking-wider font-semibold">
              Quick Links
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href as any}
                    className="hover:text-gold transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-600 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Hours & Location */}
          <div className="space-y-6">
            <h4 className="font-display text-lg text-gold tracking-wider font-semibold">
              Hours & Location
            </h4>
            <div className="space-y-4 font-sans text-sm text-neutral-400">
              <div className="space-y-1">
                <p className="text-neutral-200 font-semibold">Dinner Service</p>
                <p>Monday – Thursday: 5:00 PM – 10:00 PM</p>
                <p>Friday – Saturday: 5:00 PM – 11:00 PM</p>
                <p>Sunday Brunch: 11:00 AM – 3:00 PM</p>
                <p>Sunday Dinner: 5:00 PM – 9:30 PM</p>
              </div>
              <div className="pt-2 space-y-2 border-t border-neutral-900">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-gold transition-colors duration-200"
                >
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>123 Rue de la Lumiere, Paris, France</span>
                </a>
                <a
                  href="tel:+33123456789"
                  className="flex items-center gap-2 hover:text-gold transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <span>+33 1 23 45 67 89</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="font-display text-lg text-gold tracking-wider font-semibold">
              Newsletter
            </h4>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">
              Subscribe to receive updates about special dining events, wine dinners, and seasonal menu changes.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3 font-sans">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-charcoal-900 border border-neutral-800 rounded-none py-3 pl-4 pr-12 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-0 h-full px-4 border-l border-neutral-800 text-gold-500 hover:text-gold transition-colors duration-300"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-gold-400 mt-1"
                >
                  Thank you! You have been subscribed successfully.
                </motion.p>
              )}
            </form>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] bg-neutral-900 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 font-sans">
          <p>© {new Date().getFullYear()} Lumiere Restaurant. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href={"/privacy" as any} className="hover:text-gold transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href={"/terms" as any} className="hover:text-gold transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href={"/sitemap" as any} className="hover:text-gold transition-colors duration-200">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
