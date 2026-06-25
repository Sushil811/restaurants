'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  onChange,
  size = 'md',
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const handleStarClick = (selectedRating: number) => {
    if (interactive && onChange) {
      onChange(selectedRating);
    }
  };

  const handleStarHover = (selectedRating: number) => {
    if (interactive) {
      setHoverRating(selectedRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  // Determine current active rating count to display
  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5',
        interactive && 'cursor-pointer',
        className
      )}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxStars }).map((_, index) => {
        const starIndexValue = index + 1;
        const starSizeClass = starSizes[size];

        if (interactive) {
          // In interactive selector mode, we do whole stars only
          const isFilled = starIndexValue <= activeRating;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(starIndexValue)}
              onMouseEnter={() => handleStarHover(starIndexValue)}
              className="focus:outline-none transition-transform duration-150 hover:scale-110 active:scale-95"
              aria-label={`Rate ${starIndexValue} stars`}
            >
              <Star
                className={cn(
                  starSizeClass,
                  'transition-all duration-150',
                  isFilled
                    ? 'fill-gold text-gold shadow-gold/20'
                    : 'text-neutral-600 fill-none hover:text-gold-300'
                )}
              />
            </button>
          );
        }

        // Read-only mode with half-star overlay support
        const diff = rating - index;
        const isFull = diff >= 1;
        const isHalf = diff >= 0.5 && diff < 1;

        return (
          <div key={index} className="relative inline-block select-none">
            {/* Empty Star Background */}
            <Star
              className={cn(
                starSizeClass,
                'text-neutral-800 fill-neutral-900'
              )}
            />

            {/* Full Star Overlay */}
            {isFull && (
              <div className="absolute inset-0 top-0 left-0 overflow-hidden">
                <Star
                  className={cn(
                    starSizeClass,
                    'text-gold fill-gold'
                  )}
                />
              </div>
            )}

            {/* Half Star Overlay */}
            {isHalf && (
              <div className="absolute inset-0 top-0 left-0 overflow-hidden w-1/2">
                <Star
                  className={cn(
                    starSizeClass,
                    'text-gold fill-gold'
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
