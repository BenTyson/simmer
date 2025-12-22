import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { BrowseRecipes } from '@/components/recipe/BrowseRecipes';
import { SearchResultsSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { createServerClient } from '@/lib/db/client';
import type { Metadata } from 'next';
import type { RecipeSearchResult } from '@/types/recipe';

const PAGE_SIZE = 48;

// Valid cuisines with display names and descriptions
const CUISINES: Record<string, { name: string; description: string; emoji: string }> = {
  american: {
    name: 'American',
    description: 'Classic American comfort food and modern favorites',
    emoji: '🇺🇸',
  },
  italian: {
    name: 'Italian',
    description: 'Pasta, pizza, and Mediterranean flavors',
    emoji: '🇮🇹',
  },
  mexican: {
    name: 'Mexican',
    description: 'Vibrant flavors with tacos, burritos, and more',
    emoji: '🇲🇽',
  },
  chinese: {
    name: 'Chinese',
    description: 'Stir-fries, noodles, and dim sum delights',
    emoji: '🇨🇳',
  },
  indian: {
    name: 'Indian',
    description: 'Rich curries, biryanis, and aromatic spices',
    emoji: '🇮🇳',
  },
  japanese: {
    name: 'Japanese',
    description: 'Sushi, ramen, and delicate flavors',
    emoji: '🇯🇵',
  },
  thai: {
    name: 'Thai',
    description: 'Bold flavors with sweet, sour, salty, and spicy',
    emoji: '🇹🇭',
  },
  mediterranean: {
    name: 'Mediterranean',
    description: 'Healthy dishes from the Mediterranean coast',
    emoji: '🫒',
  },
  french: {
    name: 'French',
    description: 'Elegant cuisine with classic techniques',
    emoji: '🇫🇷',
  },
  greek: {
    name: 'Greek',
    description: 'Fresh ingredients with feta, olives, and herbs',
    emoji: '🇬🇷',
  },
  korean: {
    name: 'Korean',
    description: 'BBQ, kimchi, and fermented flavors',
    emoji: '🇰🇷',
  },
  vietnamese: {
    name: 'Vietnamese',
    description: 'Fresh herbs, pho, and banh mi',
    emoji: '🇻🇳',
  },
  spanish: {
    name: 'Spanish',
    description: 'Tapas, paella, and bold flavors',
    emoji: '🇪🇸',
  },
  'middle-eastern': {
    name: 'Middle Eastern',
    description: 'Hummus, falafel, and aromatic spices',
    emoji: '🧆',
  },
  caribbean: {
    name: 'Caribbean',
    description: 'Tropical flavors with jerk, rice, and beans',
    emoji: '🏝️',
  },
};

interface CuisinePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CUISINES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CuisinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const cuisine = CUISINES[slug];

  if (!cuisine) {
    return { title: 'Cuisine Not Found' };
  }

  return {
    title: `${cuisine.name} Recipes`,
    description: `${cuisine.description}. Find authentic ${cuisine.name.toLowerCase()} recipes without the bloat.`,
  };
}

async function getCuisineRecipesWithCount(cuisineSlug: string): Promise<{ recipes: RecipeSearchResult[]; totalCount: number }> {
  const supabase = createServerClient();
  const cuisine = CUISINES[cuisineSlug];

  if (!cuisine) return { recipes: [], totalCount: 0 };

  // Get total count
  const { count } = await supabase
    .from('recipes')
    .select('id', { count: 'exact', head: true })
    .eq('is_deleted', false)
    .contains('cuisine', [cuisine.name]);

  // Get first page of recipes
  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name, avg_rating, review_count')
    .eq('is_deleted', false)
    .contains('cuisine', [cuisine.name])
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  if (error) {
    console.error('Cuisine fetch error:', error);
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

  return { recipes, totalCount: count || 0 };
}

async function CuisineResults({ slug }: { slug: string }) {
  const { recipes, totalCount } = await getCuisineRecipesWithCount(slug);
  const cuisine = CUISINES[slug];

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
          <span className="text-4xl">{cuisine?.emoji || '🍽️'}</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
          No {cuisine?.name.toLowerCase()} recipes yet
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
    <BrowseRecipes
      initialRecipes={recipes}
      totalCount={totalCount}
      filterType="cuisine"
      filterValue={slug}
    />
  );
}

export default async function CuisinePage({ params }: CuisinePageProps) {
  const { slug } = await params;
  const cuisine = CUISINES[slug];

  if (!cuisine) {
    notFound();
  }

  // Other cuisines for navigation
  const otherCuisines = Object.entries(CUISINES)
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium mb-4">
            <span>{cuisine.emoji}</span>
            {cuisine.name} Cuisine
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
            {cuisine.name} Recipes
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            {cuisine.description}
          </p>
        </div>

        {/* Other cuisines */}
        <div className="flex flex-wrap gap-2 mb-8">
          {otherCuisines.map(([key, cuis]) => (
            <Link
              key={key}
              href={`/cuisine/${key}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              <span>{cuis.emoji}</span>
              {cuis.name}
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
          <CuisineResults slug={slug} />
        </Suspense>
      </Container>
    </div>
  );
}
