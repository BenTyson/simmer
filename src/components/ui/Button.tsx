'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Rounded for playful feel
          'rounded-full',

          // Variants
          {
            // Primary - Coral orange with shadow
            'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-md hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 active:translate-y-0':
              variant === 'primary',

            // Secondary - Teal accent
            'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-md hover:shadow-lg hover:shadow-secondary-500/25 hover:-translate-y-0.5 active:translate-y-0':
              variant === 'secondary',

            // Outline - Border only
            'border-2 border-neutral-300 bg-transparent text-neutral-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50':
              variant === 'outline',

            // Ghost - No background
            'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900':
              variant === 'ghost',
          },

          // Sizes
          {
            'px-4 py-2 text-sm gap-1.5': size === 'sm',
            'px-6 py-2.5 text-base gap-2': size === 'md',
            'px-8 py-3 text-lg gap-2.5': size === 'lg',
          },

          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
