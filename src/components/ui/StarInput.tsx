'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StarInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function StarInput({ value, onChange, size = 'lg', className }: StarInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((starValue) => (
        <button
          key={starValue}
          type="button"
          onClick={() => onChange(starValue)}
          onMouseEnter={() => setHoverValue(starValue)}
          className={cn(
            'transition-transform duration-100 ease-out',
            'hover:scale-110 focus:outline-none focus:scale-110',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded'
          )}
          aria-label={`Rate ${starValue} out of 5 stars`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              'transition-colors duration-100',
              starValue <= displayValue
                ? 'text-amber-400 fill-amber-400'
                : 'text-neutral-300 hover:text-amber-200'
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-neutral-500">
        {value > 0 ? `${value} star${value !== 1 ? 's' : ''}` : 'Select rating'}
      </span>
    </div>
  );
}
