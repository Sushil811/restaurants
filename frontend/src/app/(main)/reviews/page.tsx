import type { Metadata } from 'next';
import ReviewsPageClient from '@/components/reviews/ReviewsPageClient';

export const metadata: Metadata = {
  title: 'Reviews | Lumiere Restaurant',
  description:
    'Read what our guests say about their Lumiere dining experience. Discover reviews, ratings, and stories from those who have tasted excellence.',
  openGraph: {
    title: 'Reviews | Lumiere Restaurant',
    description: 'Discover what guests say about their Lumiere dining experience.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Lumiere Restaurant Reviews',
      },
    ],
  },
};

export default function ReviewsPage() {
  return <ReviewsPageClient />;
}
