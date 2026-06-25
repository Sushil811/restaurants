import Link from 'next/link';
import { blogApi } from '@/lib/api';
import { Blog } from '@/types';
import { Calendar, Clock, User, ChevronLeft, Heart, Share2, MessageSquare } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Full mock data for fallback
const mockBlogs: Record<string, Blog> = {
  'art-of-plating-french-cuisine': {
    id: 'b1',
    title: 'The Delicate Art of Plating Modern French Cuisine',
    slug: 'art-of-plating-french-cuisine',
    excerpt: 'Plating is not merely presenting food; it is an act of architecture, painting, and love combined.',
    content: `
      <p class="lead text-lg font-serif text-[#F5ECD7]/80 leading-relaxed mb-6">
        When a plate is set down before a guest, the first bite is taken with the eyes. In the realm of fine dining, the arrangement of colors, textures, and heights on a plate acts as a prelude to the symphony of flavors that follow.
      </p>
      
      <h2 class="font-display text-2xl text-white mt-8 mb-4">1. The Rule of Odds and Asymmetry</h2>
      <p class="text-sm text-[#F5ECD7]/70 leading-relaxed mb-6">
        Classical dining often emphasized perfect symmetry, with ingredients placed in neat, radial patterns. Modern French presentation, however, values asymmetric balances. Arranging key elements in groups of three or five creates a natural flow for the eye, making the food feel organic rather than rigid.
      </p>

      <blockquote class="border-l-2 border-[#C9A84C] pl-6 my-8 italic text-white/90 font-serif">
        "Gastronomy is the intelligent knowledge of whatever concerns man's nourishment. It is the artist's canvas and the scientist's laboratory combined."
      </blockquote>

      <h2 class="font-display text-2xl text-white mt-8 mb-4">2. Play of Textures and Heights</h2>
      <p class="text-sm text-[#F5ECD7]/70 leading-relaxed mb-6">
        A flat plate is a boring plate. Using premium purées as foundations, our chefs construct layers. We position crispy microgreens or delicate tuiles atop tender cuts of meat to guide the guest's fork through contrasting sensory dimensions.
      </p>

      <h2 class="font-display text-2xl text-white mt-8 mb-4">3. The Dynamic Sauce Pull</h2>
      <p class="text-sm text-[#F5ECD7]/70 leading-relaxed mb-6">
        Instead of drowning dishes under deep pool-saucing, modern techniques utilize drops, drizzles, and the classic spoon swipe. By dragging a rich jus across the negative space of a plate, we introduce movement and direction.
      </p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80',
    author: {
      name: 'Chef Antoine Dubois',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&q=80',
      role: 'Executive Chef',
      bio: 'Trained at Le Cordon Bleu and holder of 3 Michelin Stars. Antoine believes plating is visual poetry.',
    },
    category: 'chef-notes',
    tags: ['French Cuisine', 'Culinary Art', 'Michelin Star'],
    isPublished: true,
    isFeatured: true,
    publishedAt: '2026-05-15T10:00:00.000Z',
    readTime: '6 min read',
    views: 1240,
    likes: 85,
    createdAt: '2026-05-15T10:00:00.000Z',
    updatedAt: '2026-05-15T10:00:00.000Z',
  },
};

const relatedPosts = [
  {
    title: 'The Perfect Wine Pairings for Summer Truffles',
    slug: 'wine-pairings-summer-truffles',
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    date: 'June 01, 2026',
    category: 'wine',
  },
  {
    title: 'Sourcing the Rare Spices of the Western Ghats',
    slug: 'sourcing-rare-spices',
    coverImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
    date: 'May 28, 2026',
    category: 'ingredients',
  },
];

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const blog = mockBlogs[slug] || { title: 'Lumiere Blog' };
  
  return {
    title: blog.title,
    description: `Read about ${blog.title} from the chefs and experts at Lumiere.`,
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  let blog: Blog | null = null;
  
  try {
    const res = await blogApi.getBySlug(slug);
    if (res.data?.success) {
      blog = res.data.blog;
    }
  } catch (err) {
    // Graceful fallback
    blog = mockBlogs[slug] || null;
  }

  // Final fallback if slug does not exist in mock either
  if (!blog) {
    blog = {
      id: 'fallback',
      title: 'Bespoke Gastronomy Explorations',
      slug: slug,
      excerpt: 'Exploring flavor chemistry, heritage ingredients, and modern culinary design.',
      content: `
        <p class="lead text-lg font-serif text-[#F5ECD7]/80 leading-relaxed mb-6">
          Every month, the culinary artisans at Lumiere publish deep-dive insights into our recipes, sources, and cultural milestones.
        </p>
        <p class="text-sm text-[#F5ECD7]/70 leading-relaxed">
          We are currently refreshing this article. Please check back shortly for full recipes, sommelier notes, and kitchen stories.
        </p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
      author: {
        name: 'The Lumiere Brigade',
        avatar: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&q=80',
        role: 'Culinary Team',
        bio: 'Brought to you by the shared efforts of the kitchen brigade, pastry team, and beverage specialists.',
      },
      category: 'culture',
      tags: ['Gastronomy', 'Culinary Team'],
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date().toISOString(),
      readTime: '4 min read',
      views: 310,
      likes: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const publishDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="bg-[#0D0D0D] text-white pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#C9A84C] hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-semibold bg-[#C9A84C]/10 px-3.5 py-1.5 rounded-full inline-block">
            {blog.category}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
            {blog.title}
          </h1>
          <p className="text-[#F5ECD7]/55 text-base sm:text-lg italic font-serif max-w-3xl leading-relaxed">
            "{blog.excerpt}"
          </p>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#C9A84C]/15 text-xs text-[#F5ECD7]/50">
            <div className="flex items-center gap-2">
              {blog.author.avatar ? (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#C9A84C]/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#111111] border border-[#C9A84C]/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#C9A84C]" />
                </div>
              )}
              <div>
                <span className="text-white block font-medium">{blog.author.name}</span>
                <span className="text-[10px]">{blog.author.role || 'Contributor'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C9A84C]" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C9A84C]" />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-[40vh] sm:h-[50vh] w-full overflow-hidden rounded-lg mb-12 border border-[#C9A84C]/10 shadow-2xl">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Article Content & Share Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Share sidebar panel */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-start gap-4 text-[#F5ECD7]/40">
            <button className="w-10 h-10 rounded-full border border-white/10 hover:border-[#C9A84C] hover:text-[#C9A84C] flex items-center justify-center transition-colors">
              <Heart className="w-4.5 h-4.5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-white/10 hover:border-[#C9A84C] hover:text-[#C9A84C] flex items-center justify-center transition-colors">
              <MessageSquare className="w-4.5 h-4.5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-white/10 hover:border-[#C9A84C] hover:text-[#C9A84C] flex items-center justify-center transition-colors">
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* HTML body content */}
          <div
            className="lg:col-span-11 blog-content prose prose-invert prose-gold max-w-none text-[#F5ECD7]/80 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Author Bio Panel */}
        <div className="bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 sm:p-8 mt-16 flex flex-col sm:flex-row gap-6 items-center">
          {blog.author.avatar && (
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#C9A84C]"
            />
          )}
          <div className="text-center sm:text-left">
            <h4 className="font-display text-xl text-white">{blog.author.name}</h4>
            <p className="text-xs text-[#C9A84C] uppercase tracking-wider font-semibold mt-1">
              {blog.author.role}
            </p>
            <p className="text-[#F5ECD7]/60 text-xs mt-3 leading-relaxed">
              {blog.author.bio || 'Dedicated to exploring new frontiers of culinary storytelling and gourmet innovation.'}
            </p>
          </div>
        </div>

        {/* Related Posts */}
        <div className="border-t border-[#C9A84C]/15 pt-16 mt-16">
          <h3 className="font-display text-2xl text-white mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 bg-[#111111] border border-[#C9A84C]/15 hover:border-[#C9A84C]/50 rounded-lg overflow-hidden transition-all duration-300"
              >
                <div className="relative w-28 shrink-0 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold mb-1">
                    {post.category}
                  </span>
                  <h4 className="font-display text-base text-white group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <span className="text-[10px] text-[#F5ECD7]/40 mt-2">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
