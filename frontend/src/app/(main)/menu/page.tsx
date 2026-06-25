// src/app/(main)/menu/page.tsx
import type { Metadata } from 'next';
import MenuPageClient from '@/components/menu/MenuPageClient';

export const metadata: Metadata = {
  title: 'Our Menu | Lumiere Restaurant',
  description:
    'Explore our curated selection of French-Indian fusion dishes, crafted with the finest seasonal ingredients. From delicate starters to indulgent desserts.',
  openGraph: {
    title: 'Our Menu | Lumiere Restaurant',
    description: 'Explore our curated selection of French-Indian fusion dishes.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Lumiere Restaurant Menu',
      },
    ],
  },
};

export default function MenuPage() {
  return <MenuPageClient />;
}
