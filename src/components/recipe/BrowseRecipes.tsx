'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { RecipeCard } from './RecipeCard';
import { RecipeFilters, emptyFilters, type FilterState } from './RecipeFilters';
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
  totalCount: initialTotalCount,
  filterType,
  filterValue,
}: BrowseRecipesProps) {
  const [recipes, setRecipes] = useState<RecipeSearchResult[]>(initialRecipes);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [hasMore, setHasMore] = useState(initialRecipes.length < initialTotalCount);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  // Build filter query string
  const buildFilterParams = useCallback((f: FilterState) => {
    const params = new URLSearchParams();
    if (f.cuisines.length > 0) params.set('cuisines', f.cuisines.join(','));
    if (f.diets.length > 0) params.set('diets', f.diets.join(','));
    if (f.maxTime) params.set('maxTime', f.maxTime.toString());
    if (f.minRating) params.set('minRating', f.minRating.toString());
    return params.toString();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const hasActiveFilters =
      filters.cuisines.length > 0 ||
      filters.diets.length > 0 ||
      filters.maxTime !== null ||
      filters.minRating !== null;

    if (!hasActiveFilters) {
      // Reset to initial state
      setRecipes(initialRecipes);
      setTotalCount(initialTotalCount);
      setHasMore(initialRecipes.length < initialTotalCount);
      return;
    }

    const fetchFiltered = async () => {
      setIsFiltering(true);
      try {
        const filterParams = buildFilterParams(filters);
        const response = await fetch(
          `/api/recipes?type=${filterType}&value=${encodeURIComponent(filterValue)}&offset=0${filterParams ? `&${filterParams}` : ''}`
        );

        if (!response.ok) throw new Error('Failed to fetch recipes');

        const data = await response.json();
        setRecipes(data.recipes);
        setTotalCount(data.totalCount);
        setHasMore(data.recipes.length < data.totalCount);
      } catch (error) {
        console.error('Failed to filter recipes:', error);
      } finally {
        setIsFiltering(false);
      }
    };

    fetchFiltered();
  }, [filters, filterType, filterValue, initialRecipes, initialTotalCount, buildFilterParams]);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const filterParams = buildFilterParams(filters);
      const response = await fetch(
        `/api/recipes?type=${filterType}&value=${encodeURIComponent(filterValue)}&offset=${recipes.length}${filterParams ? `&${filterParams}` : ''}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      const newRecipes = data.recipes as RecipeSearchResult[];

      setRecipes((prev) => [...prev, ...newRecipes]);

      if (recipes.length + newRecipes.length >= data.totalCount || newRecipes.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Filters */}
      <RecipeFilters
        filters={filters}
        onFiltersChange={setFilters}
        className="mb-6"
      />

      {/* Results count */}
      <p className="text-sm text-neutral-500 mb-6">
        {isFiltering ? (
          'Filtering...'
        ) : (
          <>
            {totalCount} recipe{totalCount !== 1 ? 's' : ''}
            {(filters.cuisines.length > 0 || filters.diets.length > 0 || filters.maxTime || filters.minRating) && (
              <span className="text-primary-600"> (filtered)</span>
            )}
          </>
        )}
      </p>

      {/* Recipe grid */}
      {recipes.length === 0 && !isFiltering ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">No recipes match your filters. Try adjusting them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && recipes.length > 0 && (
        <div className="mt-10 text-center">
          <Button
            onClick={loadMore}
            disabled={isLoading || isFiltering}
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
