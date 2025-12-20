'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RecipeCard } from './RecipeCard';
import type { RecipeSearchResult } from '@/types/recipe';

const PAGE_SIZE = 48;

interface BrowseRecipesProps {
  initialRecipes: RecipeSearchResult[];
  totalCount: number;
  filterType: 'category' | 'cuisine' | 'diet' | 'protein' | 'time' | 'method' | 'vegetable';
  filterValue: string;
}

export function BrowseRecipes({
  initialRecipes,
  totalCount,
  filterType,
  filterValue,
}: BrowseRecipesProps) {
  const [recipes, setRecipes] = useState<RecipeSearchResult[]>(initialRecipes);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialRecipes.length < totalCount);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/recipes?type=${filterType}&value=${encodeURIComponent(filterValue)}&offset=${recipes.length}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      const newRecipes = data.recipes as RecipeSearchResult[];

      setRecipes((prev) => [...prev, ...newRecipes]);

      if (recipes.length + newRecipes.length >= totalCount || newRecipes.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (recipes.length === 0) {
    return null; // Let the parent handle empty state
  }

  return (
    <>
      <p className="text-sm text-neutral-500 mb-6">
        {totalCount} recipe{totalCount !== 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
          >
            {isLoading ? 'Loading...' : 'Load more recipes'}
          </Button>
          <p className="mt-2 text-sm text-neutral-500">
            Showing {recipes.length} of {totalCount} recipes
          </p>
        </div>
      )}
    </>
  );
}
