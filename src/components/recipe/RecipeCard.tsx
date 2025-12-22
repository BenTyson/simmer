import Link from 'next/link';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CategoryBadge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import type { Recipe, RecipeSearchResult } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe | RecipeSearchResult;
  className?: string;
}

// Smart badge selection: prioritize special diets over categories
function getPrimaryBadge(
  recipe: Recipe | RecipeSearchResult
): { type: 'diet' | 'category'; value: string } | null {
  // Priority diets that users filter by most
  const priorityDiets = ['Vegan', 'Vegetarian', 'Keto', 'Gluten-Free', 'Dairy-Free'];

  if (recipe.dietTags && recipe.dietTags.length > 0) {
    for (const diet of priorityDiets) {
      if (recipe.dietTags.some((t) => t.toLowerCase() === diet.toLowerCase())) {
        return { type: 'diet', value: diet };
      }
    }
    // If no priority diet, use first diet tag
    return { type: 'diet', value: recipe.dietTags[0] };
  }

  // Fall back to first category
  if (recipe.category && recipe.category.length > 0) {
    return { type: 'category', value: recipe.category[0] };
  }

  return null;
}

// Diet badge colors
function getDietBadgeClasses(diet: string): string {
  const colors: Record<string, string> = {
    vegan: 'bg-green-100 text-green-700',
    vegetarian: 'bg-green-100 text-green-700',
    keto: 'bg-purple-100 text-purple-700',
    'gluten-free': 'bg-amber-100 text-amber-700',
    'dairy-free': 'bg-blue-100 text-blue-700',
    paleo: 'bg-orange-100 text-orange-700',
    'low-carb': 'bg-cyan-100 text-cyan-700',
  };
  return colors[diet.toLowerCase()] || 'bg-neutral-100 text-neutral-700';
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const primaryBadge = getPrimaryBadge(recipe);

  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className={cn(
        // Base styles
        'group block rounded-2xl border border-neutral-200 bg-white',
        // Hover effects - playful lift with slight rotation
        'transition-all duration-200 ease-out',
        'hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/50',
        'hover:-translate-y-1.5 hover:rotate-[-0.5deg]',
        // Focus for accessibility
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        className
      )}
    >
      <div className="p-5">
        {/* Single primary badge */}
        {primaryBadge && (
          <div className="mb-3">
            {primaryBadge.type === 'diet' ? (
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full',
                  getDietBadgeClasses(primaryBadge.value)
                )}
              >
                {primaryBadge.value}
              </span>
            ) : (
              <CategoryBadge category={primaryBadge.value} />
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
          {recipe.name}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Consolidated meta row: time + rating */}
        <div className="mt-3 flex items-center gap-3 text-sm text-neutral-500">
          {recipe.totalTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {recipe.totalTime}m
            </span>
          )}
          {recipe.avgRating && recipe.avgRating > 0 && (
            <span className="flex items-center gap-1">
              <StarRating rating={recipe.avgRating} size="sm" showValue={false} />
              <span className="text-xs text-neutral-400">({recipe.reviewCount})</span>
            </span>
          )}
        </div>

        {/* Source - more subtle */}
        <p className="mt-3 text-xs text-neutral-400 truncate">
          {recipe.sourceName || recipe.sourceDomain}
        </p>
      </div>
    </Link>
  );
}

export function RecipeGrid({
  recipes,
  className,
}: {
  recipes: (Recipe | RecipeSearchResult)[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
