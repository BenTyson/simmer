import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { SearchResultsSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { createServerClient } from '@/lib/db/client';
import type { Metadata } from 'next';
import type { RecipeSearchResult } from '@/types/recipe';

// Valid diets with display names and descriptions
const DIETS: Record<string, { name: string; description: string; color: string }> = {
  vegetarian: {
    name: 'Vegetarian',
    description: 'Meat-free recipes full of flavor',
    color: 'bg-green-100 text-green-700',
  },
  vegan: {
    name: 'Vegan',
    description: 'Plant-based recipes without any animal products',
    color: 'bg-emerald-100 text-emerald-700',
  },
  'gluten-free': {
    name: 'Gluten-Free',
    description: 'Delicious recipes without gluten',
    color: 'bg-amber-100 text-amber-700',
  },
  'dairy-free': {
    name: 'Dairy-Free',
    description: 'Recipes without milk, cheese, or dairy products',
    color: 'bg-blue-100 text-blue-700',
  },
  keto: {
    name: 'Keto',
    description: 'Low-carb, high-fat recipes for ketogenic diets',
    color: 'bg-purple-100 text-purple-700',
  },
  paleo: {
    name: 'Paleo',
    description: 'Whole foods inspired by ancestral eating',
    color: 'bg-orange-100 text-orange-700',
  },
  'low-carb': {
    name: 'Low-Carb',
    description: 'Reduced carbohydrate recipes',
    color: 'bg-red-100 text-red-700',
  },
  whole30: {
    name: 'Whole30',
    description: 'Clean eating without sugar, grains, or processed foods',
    color: 'bg-teal-100 text-teal-700',
  },
  'low-fat': {
    name: 'Low-Fat',
    description: 'Heart-healthy recipes with reduced fat',
    color: 'bg-pink-100 text-pink-700',
  },
  'low-sodium': {
    name: 'Low-Sodium',
    description: 'Flavorful recipes with less salt',
    color: 'bg-cyan-100 text-cyan-700',
  },
};

interface DietPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(DIETS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DietPageProps): Promise<Metadata> {
  const { slug } = await params;
  const diet = DIETS[slug];

  if (!diet) {
    return { title: 'Diet Not Found' };
  }

  return {
    title: `${diet.name} Recipes`,
    description: `${diet.description}. Find ${diet.name.toLowerCase()} recipes without the bloat.`,
  };
}

async function getDietRecipes(dietSlug: string): Promise<RecipeSearchResult[]> {
  const supabase = createServerClient();
  const diet = DIETS[dietSlug];

  if (!diet) return [];

  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
    .eq('is_deleted', false)
    .contains('diet_tags', [diet.name])
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Diet fetch error:', error);
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

async function DietResults({ slug }: { slug: string }) {
  const recipes = await getDietRecipes(slug);
  const diet = DIETS[slug];

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
          <span className="text-4xl">🥗</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
          No {diet?.name.toLowerCase()} recipes yet
        </h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          We&apos;re still building our recipe collection. Check back soon or try searching for something specific!
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

export default async function DietPage({ params }: DietPageProps) {
  const { slug } = await params;
  const diet = DIETS[slug];

  if (!diet) {
    notFound();
  }

  // Other diets for navigation
  const otherDiets = Object.entries(DIETS)
    .filter(([key]) => key !== slug)
    .slice(0, 5);

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
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${diet.color}`}>
            {diet.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
            {diet.name} Recipes
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            {diet.description}
          </p>
        </div>

        {/* Other diets */}
        <div className="flex flex-wrap gap-2 mb-8">
          {otherDiets.map(([key, d]) => (
            <Link
              key={key}
              href={`/diet/${key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${d.color} hover:opacity-80`}
            >
              {d.name}
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
          <DietResults slug={slug} />
        </Suspense>
      </Container>
    </div>
  );
}
