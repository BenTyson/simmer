import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/db/client';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emberwhisk.co';

// Categories that have dedicated pages
const CATEGORIES = [
  'breakfast',
  'lunch',
  'dinner',
  'dessert',
  'appetizer',
  'soup',
  'salad',
  'side-dish',
  'snack',
  'beverage',
];

// Cuisines that have dedicated pages
const CUISINES = [
  'american',
  'italian',
  'mexican',
  'chinese',
  'indian',
  'japanese',
  'thai',
  'mediterranean',
  'french',
  'greek',
  'korean',
  'vietnamese',
  'spanish',
  'middle-eastern',
  'caribbean',
];

// Diets that have dedicated pages
const DIETS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'keto',
  'paleo',
  'low-carb',
  'whole30',
  'low-fat',
  'low-sodium',
];

// Proteins that have dedicated pages
const PROTEINS = [
  'chicken',
  'beef',
  'pork',
  'fish',
  'seafood',
  'turkey',
  'lamb',
  'tofu',
  'beans',
  'eggs',
];

// Cooking times that have dedicated pages
const TIMES = [
  '15-minutes',
  '30-minutes',
  '45-minutes',
  '1-hour',
];

// Cooking methods that have dedicated pages
const METHODS = [
  'grilled',
  'baked',
  'fried',
  'slow-cooker',
  'instant-pot',
  'no-cook',
  'stovetop',
];

// Vegetables that have dedicated pages
const VEGETABLES = [
  'potatoes',
  'broccoli',
  'tomatoes',
  'spinach',
  'peppers',
  'mushrooms',
  'zucchini',
  'carrots',
  'onions',
  'garlic',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();

  // Fetch all recipes
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, updated_at')
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${BASE_URL}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Cuisine pages
  const cuisinePages: MetadataRoute.Sitemap = CUISINES.map((cuisine) => ({
    url: `${BASE_URL}/cuisine/${cuisine}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Diet pages
  const dietPages: MetadataRoute.Sitemap = DIETS.map((diet) => ({
    url: `${BASE_URL}/diet/${diet}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Protein pages
  const proteinPages: MetadataRoute.Sitemap = PROTEINS.map((protein) => ({
    url: `${BASE_URL}/protein/${protein}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Time pages
  const timePages: MetadataRoute.Sitemap = TIMES.map((time) => ({
    url: `${BASE_URL}/time/${time}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Method pages
  const methodPages: MetadataRoute.Sitemap = METHODS.map((method) => ({
    url: `${BASE_URL}/method/${method}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Vegetable pages
  const vegetablePages: MetadataRoute.Sitemap = VEGETABLES.map((vegetable) => ({
    url: `${BASE_URL}/vegetable/${vegetable}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Recipe pages
  const recipePages: MetadataRoute.Sitemap = (recipes || []).map((recipe) => ({
    url: `${BASE_URL}/recipe/${recipe.slug}`,
    lastModified: new Date(recipe.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...cuisinePages,
    ...dietPages,
    ...proteinPages,
    ...timePages,
    ...methodPages,
    ...vegetablePages,
    ...recipePages,
  ];
}
