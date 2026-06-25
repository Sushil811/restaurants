import AboutHeroSection from '@/components/about/AboutHeroSection';
import RestaurantStorySection from '@/components/about/RestaurantStorySection';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import ChefsSection from '@/components/about/ChefsSection';
import AwardsSection from '@/components/about/AwardsSection';

export const metadata = {
  title: 'Our Story',
  description: 'Learn about the culinary vision, history, Michelin achievements, and legendary chefs of Lumiere Restaurant.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#0D0D0D]">
      <AboutHeroSection />
      <RestaurantStorySection />
      <MissionVisionSection />
      <ChefsSection />
      <AwardsSection />
    </div>
  );
}
