'use client';

import { useState } from 'react';
import { Minus, Plus, Printer, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface RecipeControlsProps {
  defaultServings: number;
}

export function RecipeControls({ defaultServings }: RecipeControlsProps) {
  const [servings, setServings] = useState(defaultServings);
  const [useMetric, setUseMetric] = useState(false);

  const scale = servings / defaultServings;

  const decreaseServings = () => {
    if (servings > 1) setServings(servings - 1);
  };

  const increaseServings = () => {
    setServings(servings + 1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 mb-8 rounded-2xl bg-neutral-50 print:hidden">
      {/* Servings control */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-neutral-600">Servings:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={decreaseServings}
            disabled={servings <= 1}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              'bg-white border border-neutral-200 text-neutral-600',
              'hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Decrease servings"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center font-bold text-lg text-neutral-900">{servings}</span>
          <button
            onClick={increaseServings}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              'bg-white border border-neutral-200 text-neutral-600',
              'hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600'
            )}
            aria-label="Increase servings"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {scale !== 1 && (
          <span className="text-xs text-primary-600 font-medium">({scale}x)</span>
        )}
      </div>

      {/* Unit toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-neutral-600">Units:</span>
        <div className="flex rounded-full bg-white border border-neutral-200 p-0.5">
          <button
            onClick={() => setUseMetric(false)}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium transition-colors',
              !useMetric ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            US
          </button>
          <button
            onClick={() => setUseMetric(true)}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium transition-colors',
              useMetric ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            Metric
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-1" />
          Print
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
}
