'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MobileFilters } from './MobileFilters';

export interface FilterState {
  cuisines: string[];
  diets: string[];
  maxTime: number | null;
  minRating: number | null;
}

interface RecipeFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCuisines?: string[];
  availableDiets?: string[];
  className?: string;
}

const CUISINES = [
  { slug: 'american', name: 'American' },
  { slug: 'italian', name: 'Italian' },
  { slug: 'mexican', name: 'Mexican' },
  { slug: 'chinese', name: 'Chinese' },
  { slug: 'indian', name: 'Indian' },
  { slug: 'japanese', name: 'Japanese' },
  { slug: 'thai', name: 'Thai' },
  { slug: 'mediterranean', name: 'Mediterranean' },
  { slug: 'french', name: 'French' },
  { slug: 'greek', name: 'Greek' },
  { slug: 'korean', name: 'Korean' },
  { slug: 'vietnamese', name: 'Vietnamese' },
];

const DIETS = [
  { slug: 'vegetarian', name: 'Vegetarian' },
  { slug: 'vegan', name: 'Vegan' },
  { slug: 'gluten-free', name: 'Gluten-Free' },
  { slug: 'dairy-free', name: 'Dairy-Free' },
  { slug: 'keto', name: 'Keto' },
  { slug: 'paleo', name: 'Paleo' },
  { slug: 'low-carb', name: 'Low-Carb' },
];

const TIME_OPTIONS = [
  { value: 15, label: 'Under 15 min' },
  { value: 30, label: 'Under 30 min' },
  { value: 45, label: 'Under 45 min' },
  { value: 60, label: 'Under 1 hour' },
];

const RATING_OPTIONS = [
  { value: 4, label: '4+ stars' },
  { value: 3, label: '3+ stars' },
  { value: 2, label: '2+ stars' },
];

export function RecipeFilters({
  filters,
  onFiltersChange,
  className,
}: RecipeFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const activeFilterCount =
    filters.cuisines.length +
    filters.diets.length +
    (filters.maxTime ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleCuisine = useCallback((cuisine: string) => {
    onFiltersChange({
      ...filters,
      cuisines: filters.cuisines.includes(cuisine)
        ? filters.cuisines.filter((c) => c !== cuisine)
        : [...filters.cuisines, cuisine],
    });
  }, [filters, onFiltersChange]);

  const toggleDiet = useCallback((diet: string) => {
    onFiltersChange({
      ...filters,
      diets: filters.diets.includes(diet)
        ? filters.diets.filter((d) => d !== diet)
        : [...filters.diets, diet],
    });
  }, [filters, onFiltersChange]);

  const setMaxTime = useCallback((time: number | null) => {
    onFiltersChange({ ...filters, maxTime: time });
    setOpenDropdown(null);
  }, [filters, onFiltersChange]);

  const setMinRating = useCallback((rating: number | null) => {
    onFiltersChange({ ...filters, minRating: rating });
    setOpenDropdown(null);
  }, [filters, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      cuisines: [],
      diets: [],
      maxTime: null,
      minRating: null,
    });
  }, [onFiltersChange]);

  return (
    <div className={cn(className)}>
      {/* Mobile: Bottom sheet filters */}
      <div className="md:hidden">
        <MobileFilters filters={filters} onFiltersChange={onFiltersChange} />
      </div>

      {/* Desktop: Dropdown filters */}
      <div className="hidden md:block space-y-3">
        {/* Filter buttons row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-500 flex items-center gap-1.5">
            <Filter className="w-4 h-4" />
            Filter by:
          </span>

        {/* Cuisine dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('cuisine')}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-1',
              filters.cuisines.length > 0
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
            )}
          >
            Cuisine
            {filters.cuisines.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                {filters.cuisines.length}
              </span>
            )}
            <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown === 'cuisine' && 'rotate-180')} />
          </button>

          {openDropdown === 'cuisine' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20 max-h-64 overflow-y-auto">
              {CUISINES.map((cuisine) => (
                <button
                  key={cuisine.slug}
                  onClick={() => toggleCuisine(cuisine.name)}
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm transition-colors',
                    filters.cuisines.includes(cuisine.name)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                >
                  {cuisine.name}
                  {filters.cuisines.includes(cuisine.name) && (
                    <span className="float-right text-primary-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Diet dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('diet')}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-1',
              filters.diets.length > 0
                ? 'bg-green-100 border-green-300 text-green-700'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
            )}
          >
            Diet
            {filters.diets.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded-full">
                {filters.diets.length}
              </span>
            )}
            <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown === 'diet' && 'rotate-180')} />
          </button>

          {openDropdown === 'diet' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20 max-h-64 overflow-y-auto">
              {DIETS.map((diet) => (
                <button
                  key={diet.slug}
                  onClick={() => toggleDiet(diet.name)}
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm transition-colors',
                    filters.diets.includes(diet.name)
                      ? 'bg-green-50 text-green-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                >
                  {diet.name}
                  {filters.diets.includes(diet.name) && (
                    <span className="float-right text-green-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('time')}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-1',
              filters.maxTime
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
            )}
          >
            {filters.maxTime ? `Under ${filters.maxTime} min` : 'Time'}
            <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown === 'time' && 'rotate-180')} />
          </button>

          {openDropdown === 'time' && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20">
              <button
                onClick={() => setMaxTime(null)}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors',
                  !filters.maxTime ? 'bg-blue-50 text-blue-700' : 'text-neutral-700 hover:bg-neutral-50'
                )}
              >
                Any time
              </button>
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMaxTime(option.value)}
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm transition-colors',
                    filters.maxTime === option.value
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rating dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('rating')}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-1',
              filters.minRating
                ? 'bg-amber-100 border-amber-300 text-amber-700'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
            )}
          >
            {filters.minRating ? `${filters.minRating}+ stars` : 'Rating'}
            <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown === 'rating' && 'rotate-180')} />
          </button>

          {openDropdown === 'rating' && (
            <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20">
              <button
                onClick={() => setMinRating(null)}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors',
                  !filters.minRating ? 'bg-amber-50 text-amber-700' : 'text-neutral-700 hover:bg-neutral-50'
                )}
              >
                Any rating
              </button>
              {RATING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMinRating(option.value)}
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm transition-colors',
                    filters.minRating === option.value
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear all button */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.cuisines.map((cuisine) => (
            <span
              key={cuisine}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
            >
              {cuisine}
              <button
                onClick={() => toggleCuisine(cuisine)}
                className="hover:text-primary-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {filters.diets.map((diet) => (
            <span
              key={diet}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
            >
              {diet}
              <button
                onClick={() => toggleDiet(diet)}
                className="hover:text-green-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {filters.maxTime && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              Under {filters.maxTime} min
              <button
                onClick={() => setMaxTime(null)}
                className="hover:text-blue-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {filters.minRating && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-700">
              {filters.minRating}+ stars
              <button
                onClick={() => setMinRating(null)}
                className="hover:text-amber-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

        {/* Click outside to close */}
        {openDropdown && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenDropdown(null)}
          />
        )}
      </div>
    </div>
  );
}

export const emptyFilters: FilterState = {
  cuisines: [],
  diets: [],
  maxTime: null,
  minRating: null,
};
