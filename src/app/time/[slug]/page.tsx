import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { SearchResultsSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Clock } from 'lucide-react';
import { createServerClient } from '@/lib/db/client';
import { COOKING_TIMES } from '@/lib/utils/recipe-filters';
import type { Metadata } from 'next';
import type { RecipeSearchResult } from '@/types/recipe';

interface TimePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(COOKING_TIMES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TimePageProps): Promise<Metadata> {
  const { slug } = await params;
  const time = COOKING_TIMES[slug];

  if (!time) {
    return { title: 'Time Filter Not Found' };
  }

  return {
    title: `${time.name} Recipes`,
    description: `Quick recipes ready in ${time.maxMinutes} minutes or less. Perfect for busy weeknights.`,
  };
}

async function getTimeRecipes(timeSlug: string): Promise<RecipeSearchResult[]> {
  const supabase = createServerClient();
  const time = COOKING_TIMES[timeSlug];

  if (!time) return [];

  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
    .eq('is_deleted', false)
    .not('total_time', 'is', null)
    .lte('total_time', time.maxMinutes)
    .order('total_time', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Time fetch error:', error);
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

async function TimeResults({ slug }: { slug: string }) {
  const recipes = await getTimeRecipes(slug);
  const time = COOKING_TIMES[slug];

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
          <Clock className="w-10 h-10 text-neutral-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
          No quick recipes found
        </h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          We&apos;re still building our recipe collection. Check back soon or try a longer time filter!
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
        {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} ready in {time?.maxMinutes} minutes or less
      </p>
      <RecipeGrid recipes={recipes} />
    </>
  );
}

export default async function TimePage({ params }: TimePageProps) {
  const { slug } = await params;
  const time = COOKING_TIMES[slug];

  if (!time) {
    notFound();
  }

  // Other time options for navigation
  const otherTimes = Object.entries(COOKING_TIMES)
    .filter(([key]) => key !== slug);

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
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${time.color}`}>
            <Clock className="w-4 h-4" />
            {time.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
            {time.name} Recipes
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Quick and easy recipes when you&apos;re short on time but still want something delicious.
          </p>
        </div>

        {/* Other time options */}
        <div className="flex flex-wrap gap-2 mb-8">
          {otherTimes.map(([key, t]) => (
            <Link
              key={key}
              href={`/time/${key}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${t.color} hover:opacity-80`}
            >
              <Clock className="w-4 h-4" />
              {t.name}
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
          <TimeResults slug={slug} />
        </Suspense>
      </Container>
    </div>
  );
}
