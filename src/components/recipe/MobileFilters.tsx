'use client';

import { useState } from 'react';
import { Filter, Check } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { FilterState } from './RecipeFilters';

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

type TabType = 'cuisine' | 'diet' | 'time' | 'rating';

interface MobileFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function MobileFilters({ filters, onFiltersChange }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('cuisine');

  const activeFilterCount =
    filters.cuisines.length +
    filters.diets.length +
    (filters.maxTime ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  const toggleCuisine = (cuisine: string) => {
    onFiltersChange({
      ...filters,
      cuisines: filters.cuisines.includes(cuisine)
        ? filters.cuisines.filter((c) => c !== cuisine)
        : [...filters.cuisines, cuisine],
    });
  };

  const toggleDiet = (diet: string) => {
    onFiltersChange({
      ...filters,
      diets: filters.diets.includes(diet)
        ? filters.diets.filter((d) => d !== diet)
        : [...filters.diets, diet],
    });
  };

  const setMaxTime = (time: number | null) => {
    onFiltersChange({ ...filters, maxTime: time });
  };

  const setMinRating = (rating: number | null) => {
    onFiltersChange({ ...filters, minRating: rating });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      cuisines: [],
      diets: [],
      maxTime: null,
      minRating: null,
    });
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'cuisine', label: 'Cuisine', count: filters.cuisines.length },
    { id: 'diet', label: 'Diet', count: filters.diets.length },
    { id: 'time', label: 'Time', count: filters.maxTime ? 1 : 0 },
    { id: 'rating', label: 'Rating', count: filters.minRating ? 1 : 0 },
  ];

  return (
    <>
      {/* Filter trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-colors',
          activeFilterCount > 0
            ? 'bg-primary-100 text-primary-700 border border-primary-300'
            : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
        )}
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 text-xs font-bold bg-primary-500 text-white rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Bottom sheet */}
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filter Recipes"
      >
        {/* Tab navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 active:bg-neutral-200'
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-xs rounded-full',
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-primary-500 text-white'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content with large touch targets */}
        <div className="space-y-1 min-h-[200px]">
          {activeTab === 'cuisine' && (
            <FilterOptionList
              options={CUISINES.map((c) => c.name)}
              selected={filters.cuisines}
              onToggle={toggleCuisine}
              activeColor="primary"
            />
          )}

          {activeTab === 'diet' && (
            <FilterOptionList
              options={DIETS.map((d) => d.name)}
              selected={filters.diets}
              onToggle={toggleDiet}
              activeColor="green"
            />
          )}

          {activeTab === 'time' && (
            <div className="space-y-1">
              <button
                onClick={() => setMaxTime(null)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors',
                  !filters.maxTime
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700'
                )}
              >
                <span className="font-medium">Any time</span>
                {!filters.maxTime && <Check className="w-5 h-5 text-blue-600" />}
              </button>
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMaxTime(option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors',
                    filters.maxTime === option.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700'
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  {filters.maxTime === option.value && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'rating' && (
            <div className="space-y-1">
              <button
                onClick={() => setMinRating(null)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors',
                  !filters.minRating
                    ? 'bg-amber-100 text-amber-700'
                    : 'hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700'
                )}
              >
                <span className="font-medium">Any rating</span>
                {!filters.minRating && <Check className="w-5 h-5 text-amber-600" />}
              </button>
              {RATING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMinRating(option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors',
                    filters.minRating === option.value
                      ? 'bg-amber-100 text-amber-700'
                      : 'hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700'
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  {filters.minRating === option.value && (
                    <Check className="w-5 h-5 text-amber-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-200">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              clearAllFilters();
            }}
            disabled={activeFilterCount === 0}
          >
            Clear all
          </Button>
          <Button className="flex-1" onClick={() => setIsOpen(false)}>
            Show results
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}

// Reusable filter option list with 48px+ touch targets
function FilterOptionList({
  options,
  selected,
  onToggle,
  activeColor,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  activeColor: 'primary' | 'green';
}) {
  const colorClasses = {
    primary: {
      active: 'bg-primary-100 text-primary-700',
      check: 'text-primary-600',
    },
    green: {
      active: 'bg-green-100 text-green-700',
      check: 'text-green-600',
    },
  };

  return (
    <div className="space-y-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onToggle(option)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors',
            selected.includes(option)
              ? colorClasses[activeColor].active
              : 'hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700'
          )}
        >
          <span className="font-medium">{option}</span>
          {selected.includes(option) && (
            <Check className={cn('w-5 h-5', colorClasses[activeColor].check)} />
          )}
        </button>
      ))}
    </div>
  );
}
