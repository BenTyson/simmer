import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge, CategoryBadge } from '@/components/ui/Badge';
import type { Recipe, RecipeSearchResult } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe | RecipeSearchResult;
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className={cn(
        // Base styles
        'group block rounded-2xl border border-neutral-200 bg-white',
        // Hover effects - playful lift
        'transition-all duration-200 ease-out',
        'hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/50',
        'hover:-translate-y-1',
        // Focus for accessibility
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        className
      )}
    >
      <div className="p-5">
        {/* Category badges */}
        {recipe.category && recipe.category.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.category.slice(0, 2).map((cat) => (
              <CategoryBadge key={cat} category={cat} />
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
          {recipe.name}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{recipe.description}</p>
        )}

        {/* Meta info */}
        <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
          {recipe.totalTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {recipe.totalTime} min
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {recipe.servings} servings
            </span>
          )}
        </div>

        {/* Diet tags */}
        {recipe.dietTags && recipe.dietTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recipe.dietTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Source */}
        <p className="mt-4 text-xs text-neutral-400">
          From{' '}
          <span className="text-neutral-500">
            {recipe.sourceName || recipe.sourceDomain}
          </span>
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
