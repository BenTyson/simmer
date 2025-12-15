'use client';

import { useState, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  placeholder?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  variant = 'compact',
  placeholder = 'Search recipes...',
  defaultValue = '',
  autoFocus = false,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className={cn('w-full max-w-2xl mx-auto', className)}>
        <div className="relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={cn(
              'w-full pl-14 pr-36 py-5 text-lg',
              'rounded-full border-2 border-neutral-200',
              'bg-white shadow-xl shadow-neutral-200/50',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:border-primary-500 focus:shadow-primary-100/50',
              'transition-all duration-200'
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button type="submit" size="lg" className="px-8">
              Search
            </Button>
          </div>
        </div>
      </form>
    );
  }

  // Compact variant
  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'w-full pl-12 pr-4 py-3 text-base',
            'rounded-full border-2 border-neutral-200',
            'bg-white',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:border-primary-500',
            'transition-all duration-200'
          )}
        />
      </div>
    </form>
  );
}
