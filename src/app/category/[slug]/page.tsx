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

// Valid categories with display names and descriptions
const CATEGORIES: Record<string, { name: string; description: string; color: string }> = {
  breakfast: {
    name: 'Breakfast',
    description: 'Start your day right with these breakfast recipes',
    color: 'bg-amber-100 text-amber-700',
  },
  lunch: {
    name: 'Lunch',
    description: 'Midday meals from quick bites to hearty lunches',
    color: 'bg-emerald-100 text-emerald-700',
  },
  dinner: {
    name: 'Dinner',
    description: 'Evening meals for every occasion',
    color: 'bg-red-100 text-red-700',
  },
  dessert: {
    name: 'Dessert',
    description: 'Sweet treats and indulgent desserts',
    color: 'bg-purple-100 text-purple-700',
  },
  appetizer: {
    name: 'Appetizer',
    description: 'Starters and small bites to kick off your meal',
    color: 'bg-pink-100 text-pink-700',
  },
  soup: {
    name: 'Soup',
    description: 'Comforting soups and stews for any season',
    color: 'bg-yellow-100 text-yellow-700',
  },
  salad: {
    name: 'Salad',
    description: 'Fresh and healthy salads',
    color: 'bg-green-100 text-green-700',
  },
  'side-dish': {
    name: 'Side Dish',
    description: 'Perfect accompaniments to your main course',
    color: 'bg-blue-100 text-blue-700',
  },
  snack: {
    name: 'Snack',
    description: 'Quick bites between meals',
    color: 'bg-orange-100 text-orange-700',
  },
  beverage: {
    name: 'Beverage',
    description: 'Drinks, smoothies, and cocktails',
    color: 'bg-cyan-100 text-cyan-700',
  },
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} Recipes`,
    description: `${category.description}. Find ${category.name.toLowerCase()} recipes without the bloat.`,
  };
}

async function getCategoryRecipes(categorySlug: string): Promise<RecipeSearchResult[]> {
  const supabase = createServerClient();
  const category = CATEGORIES[categorySlug];

  if (!category) return [];

  // Query recipes that have this category in their category array
  // The category field stores values like "Dinner", "Breakfast", etc.
  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
    .eq('is_deleted', false)
    .contains('category', [category.name])
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Category fetch error:', error);
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

async function CategoryResults({ slug }: { slug: string }) {
  const recipes = await getCategoryRecipes(slug);
  const category = CATEGORIES[slug];

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
          <span className="text-4xl">🍽️</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
          No {category?.name.toLowerCase()} recipes yet
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) {
    notFound();
  }

  // Other categories for navigation
  const otherCategories = Object.entries(CATEGORIES)
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
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${category.color}`}>
            {category.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
            {category.name} Recipes
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            {category.description}
          </p>
        </div>

        {/* Other categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {otherCategories.map(([key, cat]) => (
            <Link
              key={key}
              href={`/category/${key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat.color} hover:opacity-80`}
            >
              {cat.name}
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
          <CategoryResults slug={slug} />
        </Suspense>
      </Container>
    </div>
  );
}
