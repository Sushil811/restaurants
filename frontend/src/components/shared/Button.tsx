'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  
  const baseStyles = 'inline-flex items-center justify-center font-sans uppercase tracking-widest font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const variants = {
    primary: 'bg-gradient-gold text-charcoal hover:shadow-gold border border-transparent active:scale-[0.98]',
    secondary: 'border border-gold text-gold hover:bg-gold hover:text-charcoal hover:shadow-gold/25 active:scale-[0.98]',
    ghost: 'text-neutral-300 hover:text-gold hover:bg-neutral-900/50 active:scale-[0.98]',
    danger: 'bg-danger text-white hover:bg-danger-600 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-2xs px-4 py-2 text-xs',
    md: 'text-xs px-6 py-3',
    lg: 'text-sm px-8 py-4',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        widthStyle,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          {/* Spinner */}
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
