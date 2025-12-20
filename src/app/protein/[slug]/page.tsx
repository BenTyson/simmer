import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { BrowseRecipes } from '@/components/recipe/BrowseRecipes';
import { SearchResultsSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { createServerClient } from '@/lib/db/client';
import { PROTEINS } from '@/lib/utils/recipe-filters';
import type { Metadata } from 'next';
import type { RecipeSearchResult } from '@/types/recipe';

const PAGE_SIZE = 48;

interface ProteinPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PROTEINS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProteinPageProps): Promise<Metadata> {
  const { slug } = await params;
  const protein = PROTEINS[slug];

  if (!protein) {
    return { title: 'Protein Not Found' };
  }

  return {
    title: `${protein.name} Recipes`,
    description: `Delicious ${protein.name.toLowerCase()} recipes. Find the perfect ${protein.name.toLowerCase()} dish for any occasion.`,
  };
}

async function getProteinRecipesWithCount(proteinSlug: string): Promise<{ recipes: RecipeSearchResult[]; totalCount: number }> {
  const supabase = createServerClient();
  const protein = PROTEINS[proteinSlug];

  if (!protein) return { recipes: [], totalCount: 0 };

  // Build OR filter for keywords
  const orFilters = protein.keywords.map(kw => `item.ilike.%${kw}%`).join(',');

  // First get ingredient recipe IDs that match
  const { data: ingredientMatches, error: ingError } = await supabase
    .from('ingredients')
    .select('recipe_id')
    .or(orFilters);

  if (ingError) {
    console.error('Protein ingredient fetch error:', ingError);
    return { recipes: [], totalCount: 0 };
  }

  if (!ingredientMatches || ingredientMatches.length === 0) {
    return { recipes: [], totalCount: 0 };
  }

  // Get unique recipe IDs
  const recipeIds = [...new Set(ingredientMatches.map(i => i.recipe_id))];
  const totalCount = recipeIds.length;

  // Get first page of recipes
  const paginatedIds = recipeIds.slice(0, PAGE_SIZE);

  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
    .eq('is_deleted', false)
    .in('id', paginatedIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Protein recipes fetch error:', error);
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
  }));

  return { recipes, totalCount };
}

async function ProteinResults({ slug }: { slug: string }) {
  const { recipes, totalCount } = await getProteinRecipesWithCount(slug);
  const protein = PROTEINS[slug];

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
          <span className="text-4xl">{protein?.emoji || '🍖'}</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
          No {protein?.name.toLowerCase()} recipes yet
        </h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          We&apos;re still building our recipe collection. Check back soon or try searching!
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
      filterType="protein"
      filterValue={slug}
    />
  );
}

export default async function ProteinPage({ params }: ProteinPageProps) {
  const { slug } = await params;
  const protein = PROTEINS[slug];

  if (!protein) {
    notFound();
  }

  // Other proteins for navigation
  const otherProteins = Object.entries(PROTEINS)
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
            <span>{protein.emoji}</span>
            {protein.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
            {protein.name} Recipes
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Delicious recipes featuring {protein.name.toLowerCase()} as the star ingredient.
          </p>
        </div>

        {/* Other proteins */}
        <div className="flex flex-wrap gap-2 mb-8">
          {otherProteins.map(([key, prot]) => (
            <Link
              key={key}
              href={`/protein/${key}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 text-neutral-600 hover:bg-orange-100 hover:text-orange-700 transition-colors"
            >
              <span>{prot.emoji}</span>
              {prot.name}
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
          <ProteinResults slug={slug} />
        </Suspense>
      </Container>
    </div>
  );
}
