import type { Metadata } from 'next';
import BlogListClient from '@/components/blog/BlogListClient';

export const metadata: Metadata = {
  title: 'Blog | Lumiere Restaurant',
  description:
    'Explore culinary stories, recipes, restaurant news, and food culture from the kitchen of Lumiere — where passion meets plate.',
  openGraph: {
    title: 'Blog | Lumiere Restaurant',
    description: 'Culinary stories, recipes, and food culture from the kitchen of Lumiere.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Lumiere Restaurant Blog',
      },
    ],
  },
};

export default function BlogPage() {
  return <BlogListClient />;
}
