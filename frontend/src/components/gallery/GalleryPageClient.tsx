'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ZoomIn, Play, X, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const TABS = ['Food Gallery', 'Restaurant Gallery', 'Events Gallery', 'Videos'] as const;
type Tab = (typeof TABS)[number];

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: Tab;
  span?: 'tall' | 'wide' | 'normal';
}

const FOOD_IMAGES: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=800&q=80',
    alt: 'Pan-seared duck breast with cherry reduction',
    category: 'Food Gallery',
    span: 'tall',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    alt: 'Artisan pizza with fresh basil',
    category: 'Food Gallery',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    alt: 'Gourmet salmon fillet with asparagus',
    category: 'Food Gallery',
    span: 'tall',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    alt: 'Chocolate fondant with vanilla ice cream',
    category: 'Food Gallery',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    alt: 'Wagyu beef tenderloin',
    category: 'Food Gallery',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80',
    alt: 'Fresh oysters on ice',
    category: 'Food Gallery',
    span: 'tall',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
    alt: 'Crème brûlée with fresh berries',
    category: 'Food Gallery',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    alt: 'Colorful vegetable medley',
    category: 'Food Gallery',
  },
  {
    id: '9',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    alt: 'Fine dining presentation',
    category: 'Food Gallery',
    span: 'tall',
  },
  {
    id: '10',
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    alt: 'Artisan cheese platter',
    category: 'Food Gallery',
  },
];

const RESTAURANT_IMAGES: GalleryImage[] = [
  {
    id: 'r1',
    src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80',
    alt: 'Lumiere main dining room',
    category: 'Restaurant Gallery',
    span: 'tall',
  },
  {
    id: 'r2',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    alt: 'Elegant bar and lounge area',
    category: 'Restaurant Gallery',
  },
  {
    id: 'r3',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    alt: 'Private dining experience',
    category: 'Restaurant Gallery',
  },
  {
    id: 'r4',
    src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80',
    alt: 'Chef\'s open kitchen',
    category: 'Restaurant Gallery',
    span: 'tall',
  },
  {
    id: 'r5',
    src: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80',
    alt: 'Wine cellar and selection',
    category: 'Restaurant Gallery',
  },
  {
    id: 'r6',
    src: 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=800&q=80',
    alt: 'Outdoor terrace dining',
    category: 'Restaurant Gallery',
  },
];

const EVENTS_IMAGES: GalleryImage[] = [
  {
    id: 'e1',
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    alt: 'Elegant wedding reception',
    category: 'Events Gallery',
    span: 'tall',
  },
  {
    id: 'e2',
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    alt: 'Corporate gala dinner',
    category: 'Events Gallery',
  },
  {
    id: 'e3',
    src: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80',
    alt: 'Private birthday celebration',
    category: 'Events Gallery',
  },
  {
    id: 'e4',
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    alt: 'Champagne reception',
    category: 'Events Gallery',
    span: 'tall',
  },
  {
    id: 'e5',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    alt: 'Business networking event',
    category: 'Events Gallery',
  },
  {
    id: 'e6',
    src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80',
    alt: 'Anniversary dinner setting',
    category: 'Events Gallery',
  },
];

const VIDEOS = [
  {
    id: 'v1',
    title: 'A Day in the Lumiere Kitchen',
    duration: '4:32',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Follow our head chef through a full day of preparation, passion, and plating perfection.',
  },
  {
    id: 'v2',
    title: 'The Art of French Cuisine',
    duration: '6:15',
    thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'A deep dive into the classical techniques that define Lumiere\'s culinary philosophy.',
  },
  {
    id: 'v3',
    title: 'Private Events at Lumiere',
    duration: '3:48',
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Transform your special occasions into extraordinary memories in our private dining rooms.',
  },
];

const ALL_IMAGES = [...FOOD_IMAGES, ...RESTAURANT_IMAGES, ...EVENTS_IMAGES];

export default function GalleryPageClient() {
  const [activeTab, setActiveTab] = useState<Tab>('Food Gallery');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const currentImages = ALL_IMAGES.filter((img) => img.category === activeTab);

  const lightboxSlides = currentImages.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/70 via-[#0D0D0D]/50 to-[#0D0D0D]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase font-medium mb-3"
          >
            Visual Journey
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-playfair text-4xl md:text-6xl text-white mb-4"
          >
            Our Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#F5ECD7]/70 max-w-xl text-base md:text-lg"
          >
            Every frame tells a story of culinary artistry, elegant spaces, and unforgettable moments.
          </motion.p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                  activeTab === tab
                    ? 'text-[#C9A84C]'
                    : 'text-[#F5ECD7]/50 hover:text-[#F5ECD7]/80'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="gallery-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {activeTab !== 'Videos' ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
            >
              {currentImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className={`break-inside-avoid relative overflow-hidden rounded-lg cursor-pointer group ${
                    image.span === 'tall' ? 'row-span-2' : ''
                  }`}
                  onClick={() => openLightbox(index)}
                >
                  <div
                    className={`relative overflow-hidden ${
                      image.span === 'tall' ? 'aspect-[2/3]' : 'aspect-square'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-[#0D0D0D]/0 group-hover:bg-[#0D0D0D]/50 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center">
                          <ZoomIn className="w-5 h-5 text-[#0D0D0D]" />
                        </div>
                        <p className="text-white text-xs text-center px-2 leading-tight max-w-[120px]">
                          {image.alt}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {VIDEOS.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[#C9A84C]/40 transition-all duration-300 group"
                >
                  {playingVideo === video.id ? (
                    <div className="relative aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                      />
                      <button
                        onClick={() => setPlayingVideo(null)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="relative aspect-video cursor-pointer"
                      onClick={() => setPlayingVideo(video.id)}
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[#0D0D0D]/40 group-hover:bg-[#0D0D0D]/20 transition-all duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 text-[#0D0D0D] ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-[#0D0D0D]/80 text-[#F5ECD7] text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-playfair text-lg text-[#F5ECD7] mb-2 group-hover:text-[#C9A84C] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-[#F5ECD7]/60 text-sm leading-relaxed">{video.description}</p>
                    <button
                      onClick={() => setPlayingVideo(video.id)}
                      className="mt-4 flex items-center gap-2 text-[#C9A84C] text-sm font-medium hover:gap-3 transition-all duration-200"
                    >
                      Watch Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Lightbox */}
      {activeTab !== 'Videos' && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          index={lightboxIndex}
        />
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="border border-[#C9A84C]/30 rounded-2xl p-10 md:p-16 bg-gradient-to-br from-[#C9A84C]/5 to-transparent">
          <p className="text-[#C9A84C] text-sm tracking-widest uppercase mb-3">Book Your Experience</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-[#F5ECD7] mb-4">
            Be Part of Our Story
          </h2>
          <p className="text-[#F5ECD7]/60 max-w-md mx-auto mb-8">
            Reserve your table and create your own unforgettable moments at Lumiere.
          </p>
          <a
            href="/reservation"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A84C] to-[#e0c06a] text-[#0D0D0D] px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Reserve a Table <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
