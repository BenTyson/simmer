import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { SearchResultsSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { createServerClient } from '@/lib/db/client';
import { VEGETABLES } from '@/lib/utils/recipe-filters';
import type { Metadata } from 'next';
import type { RecipeSearchResult } from '@/types/recipe';

interface VegetablePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(VEGETABLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: VegetablePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vegetable = VEGETABLES[slug];

  if (!vegetable) {
    return { title: 'Vegetable Not Found' };
  }

  return {
    title: `${vegetable.name} Recipes`,
    description: `Recipes featuring ${vegetable.name.toLowerCase()}. Find delicious ways to cook with ${vegetable.name.toLowerCase()}.`,
  };
}

async function getVegetableRecipes(vegetableSlug: string): Promise<RecipeSearchResult[]> {
  const supabase = createServerClient();
  const vegetable = VEGETABLES[vegetableSlug];

  if (!vegetable) return [];

  // Build OR filter for keywords
  const orFilters = vegetable.keywords.map(kw => `item.ilike.%${kw}%`).join(',');

  // First get ingredient recipe IDs that match
  const { data: ingredientMatches, error: ingError } = await supabase
    .from('ingredients')
    .select('recipe_id')
    .or(orFilters);

  if (ingError) {
    console.error('Vegetable ingredient fetch error:', ingError);
    return [];
  }

  if (!ingredientMatches || ingredientMatches.length === 0) {
    return [];
  }

  // Get unique recipe IDs
  const recipeIds = [...new Set(ingredientMatches.map(i => i.recipe_id))];

  // Fetch the recipes
  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
    .eq('is_deleted', false)
    .in('id', recipeIds.slice(0, 50))
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Vegetable recipes fetch error:', error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    prepTime: row.prep_time,
    cookTime: row.cook_time,
    totalTime: row.total_time,
    servings: row.servings,
    cuisine: row.cuisine || [],
    category: row.category || [],
    dietTags: row.diet_tags || [],
    sourceDomain: row.source_domain,
    sourceName: row.source_name,
  }));
}

async function VegetableResults({ slug }: { slug: string }) {
  const recipes = await getVegetableRecipes(slug);
  const vegetable = VEGETABLES[slug];

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
          <span className="text-4xl">{vegetable?.emoji || '🥬'}</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
          No {vegetable?.name.toLowerCase()} recipes yet
        </h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          We&apos;re still building our recipe collection. Check back soon or try a different vegetable!
        </p>
        <Link href="/search">
          <Button>Search all recipes</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-neutral-500 mb-6">
        {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
      </p>
      <RecipeGrid recipes={recipes} />
    </>
  );
}

export default async function VegetablePage({ params }: VegetablePageProps) {
  const { slug } = await params;
  const vegetable = VEGETABLES[slug];

  if (!vegetable) {
    notFound();
  }

  // Other vegetables for navigation
  const otherVegetables = Object.entries(VEGETABLES)
    .filter(([key]) => key !== slug)
    .slice(0, 6);

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            <span>{vegetable.emoji}</span>
            {vegetable.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
            {vegetable.name} Recipes
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Delicious recipes featuring fresh {vegetable.name.toLowerCase()}.
          </p>
        </div>

        {/* Other vegetables */}
        <div className="flex flex-wrap gap-2 mb-8">
          {otherVegetables.map(([key, veg]) => (
            <Link
              key={key}
              href={`/vegetable/${key}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 text-neutral-600 hover:bg-green-100 hover:text-green-700 transition-colors"
            >
              <span>{veg.emoji}</span>
              {veg.name}
            </Link>
          ))}
          <Link
            href="/search"
            className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            View all
          </Link>
        </div>

        {/* Results */}
        <Suspense fallback={<SearchResultsSkeleton />}>
          <VegetableResults slug={slug} />
        </Suspense>
      </Container>
    </div>
  );
}
