import type { Metadata } from 'next';
import ContactPageClient from '@/components/contact/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us | Lumiere Restaurant',
  description:
    'Get in touch with Lumiere. Make a reservation, inquire about private dining, or share your feedback. We\'d love to hear from you.',
  openGraph: {
    title: 'Contact | Lumiere Restaurant',
    description: 'Reach out to Lumiere for reservations, catering, and inquiries.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Lumiere Restaurant Contact',
      },
    ],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
