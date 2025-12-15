'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            // Base styles
            'w-full rounded-2xl border-2 bg-white px-4 py-3 text-base',
            'transition-all duration-200',
            'placeholder:text-neutral-400',

            // Focus states
            'focus:outline-none focus:ring-0',

            // Normal state
            'border-neutral-200 hover:border-neutral-300',
            'focus:border-primary-500',

            // Error state
            error && 'border-red-500 focus:border-red-500',

            // With icon padding
            icon && 'pl-12',

            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
