import { Suspense } from 'react';
import { Container } from '@/components/layout/Container';
import { SearchBar } from '@/components/search/SearchBar';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { SearchResultsSkeleton } from '@/components/ui/Skeleton';
import { searchRecipes } from '@/lib/db/search';
import type { Metadata } from 'next';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; cuisine?: string; category?: string; diet?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;

  return {
    title: query ? `Search: ${query}` : 'Search Recipes',
    description: query
      ? `Find recipes for "${query}" without the bloat. Clean recipes with scaling and shopping lists.`
      : 'Search through thousands of recipes. Find exactly what you want to cook.',
  };
}

async function SearchResults({ query, filters }: { query: string; filters: Record<string, string | undefined> }) {
  // In production, this would search the database
  // For now, show a placeholder message
  if (!query) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
          What are you craving?
        </h2>
        <p className="text-neutral-600 max-w-md mx-auto">
          Search for any recipe - from quick weeknight dinners to elaborate weekend projects.
        </p>
      </div>
    );
  }

  // Try to search (will return empty if no Supabase connection)
  const results = await searchRecipes({
    query,
    cuisine: filters.cuisine ? [filters.cuisine] : undefined,
    category: filters.category ? [filters.category] : undefined,
    diet: filters.diet ? [filters.diet] : undefined,
    limit: 20,
  });

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
          <span className="text-4xl">🍳</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
          No recipes found for &ldquo;{query}&rdquo;
        </h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          We&apos;re still building our recipe database! Try a different search or check back soon.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-sm text-neutral-500">Try:</span>
          {['Chicken', 'Pasta', 'Salad', 'Dessert'].map((suggestion) => (
            <a
              key={suggestion}
              href={`/search?q=${encodeURIComponent(suggestion)}`}
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
            >
              {suggestion}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-neutral-500 mb-6">
        {results.length} recipe{results.length !== 1 ? 's' : ''} found
      </p>
      <RecipeGrid recipes={results} />
    </>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const filters = {
    cuisine: params.cuisine,
    category: params.category,
    diet: params.diet,
  };

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Search header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
            {query ? `Results for "${query}"` : 'Search Recipes'}
          </h1>
          <SearchBar
            variant="compact"
            placeholder="Search recipes..."
            defaultValue={query}
            className="max-w-xl"
          />
        </div>

        {/* Filters (simplified for MVP) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Breakfast', 'Lunch', 'Dinner', 'Dessert'].map((cat) => (
            <a
              key={cat}
              href={`/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(cat.toLowerCase())}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.category === cat.toLowerCase()
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </a>
          ))}
          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto'].map((diet) => (
            <a
              key={diet}
              href={`/search?q=${encodeURIComponent(query)}&diet=${encodeURIComponent(diet.toLowerCase())}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.diet === diet.toLowerCase()
                  ? 'bg-secondary-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {diet}
            </a>
          ))}
        </div>

        {/* Results */}
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} filters={filters} />
        </Suspense>
      </Container>
    </div>
  );
}
