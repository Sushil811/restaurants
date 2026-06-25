'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sophie Beaumont',
    location: 'London, UK',
    rating: 5,
    date: 'March 2025',
    review:
      "Lumiere is in a class of its own. We celebrated our anniversary here and every detail was perfect — from the amuse-bouche to the mignardises. The service is warm yet impeccably refined. Chef Antoine's tasting menu is a spiritual experience.",
    avatar: 'https://ui-avatars.com/api/?name=Sophie+Beaumont&background=C9A84C&color=0D0D0D&size=80',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    location: 'Mumbai, India',
    rating: 5,
    date: 'January 2025',
    review:
      "I've dined at restaurants across three continents, and Lumiere stands among the very finest. The Tournedos Rossini was transcendent — I could not speak for a full minute after the first bite. A masterpiece of culinary art.",
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=C9A84C&color=0D0D0D&size=80',
  },
  {
    id: 3,
    name: 'Claire Fontaine',
    location: 'Paris, France',
    rating: 5,
    date: 'December 2024',
    review:
      "As a Parisian, I am notoriously difficult to impress. Lumiere not only impressed me — it moved me to tears. The duck confit was prepared with a technique and love I have rarely encountered. Bravo, Chef. Truly extraordinary.",
    avatar: 'https://ui-avatars.com/api/?name=Claire+Fontaine&background=C9A84C&color=0D0D0D&size=80',
  },
  {
    id: 4,
    name: 'Rahul & Priya Kapoor',
    location: 'Delhi, India',
    rating: 5,
    date: 'November 2024',
    review:
      "Our proposal dinner at Lumiere was everything we dreamed of. The staff arranged fresh flowers and a personalised dessert with our names in chocolate. We will never forget this evening — it is the most magical night of our lives.",
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Kapoor&background=C9A84C&color=0D0D0D&size=80',
  },
  {
    id: 5,
    name: 'James Whitfield',
    location: 'New York, USA',
    rating: 5,
    date: 'October 2024',
    review:
      "I've covered restaurant openings for The New York Times for 20 years. Lumiere is the rarest of things — a restaurant that manages to be both deeply luxurious and deeply human. Come hungry, leave transformed.",
    avatar: 'https://ui-avatars.com/api/?name=James+Whitfield&background=C9A84C&color=0D0D0D&size=80',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-[#C9A84C]/20'}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [autoplayPlugin.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0D0D0D] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
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
              Testimonials
            </span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white">
            What Our Guests Say
          </h2>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex-[0_0_90%] sm:flex-[0_0_70%] lg:flex-[0_0_50%] min-w-0"
                >
                  <div className="bg-[#141414] border border-white/5 p-8 h-full flex flex-col">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-[#C9A84C]/30 fill-[#C9A84C]/10 mb-5" />

                    {/* Review */}
                    <p className="text-[#F5ECD7]/70 leading-relaxed text-base italic flex-1 mb-8">
                      "{t.review}"
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-4">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-full border-2 border-[#C9A84C]/40"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-white">{t.name}</div>
                        <div className="text-[#F5ECD7]/40 text-sm">{t.location}</div>
                        <StarRating rating={t.rating} />
                      </div>
                      <div className="text-[#C9A84C]/50 text-xs self-start">{t.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={scrollPrev}
              className="w-11 h-11 border border-[#C9A84C]/40 text-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === selectedIndex
                      ? 'w-6 h-2 bg-[#C9A84C]'
                      : 'w-2 h-2 bg-[#C9A84C]/30 hover:bg-[#C9A84C]/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="w-11 h-11 border border-[#C9A84C]/40 text-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
