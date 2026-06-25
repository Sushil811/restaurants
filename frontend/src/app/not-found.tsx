import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="text-center space-y-6 max-w-lg mx-auto">
        <h1 className="font-display text-8xl md:text-9xl text-[#C9A84C] opacity-80">404</h1>
        
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl text-white">
            Page Not Found
          </h2>
          <p className="text-[#F5ECD7]/60 text-sm md:text-base font-sans">
            We couldn't find the page you were looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-white text-[#0D0D0D] font-bold py-3 px-8 rounded-lg transition-colors font-sans uppercase tracking-wider text-sm"
          >
            Return to Home
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
