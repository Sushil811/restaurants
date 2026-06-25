'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps {
  text?: string;
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({
  text,
  fullPage = false,
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  
  const spinnerSizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-2',
    lg: 'w-20 h-20 border-[3px]',
  };

  const textSizes = {
    sm: 'text-3xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const spinner = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        {/* Outer Elegant Spinning Gold Ring */}
        <div
          className={cn(
            "rounded-full border-neutral-800 animate-spin-slow",
            spinnerSizes[size]
          )}
          style={{
            borderTopColor: '#c9a84c',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            animationDuration: '1s'
          }}
        />
        {/* Decorative Inner Static/Pulsing Glow Ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border border-gold-500/10 animate-pulse",
            size === 'sm' ? 'm-[1px]' : 'm-[3px]'
          )}
        />
      </div>
      
      {text && (
        <span
          className={cn(
            "font-sans uppercase tracking-[0.25em] text-gold-500/80 font-medium animate-pulse",
            textSizes[size]
          )}
        >
          {text}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[600] flex items-center justify-center bg-charcoal-950">
        {spinner}
      </div>
    );
  }

  return spinner;
}
