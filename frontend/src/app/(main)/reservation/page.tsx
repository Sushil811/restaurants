import type { Metadata } from 'next';
import ReservationForm from '@/components/reservation/ReservationForm';

export const metadata: Metadata = {
  title: 'Reserve A Table | Lumiere Restaurant',
  description:
    'Book your lunch or dinner reservation at Lumiere. Choose dates, guest size, and specify special dietary requests for an elevated dining experience.',
};

export default function ReservationPage() {
  return (
    <div className="bg-[#0D0D0D] pt-28 pb-16 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReservationForm />
      </div>
    </div>
  );
}
