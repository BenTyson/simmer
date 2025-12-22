import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { BrowseRecipes } from '@/components/recipe/BrowseRecipes';
import { SearchResultsSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { createServerClient } from '@/lib/db/client';
import { COOKING_METHODS } from '@/lib/utils/recipe-filters';
import type { Metadata } from 'next';
import type { RecipeSearchResult } from '@/types/recipe';

const PAGE_SIZE = 48;

interface MethodPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(COOKING_METHODS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: MethodPageProps): Promise<Metadata> {
  const { slug } = await params;
  const method = COOKING_METHODS[slug];

  if (!method) {
    return { title: 'Cooking Method Not Found' };
  }

  return {
    title: `${method.name} Recipes`,
    description: `${method.name} recipes for delicious home cooking. Find the perfect ${method.name.toLowerCase()} dish.`,
  };
}

async function getMethodRecipesWithCount(methodSlug: string): Promise<{ recipes: RecipeSearchResult[]; totalCount: number }> {
  const supabase = createServerClient();
  const method = COOKING_METHODS[methodSlug];

  if (!method) return { recipes: [], totalCount: 0 };

  // Build OR filter for keywords
  const orFilters = method.keywords.map(kw => `text.ilike.%${kw}%`).join(',');

  // First get instruction recipe IDs that match
  const { data: instructionMatches, error: instError } = await supabase
    .from('instructions')
    .select('recipe_id')
    .or(orFilters);

  if (instError) {
    console.error('Method instruction fetch error:', instError);
    return { recipes: [], totalCount: 0 };
  }

  if (!instructionMatches || instructionMatches.length === 0) {
    return { recipes: [], totalCount: 0 };
  }

  // Get unique recipe IDs
  const recipeIds = [...new Set(instructionMatches.map(i => i.recipe_id))];
  const totalCount = recipeIds.length;

  // Get first page of recipes
  const paginatedIds = recipeIds.slice(0, PAGE_SIZE);

  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name, avg_rating, review_count')
    .eq('is_deleted', false)
    .in('id', paginatedIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Method recipes fetch error:', error);
    return { recipes: [], totalCount: 0 };
  }

  const recipes = (data || []).map((row) => ({
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
    avgRating: row.avg_rating,
    reviewCount: row.review_count || 0,
  }));

  return { recipes, totalCount };
}

async function MethodResults({ slug }: { slug: string }) {
  const { recipes, totalCount } = await getMethodRecipesWithCount(slug);
  const method = COOKING_METHODS[slug];

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
          <span className="text-4xl">{method?.emoji || '🍳'}</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
          No {method?.name.toLowerCase()} recipes yet
        </h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          We&apos;re still building our recipe collection. Check back soon or try a different cooking method!
        </p>
        <Link href="/search">
          <Button>Search all recipes</Button>
        </Link>
      </div>
    );
  }

  return (
    <BrowseRecipes
      initialRecipes={recipes}
      totalCount={totalCount}
      filterType="method"
      filterValue={slug}
    />
  );
}

export default async function MethodPage({ params }: MethodPageProps) {
  const { slug } = await params;
  const method = COOKING_METHODS[slug];

  if (!method) {
    notFound();
  }

  // Other methods for navigation
  const otherMethods = Object.entries(COOKING_METHODS)
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
            <span>{method.emoji}</span>
            {method.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
            {method.name} Recipes
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Delicious {method.name.toLowerCase()} recipes for every skill level.
          </p>
        </div>

        {/* Other methods */}
        <div className="flex flex-wrap gap-2 mb-8">
          {otherMethods.map(([key, m]) => (
            <Link
              key={key}
              href={`/method/${key}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 text-neutral-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
            >
              <span>{m.emoji}</span>
              {m.name}
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
          <MethodResults slug={slug} />
        </Suspense>
      </Container>
    </div>
  );
}
