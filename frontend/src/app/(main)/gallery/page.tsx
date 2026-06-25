import type { Metadata } from 'next';
import GalleryPageClient from '@/components/gallery/GalleryPageClient';

export const metadata: Metadata = {
  title: 'Gallery | Lumiere Restaurant',
  description:
    'Explore the visual journey of Lumiere — from our exquisite dishes to elegant dining spaces and memorable events. Every frame tells a story of culinary excellence.',
  openGraph: {
    title: 'Gallery | Lumiere Restaurant',
    description: 'A visual journey through Lumiere — culinary art, elegant spaces, and unforgettable events.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Lumiere Restaurant Gallery',
      },
    ],
  },
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
