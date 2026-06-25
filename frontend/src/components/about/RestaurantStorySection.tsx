'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const timelineItems = [
  {
    year: '2010',
    title: 'Founded in Paris',
    description:
      'Chef Antoine Dubois opened Lumiere in the 8th arrondissement of Paris with a vision to redefine fine dining — marrying classical French technique with soulful modern creativity. With just 12 tables, the restaurant quickly became a reservation that Parisians treasured.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    align: 'left',
  },
  {
    year: '2013',
    title: 'First Michelin Star',
    description:
      'Three years after opening, the Michelin Guide awarded Lumiere its first star — recognition of Chef Antoine\'s unwavering commitment to ingredient quality, technical mastery, and the profound emotion he brought to every plate. The city of Paris celebrated alongside them.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    align: 'right',
  },
  {
    year: '2016',
    title: 'Expanded to India',
    description:
      'Responding to the global appetite for authentic French haute cuisine, Lumiere opened its flagship Indian outpost in Mumbai. The team spent over a year sourcing the finest local ingredients to complement classical preparations, creating a truly transcontinental dining experience.',
    image: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80',
    align: 'left',
  },
  {
    year: '2019',
    title: 'Second Michelin Star',
    description:
      'A landmark achievement. The second Michelin star confirmed Lumiere\'s place among the world\'s great restaurants. Chef Antoine\'s tasting menu — a 12-course journey through texture, season, and memory — became one of the most sought-after dining experiences in Asia.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    align: 'right',
  },
  {
    year: '2022',
    title: 'Best Restaurant of the Year',
    description:
      'Asia\'s 50 Best Restaurants named Lumiere the Best Restaurant of the Year, cementing its status as a destination for discerning diners from every corner of the globe. The team\'s commitment to seasonal, sustainable sourcing was also recognised with a Green Star.',
    image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=800&q=80',
    align: 'left',
  },
  {
    year: '2025',
    title: 'Celebrating 15 Years',
    description:
      'Fifteen years of luminous dining. Lumiere celebrates with an exclusive anniversary tasting menu, a new chef\'s table experience, and plans for its third international location. The journey continues — always in pursuit of the perfect plate, the perfect evening, the perfect memory.',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80',
    align: 'right',
  },
];

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timelineItems)[0];
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: '-100px' });
  const isLeft = item.align === 'left';

  return (
    <div ref={itemRef} className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-24 last:mb-0">
      {/* Year connector line (desktop) */}
      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-lg shadow-[#C9A84C]/30">
          <span className="text-[#0D0D0D] font-display font-bold text-sm">{item.year}</span>
        </div>
      </div>

      {/* Left Side */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`${isLeft ? 'lg:pr-16' : 'lg:col-start-2 lg:pr-0 lg:pl-16'}`}
      >
        {isLeft ? (
          <div>
            {/* Mobile year badge */}
            <div className="lg:hidden inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center">
                <span className="text-[#0D0D0D] font-bold text-xs">{item.year}</span>
              </div>
              <div className="h-px flex-1 bg-[#C9A84C]/30" />
            </div>
            <div className="h-px w-8 bg-[#C9A84C] mb-3 hidden lg:block" />
            <h3 className="font-display text-3xl text-white mb-4">{item.title}</h3>
            <p className="text-[#F5ECD7]/60 leading-relaxed">{item.description}</p>
          </div>
        ) : (
          <div className="relative overflow-hidden group">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 border border-[#C9A84C]/20 group-hover:border-[#C9A84C]/60 transition-colors" />
          </div>
        )}
      </motion.div>

      {/* Right Side */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        className={`${isLeft ? '' : 'lg:col-start-1 lg:row-start-1 lg:pr-16'}`}
      >
        {isLeft ? (
          <div className="relative overflow-hidden group">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 border border-[#C9A84C]/20 group-hover:border-[#C9A84C]/60 transition-colors" />
          </div>
        ) : (
          <div>
            <div className="lg:hidden inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center">
                <span className="text-[#0D0D0D] font-bold text-xs">{item.year}</span>
              </div>
              <div className="h-px flex-1 bg-[#C9A84C]/30" />
            </div>
            <div className="h-px w-8 bg-[#C9A84C] mb-3 hidden lg:block" />
            <h3 className="font-display text-3xl text-white mb-4">{item.title}</h3>
            <p className="text-[#F5ECD7]/60 leading-relaxed">{item.description}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function RestaurantStorySection() {
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
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
              Timeline
            </span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            Fifteen Years of{' '}
            <span className="text-[#C9A84C]">Luminous Dining</span>
          </h2>
          <p className="text-[#F5ECD7]/60 max-w-xl mx-auto">
            From a small Parisian bistro to a globally celebrated dining institution
            — the story of Lumiere is a story of passion made manifest.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[#C9A84C]/20 -translate-x-1/2" />

          {timelineItems.map((item, index) => (
            <TimelineItem key={item.year} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
