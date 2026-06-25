'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  Filter,
  SortAsc,
  CheckCircle,
  MessageSquare,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  verified: boolean;
  images?: string[];
  adminReply?: {
    text: string;
    date: string;
  };
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Isabelle Fontaine',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    date: '2024-11-28',
    rating: 5,
    title: 'An absolutely transcendent dining experience',
    body: "Lumiere exceeded every expectation I had. From the moment we walked through the door, the ambiance was ethereal — soft candlelight, impeccable table settings, and a warmth that made us feel like royalty. The tasting menu was a masterclass in French cuisine. The duck confit with truffle jus was extraordinary, and the sommelier's wine pairing was nothing short of inspired. This is not just a restaurant; it is an art form.",
    helpful: 47,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=400&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    ],
    adminReply: {
      text: "Dear Isabelle, thank you so much for your heartfelt words. It was our absolute pleasure to welcome you and to share our passion for French cuisine. We look forward to creating more beautiful memories with you at Lumiere. With warmth, Chef Laurent.",
      date: '2024-11-29',
    },
  },
  {
    id: 'r2',
    author: 'Marcus Beaumont',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    date: '2024-11-20',
    rating: 5,
    title: 'Perfect anniversary dinner — exceeded all expectations',
    body: "My wife and I celebrated our 10th anniversary at Lumiere, and it was the finest dining experience of our lives. The staff anticipated our every need without being intrusive. The scallops with cauliflower purée were divine, and the chocolate soufflé was a revelation. The private booth they arranged for us made the evening feel truly special.",
    helpful: 34,
    verified: true,
  },
  {
    id: 'r3',
    author: 'Sophie Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    date: '2024-11-15',
    rating: 4,
    title: 'Exceptional food, slight wait time for service',
    body: "The cuisine at Lumiere is genuinely world-class. Every dish was beautifully presented and flavors were complex and satisfying. My only minor note is that service felt slightly stretched on a busy Saturday evening — our sommelier took a bit longer than expected. However, this did not diminish the overall quality of the experience. The lobster bisque alone is worth the visit.",
    helpful: 22,
    verified: true,
    adminReply: {
      text: "Dear Sophie, thank you for your honest and thoughtful feedback. We sincerely apologize for the wait you experienced on Saturday evening. We are actively working to ensure our service remains impeccable even during our busiest nights. Your loyalty means everything to us.",
      date: '2024-11-16',
    },
  },
  {
    id: 'r4',
    author: 'Thomas Harrington',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    date: '2024-11-10',
    rating: 5,
    title: 'The chef\'s table experience is unparalleled',
    body: "We were fortunate enough to book the chef's table, and it was a truly unforgettable evening. Watching Chef Laurent work with such precision and passion was mesmerizing. Each course was explained with genuine enthusiasm. The Wagyu beef with black truffle was perhaps the finest thing I have ever eaten. Book the chef's table if you can — it's worth every penny.",
    helpful: 56,
    verified: true,
    images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80'],
  },
  {
    id: 'r5',
    author: 'Amélie Rousseau',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    date: '2024-10-28',
    rating: 4,
    title: 'Beautiful setting, excellent tasting menu',
    body: "Lumiere is everything a fine dining restaurant should be. The décor is elegant without being ostentatious, and the service is attentive and knowledgeable. The vegetarian tasting menu was thoughtfully curated and showed real creativity. The mushroom risotto and truffle shavings course was a personal highlight. Would highly recommend for special occasions.",
    helpful: 19,
    verified: true,
  },
  {
    id: 'r6',
    author: 'James Whitmore',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    date: '2024-10-20',
    rating: 3,
    title: 'Good but not quite worth the premium price',
    body: "I had high expectations based on the reviews, and while the food was certainly of high quality, I found some dishes slightly under-seasoned. The foie gras was excellent, but the main course felt inconsistent. The wine selection is superb, and the dessert course redeemed the evening. Service was professional throughout. Perhaps I caught an off night.",
    helpful: 12,
    verified: false,
    adminReply: {
      text: "Dear James, we appreciate you sharing your experience honestly. Consistency is our highest priority, and we are sorry to hear some dishes did not meet our usual standard. We would love to welcome you again and ensure a truly exceptional experience.",
      date: '2024-10-21',
    },
  },
  {
    id: 'r7',
    author: 'Claire Moreau',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    date: '2024-10-12',
    rating: 5,
    title: 'The best birthday dinner I could have wished for',
    body: "The team at Lumiere made my 30th birthday absolutely magical. They had arranged a small personalised dessert with my name and a birthday message from the chef. Every dish was exquisite, and the staff were attentive and warm. The champagne selection was impeccable. I will be returning every year without question.",
    helpful: 38,
    verified: true,
    images: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80'],
  },
  {
    id: 'r8',
    author: 'Robert Klein',
    avatar: 'https://images.unsplash.com/photo-1553267751-1c148a7280a1?w=100&q=80',
    date: '2024-09-30',
    rating: 5,
    title: 'Corporate event hosted perfectly',
    body: "We hosted a client dinner for 12 at Lumiere's private dining room, and it could not have gone smoother. The events team coordinated everything flawlessly — menu, wine, dietary requirements. Our clients were extremely impressed. The food was outstanding and the service was seamless. It was a significant factor in closing a major business deal. Lumiere is our go-to for important client entertaining.",
    helpful: 29,
    verified: true,
  },
  {
    id: 'r9',
    author: 'Natasha Volkov',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    date: '2024-09-18',
    rating: 2,
    title: 'Disappointed given the reputation',
    body: "I visited based on the stellar reviews and left feeling underwhelmed. The reservation was lost when I arrived, causing a 20-minute wait for a table. While the staff apologised, the experience was marred from the start. The food was good but did not justify the price point. The crème brûlée had a slightly hollow sweetness. I may give it another chance, but I expected better.",
    helpful: 8,
    verified: true,
    adminReply: {
      text: "Dear Natasha, we are truly sorry for the reservation issue and any inconvenience it caused. This is not our standard of service, and we have taken steps to ensure this does not happen again. Please contact us directly — we would like to offer you a complimentary return visit.",
      date: '2024-09-19',
    },
  },
  {
    id: 'r10',
    author: 'David Okafor',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&q=80',
    date: '2024-09-05',
    rating: 5,
    title: 'Simply flawless — a Michelin-star worthy experience',
    body: "Having dined at several Michelin-starred restaurants across Europe, I can say Lumiere holds its own beautifully. The attention to detail in every component — from the amuse-bouche to the petit fours — demonstrated a kitchen operating at the highest level. Chef Laurent's take on bouillabaisse is genuinely revolutionary. The dining room has a quiet confidence that is deeply reassuring.",
    helpful: 63,
    verified: true,
  },
  {
    id: 'r11',
    author: 'Emily Bradford',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80',
    date: '2024-08-20',
    rating: 4,
    title: 'Elegant and memorable — a special occasion staple',
    body: "We come to Lumiere for every major celebration, and it never disappoints. The seasonal menu always surprises with something new and inspired. The herbed lamb rack on our last visit was breathtaking. The wine list is extensive without being intimidating — the sommelier made brilliant recommendations within our budget. A true gem.",
    helpful: 17,
    verified: true,
  },
  {
    id: 'r12',
    author: 'François Dupont',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80',
    date: '2024-08-10',
    rating: 5,
    title: 'As a Frenchman, I approve wholeheartedly',
    body: "I am from Lyon, and I am notoriously demanding about French cuisine. Lumiere made me feel completely at home. The classical techniques are executed with finesse, and there are beautiful contemporary touches that feel earned rather than gratuitous. The côte de bœuf for two was superb. The cheese trolley selection was, frankly, exceptional. Bravo, Chef Laurent.",
    helpful: 44,
    verified: true,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 8 },
  { stars: 4, count: 2 },
  { stars: 3, count: 1 },
  { stars: 2, count: 1 },
  { stars: 1, count: 0 },
];
const TOTAL_REVIEWS = RATING_BREAKDOWN.reduce((a, b) => a + b.count, 0);
const AVG_RATING =
  RATING_BREAKDOWN.reduce((a, b) => a + b.stars * b.count, 0) / TOTAL_REVIEWS;

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-white/20'}
        />
      ))}
    </div>
  );
}

function InteractiveStarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={28}
            className={
              star <= (hovered || value)
                ? 'fill-[#C9A84C] text-[#C9A84C]'
                : 'text-white/30'
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPageClient() {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'rating'>('newest');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 5;

  const handleHelpful = (id: string) => {
    if (votedIds.has(id)) return;
    setHelpfulVotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setVotedIds((prev) => new Set(prev).add(id));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRating === 0) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setShowWriteModal(false);
      setFormSubmitted(false);
      setFormRating(0);
      setFormTitle('');
      setFormBody('');
    }, 2500);
  };

  const filtered = MOCK_REVIEWS.filter((r) =>
    filterRating ? r.rating === filterRating : true
  ).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'helpful')
      return (b.helpful + (helpfulVotes[b.id] || 0)) - (a.helpful + (helpfulVotes[a.id] || 0));
    return b.rating - a.rating;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 to-[#0D0D0D]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-2">Guest Voices</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="font-playfair text-4xl md:text-6xl text-white">
            Reviews &amp; Testimonials
          </motion.h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Summary + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Overall Rating */}
          <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center">
            <div className="text-7xl font-playfair text-[#C9A84C] mb-2">{AVG_RATING.toFixed(1)}</div>
            <StarRating rating={Math.round(AVG_RATING)} size={24} />
            <p className="text-[#F5ECD7]/60 mt-3 text-sm">Based on {TOTAL_REVIEWS} reviews</p>
            <button
              onClick={() => setShowWriteModal(true)}
              className="mt-6 w-full bg-gradient-to-r from-[#C9A84C] to-[#e0c06a] text-[#0D0D0D] py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} /> Write a Review
            </button>
          </div>

          {/* Breakdown */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-[#F5ECD7] font-semibold mb-6">Rating Breakdown</h3>
            <div className="space-y-3">
              {RATING_BREAKDOWN.map(({ stars, count }) => {
                const pct = TOTAL_REVIEWS > 0 ? (count / TOTAL_REVIEWS) * 100 : 0;
                return (
                  <button
                    key={stars}
                    onClick={() => setFilterRating(filterRating === stars ? null : stars)}
                    className={`w-full flex items-center gap-3 group transition-opacity ${filterRating !== null && filterRating !== stars ? 'opacity-40' : ''}`}
                  >
                    <span className="text-[#F5ECD7]/70 text-sm w-12 text-right">{stars} ★</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#C9A84C] to-[#e0c06a] rounded-full"
                      />
                    </div>
                    <span className="text-[#F5ECD7]/60 text-sm w-8">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Google Reviews */}
            <div className="mt-6 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-[#4285F4]">G</span>
              </div>
              <div className="flex-1">
                <p className="text-[#F5ECD7] text-sm font-medium">Also on Google Reviews</p>
                <div className="flex items-center gap-2">
                  <StarRating rating={5} size={12} />
                  <span className="text-[#F5ECD7]/60 text-xs">4.9 · 248 reviews</span>
                </div>
              </div>
              <a href="#" className="text-[#C9A84C] hover:text-[#e0c06a] transition-colors" aria-label="View on Google">
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="flex items-center gap-2 text-[#F5ECD7]/60 text-sm">
            <Filter size={14} /> Filter:
          </div>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => { setFilterRating(filterRating === r ? null : r); setCurrentPage(1); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-all ${filterRating === r ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0D0D0D]' : 'border-white/20 text-[#F5ECD7]/70 hover:border-[#C9A84C]/50'}`}
            >
              {r} <Star size={12} className={filterRating === r ? 'fill-[#0D0D0D] text-[#0D0D0D]' : ''} />
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 text-[#F5ECD7]/60 text-sm">
            <SortAsc size={14} /> Sort:
          </div>
          {(['newest', 'helpful', 'rating'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setSortBy(s); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all capitalize ${sortBy === s ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0D0D0D]' : 'border-white/20 text-[#F5ECD7]/70 hover:border-[#C9A84C]/50'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Review Cards */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {paginated.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#C9A84C]/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C9A84C]/30">
                    <Image src={review.avatar} alt={review.author} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[#F5ECD7] font-semibold">{review.author}</span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-[#C9A84C] text-xs">
                          <CheckCircle size={12} /> Verified Diner
                        </span>
                      )}
                      <span className="text-[#F5ECD7]/40 text-xs ml-auto">
                        {new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size={14} />
                    <h4 className="text-[#F5ECD7] font-playfair text-lg mt-3 mb-2">{review.title}</h4>
                    <p className="text-[#F5ECD7]/70 text-sm leading-relaxed">{review.body}</p>

                    {/* Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                            <Image src={img} alt="Review photo" fill className="object-cover" sizes="80px" />
                          </div>
                        ))}
                        <div className="flex items-center gap-1 text-[#F5ECD7]/40 text-xs">
                          <Camera size={12} /> {review.images.length} photo{review.images.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    )}

                    {/* Helpful */}
                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className={`flex items-center gap-2 text-sm transition-colors ${votedIds.has(review.id) ? 'text-[#C9A84C]' : 'text-[#F5ECD7]/50 hover:text-[#C9A84C]'}`}
                      >
                        <ThumbsUp size={14} className={votedIds.has(review.id) ? 'fill-[#C9A84C]' : ''} />
                        Helpful ({review.helpful + (helpfulVotes[review.id] || 0)})
                      </button>
                    </div>

                    {/* Admin Reply */}
                    {review.adminReply && (
                      <div className="mt-4 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#C9A84C] flex items-center justify-center">
                            <span className="text-[#0D0D0D] text-xs font-bold">L</span>
                          </div>
                          <span className="text-[#C9A84C] text-sm font-semibold">Response from Lumiere</span>
                          <span className="text-[#F5ECD7]/40 text-xs ml-auto">
                            {new Date(review.adminReply.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-[#F5ECD7]/80 text-sm leading-relaxed">{review.adminReply.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#F5ECD7]/60 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${p === currentPage ? 'bg-[#C9A84C] text-[#0D0D0D]' : 'border border-white/20 text-[#F5ECD7]/60 hover:border-[#C9A84C] hover:text-[#C9A84C]'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#F5ECD7]/60 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showWriteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowWriteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-playfair text-2xl text-[#F5ECD7]">Share Your Experience</h3>
                <button onClick={() => setShowWriteModal(false)} className="text-[#F5ECD7]/40 hover:text-[#F5ECD7] transition-colors">
                  <X size={20} />
                </button>
              </div>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-[#C9A84C]" />
                  </div>
                  <h4 className="font-playfair text-xl text-[#F5ECD7] mb-2">Thank You!</h4>
                  <p className="text-[#F5ECD7]/60 text-sm">Your review has been submitted and will appear shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div>
                    <label className="text-[#F5ECD7]/70 text-sm mb-2 block">Your Rating *</label>
                    <InteractiveStarRating value={formRating} onChange={setFormRating} />
                  </div>
                  <div>
                    <label className="text-[#F5ECD7]/70 text-sm mb-2 block">Review Title</label>
                    <input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Summarise your experience"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#F5ECD7] placeholder-[#F5ECD7]/30 focus:outline-none focus:border-[#C9A84C]/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[#F5ECD7]/70 text-sm mb-2 block">Your Review *</label>
                    <textarea
                      value={formBody}
                      onChange={(e) => setFormBody(e.target.value)}
                      placeholder="Tell us about your experience at Lumiere..."
                      rows={5}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#F5ECD7] placeholder-[#F5ECD7]/30 focus:outline-none focus:border-[#C9A84C]/50 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#F5ECD7]/70 text-sm mb-2 flex items-center gap-2 cursor-pointer">
                      <Camera size={14} /> Add Photos (optional)
                    </label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center text-[#F5ECD7]/40 text-sm hover:border-[#C9A84C]/30 transition-colors cursor-pointer">
                      Click to upload or drag &amp; drop
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={formRating === 0 || !formBody.trim()}
                    className="w-full bg-gradient-to-r from-[#C9A84C] to-[#e0c06a] text-[#0D0D0D] py-3 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
