import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import FeaturedDishesSection from '@/components/home/FeaturedDishesSection';
import TodaysSpecialsSection from '@/components/home/TodaysSpecialsSection';
import ChefRecommendationSection from '@/components/home/ChefRecommendationSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import InstagramFeedSection from '@/components/home/InstagramFeedSection';
import ReservationCTASection from '@/components/home/ReservationCTASection';
import NewsletterSection from '@/components/home/NewsletterSection';

export const metadata = {
  title: 'Lumiere — Where Cuisine Meets Art',
  description:
    'Experience extraordinary French haute cuisine at Lumiere — a Michelin-starred restaurant blending culinary artistry with unparalleled hospitality.',
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <IntroSection />
      <FeaturedDishesSection />
      <TodaysSpecialsSection />
      <ChefRecommendationSection />
      <TestimonialsSection />
      <InstagramFeedSection />
      <ReservationCTASection />
      <NewsletterSection />
    </main>
  );
}
