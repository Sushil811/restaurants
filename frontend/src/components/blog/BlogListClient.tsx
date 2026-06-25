'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  Eye,
  Tag,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Rss,
  Mail,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = ['All', 'Recipes', 'Food Stories', 'Restaurant News', 'Travel', 'Health'] as const;
type Category = (typeof CATEGORIES)[number];

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: Exclude<Category, 'All'>;
  tags: string[];
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: number;
  views: number;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    slug: 'mastering-french-mother-sauces',
    title: 'Mastering the Five French Mother Sauces: A Chef\'s Deep Dive',
    excerpt: 'At the heart of classical French cuisine lie five foundational sauces — béchamel, velouté, espagnole, sauce tomat, and hollandaise. Understanding these pillars unlocks a universe of culinary possibility. In this article, Chef Laurent walks you through each sauce, its history, and how Lumiere incorporates them into our modern menu.',
    category: 'Recipes',
    tags: ['French Cuisine', 'Sauces', 'Cooking Techniques', 'Chef\'s Tips'],
    coverImage: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=800&q=80',
    author: { name: 'Chef Laurent Moreau', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', role: 'Head Chef' },
    date: '2024-11-25',
    readTime: 12,
    views: 8420,
    featured: true,
  },
  {
    id: 'b2',
    slug: 'truffle-season-2024',
    title: 'Inside the Périgord: Sourcing the Finest Truffles of 2024',
    excerpt: 'Every autumn, our team embarks on a pilgrimage to the Périgord region of France, where the black truffle — "the black diamond" — is harvested with reverence. We go behind the scenes of our truffle sourcing journey, from the oak forests to your plate.',
    category: 'Food Stories',
    tags: ['Truffles', 'Sourcing', 'Périgord', 'Seasonal'],
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    author: { name: 'Chef Laurent Moreau', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', role: 'Head Chef' },
    date: '2024-11-10',
    readTime: 8,
    views: 5650,
  },
  {
    id: 'b3',
    slug: 'lumiere-autumn-menu-launch',
    title: 'Lumiere Unveils Its Autumn Tasting Menu — A Celebration of the Season',
    excerpt: 'Our new autumn menu is a love letter to the golden months. Featuring wild mushroom velouté, slow-roasted venison, and a signature pumpkin soufflé, it reflects the richness and warmth of the season. Executive Chef Laurent shares his inspiration and the stories behind each dish.',
    category: 'Restaurant News',
    tags: ['New Menu', 'Autumn', 'Tasting Menu', 'Seasonal'],
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    author: { name: 'Élise Beaumont', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', role: 'Communications Director' },
    date: '2024-10-28',
    readTime: 5,
    views: 12300,
  },
  {
    id: 'b4',
    slug: 'the-art-of-wine-pairing',
    title: 'The Art of Wine Pairing: How Our Sommelier Creates Harmony',
    excerpt: 'A perfectly paired wine does not merely accompany a dish — it transforms it. Our Head Sommelier, Marie-Claire, reveals the philosophy and intuition behind Lumiere\'s acclaimed wine programme, including the principles that guide every pairing decision.',
    category: 'Food Stories',
    tags: ['Wine', 'Sommelier', 'Pairing', 'Fine Dining'],
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    author: { name: 'Marie-Claire Villeneuve', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', role: 'Head Sommelier' },
    date: '2024-10-15',
    readTime: 10,
    views: 4890,
  },
  {
    id: 'b5',
    slug: 'sustainable-fine-dining',
    title: 'Sustainable Fine Dining: How Lumiere Is Redefining Luxury Responsibility',
    excerpt: 'True luxury, we believe, must not come at the planet\'s expense. At Lumiere, sustainability is not a trend — it is a commitment woven into every aspect of our operation, from our farm partnerships to our zero-waste kitchen philosophy.',
    category: 'Restaurant News',
    tags: ['Sustainability', 'Zero Waste', 'Farm-to-Table', 'Eco-Friendly'],
    coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    author: { name: 'Élise Beaumont', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', role: 'Communications Director' },
    date: '2024-10-01',
    readTime: 7,
    views: 6730,
  },
  {
    id: 'b6',
    slug: 'recipe-chocolate-fondant',
    title: 'Recipe: Lumiere\'s Signature Chocolate Fondant with Salted Caramel Core',
    excerpt: 'By popular demand, Chef Laurent shares the recipe for our most beloved dessert — the molten chocolate fondant with a hidden salted caramel centre. Learn the technique that makes this dessert a masterpiece of textures and temperatures.',
    category: 'Recipes',
    tags: ['Dessert', 'Chocolate', 'Recipe', 'Technique'],
    coverImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    author: { name: 'Chef Laurent Moreau', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', role: 'Head Chef' },
    date: '2024-09-20',
    readTime: 9,
    views: 18200,
  },
  {
    id: 'b7',
    slug: 'lyon-culinary-capital',
    title: 'Lyon: A Pilgrimage to the Culinary Capital of the World',
    excerpt: 'Before becoming Lumiere\'s head chef, Laurent grew up eating in the bouchons of Lyon — the traditional Lyonnaise restaurants that define the city\'s soul. He shares the dishes, memories, and chefs that shaped his palate and philosophy.',
    category: 'Travel',
    tags: ['Lyon', 'France', 'Travel', 'Culinary Heritage'],
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    author: { name: 'Chef Laurent Moreau', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', role: 'Head Chef' },
    date: '2024-09-05',
    readTime: 11,
    views: 7100,
  },
  {
    id: 'b8',
    slug: 'benefits-of-fermented-foods',
    title: 'Fermentation, Flavour, and Wellbeing: The Science Behind Our Fermented Menu Offerings',
    excerpt: 'Fermented foods are not merely trendy — they represent millennia of culinary wisdom that modern science is now validating. At Lumiere, we incorporate lacto-fermented vegetables, house-made kefir, and aged charcuterie with a deep understanding of their health benefits and extraordinary flavour depth.',
    category: 'Health',
    tags: ['Fermentation', 'Gut Health', 'Probiotics', 'Nutrition'],
    coverImage: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80',
    author: { name: 'Dr. Sophie Laroche', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80', role: 'Resident Nutritionist' },
    date: '2024-08-20',
    readTime: 8,
    views: 3900,
  },
  {
    id: 'b9',
    slug: 'wagyu-guide',
    title: 'The Complete Guide to Wagyu: Grades, Origins, and How to Appreciate Every Bite',
    excerpt: 'Wagyu beef is among the world\'s most prized ingredients — but not all Wagyu is equal. Our guide covers the grading system, the difference between Japanese and Australian Wagyu, and how Lumiere sources and prepares this extraordinary meat for maximum flavour expression.',
    category: 'Food Stories',
    tags: ['Wagyu', 'Beef', 'Premium Ingredients', 'Guide'],
    coverImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    author: { name: 'Chef Laurent Moreau', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', role: 'Head Chef' },
    date: '2024-08-08',
    readTime: 14,
    views: 9350,
  },
];

const ALL_TAGS = Array.from(new Set(BLOG_POSTS.flatMap((p) => p.tags)));

const PER_PAGE = 6;

export default function BlogListClient() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featured = BLOG_POSTS.find((p) => p.featured)!;

  const filtered = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const nonFeatured = filtered.filter((p) => !p.featured || activeCategory !== 'All' || searchQuery !== '');
  const totalPages = Math.ceil(nonFeatured.length / PER_PAGE);
  const paginated = nonFeatured.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 to-[#0D0D0D]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-2">The Lumiere Journal</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-playfair text-4xl md:text-6xl text-white">
            Stories &amp; Recipes
          </motion.h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search + Category Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide bg-white/5 rounded-full p-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeCategory === cat ? 'bg-[#C9A84C] text-[#0D0D0D]' : 'text-[#F5ECD7]/60 hover:text-[#F5ECD7]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5ECD7]/40" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search articles..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-[#F5ECD7] placeholder-[#F5ECD7]/30 text-sm focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Featured Post */}
            {activeCategory === 'All' && searchQuery === '' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <div className="flex items-center gap-2 text-[#C9A84C] text-sm tracking-widest uppercase mb-4">
                  <TrendingUp size={14} /> Featured Article
                </div>
                <Link href={`/blog/${featured.slug}`} className="group block">
                  <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-6">
                    <Image src={featured.coverImage} alt={featured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 66vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="inline-block bg-[#C9A84C] text-[#0D0D0D] text-xs font-semibold px-3 py-1 rounded-full mb-3">{featured.category}</span>
                      <h2 className="font-playfair text-2xl md:text-3xl text-white group-hover:text-[#C9A84C] transition-colors leading-tight">{featured.title}</h2>
                    </div>
                  </div>
                  <p className="text-[#F5ECD7]/70 text-sm leading-relaxed line-clamp-3 mb-4">{featured.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden">
                      <Image src={featured.author.avatar} alt={featured.author.name} fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <p className="text-[#F5ECD7] text-sm font-medium">{featured.author.name}</p>
                      <p className="text-[#F5ECD7]/50 text-xs">{featured.author.role}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-[#F5ECD7]/40 text-xs">
                      <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime} min read</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {(featured.views / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </Link>
                <div className="h-px bg-white/10 mt-10 mb-2" />
              </motion.div>
            )}

            {/* Grid */}
            <AnimatePresence mode="wait">
              <motion.div key={activeCategory + searchQuery + currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginated.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Link href={`/blog/${post.slug}`} className="group block h-full">
                      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#C9A84C]/30 transition-all duration-300 h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/60 to-transparent" />
                          <span className="absolute top-4 left-4 bg-[#C9A84C] text-[#0D0D0D] text-xs font-semibold px-2.5 py-1 rounded-full">{post.category}</span>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-playfair text-lg text-[#F5ECD7] group-hover:text-[#C9A84C] transition-colors mb-2 leading-snug line-clamp-2">{post.title}</h3>
                          <p className="text-[#F5ECD7]/60 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                            <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                              <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" sizes="28px" />
                            </div>
                            <span className="text-[#F5ECD7]/70 text-xs">{post.author.name}</span>
                            <div className="ml-auto flex items-center gap-3 text-[#F5ECD7]/40 text-xs">
                              <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}m</span>
                              <span className="flex items-center gap-1"><Eye size={11} />{post.views.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {paginated.length === 0 && (
              <div className="text-center py-16 text-[#F5ECD7]/40">
                <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                <p>No articles found matching your search.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#F5ECD7]/60 hover:border-[#C9A84C] transition-all disabled:opacity-30">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`w-10 h-10 rounded-full text-sm transition-all ${p === currentPage ? 'bg-[#C9A84C] text-[#0D0D0D]' : 'border border-white/20 text-[#F5ECD7]/60 hover:border-[#C9A84C]'}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#F5ECD7]/60 hover:border-[#C9A84C] transition-all disabled:opacity-30">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Posts */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-playfair text-lg text-[#F5ECD7] mb-5 flex items-center gap-2"><Rss size={16} className="text-[#C9A84C]" /> Recent Posts</h3>
              <div className="space-y-4">
                {BLOG_POSTS.slice(0, 4).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-3 group">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F5ECD7] text-sm group-hover:text-[#C9A84C] transition-colors line-clamp-2 leading-snug">{post.title}</p>
                      <p className="text-[#F5ECD7]/40 text-xs mt-1 flex items-center gap-1"><Calendar size={10} />{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags Cloud */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-playfair text-lg text-[#F5ECD7] mb-5 flex items-center gap-2"><Tag size={16} className="text-[#C9A84C]" /> Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-[#F5ECD7]/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/30 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mb-4">
                <Mail size={18} className="text-[#C9A84C]" />
              </div>
              <h3 className="font-playfair text-lg text-[#F5ECD7] mb-2">The Lumiere Letter</h3>
              <p className="text-[#F5ECD7]/60 text-sm mb-4">Receive our latest recipes, stories, and exclusive offers directly to your inbox.</p>
              {subscribed ? (
                <div className="text-center py-3">
                  <p className="text-[#C9A84C] font-medium text-sm">✓ You're subscribed! Welcome.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-[#F5ECD7] placeholder-[#F5ECD7]/30 text-sm focus:outline-none focus:border-[#C9A84C]/50"
                  />
                  <button type="submit" className="w-full bg-gradient-to-r from-[#C9A84C] to-[#e0c06a] text-[#0D0D0D] py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
