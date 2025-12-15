import { createServerClient } from './client';
import type { RecipeSearchResult, SearchParams } from '@/types/recipe';

/**
 * Search recipes using PostgreSQL full-text search
 */
export async function searchRecipes(params: SearchParams): Promise<RecipeSearchResult[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc('search_recipes', {
    search_query: params.query,
    cuisine_filter: params.cuisine && params.cuisine.length > 0 ? params.cuisine : null,
    category_filter: params.category && params.category.length > 0 ? params.category : null,
    diet_filter: params.diet && params.diet.length > 0 ? params.diet : null,
    max_time: params.maxTime || null,
    result_limit: params.limit || 20,
    result_offset: params.offset || 0,
  });

  if (error) {
    console.error('Search error:', error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string | null,
    prepTime: row.prep_time as number | null,
    cookTime: row.cook_time as number | null,
    totalTime: row.total_time as number | null,
    servings: row.servings as number | null,
    cuisine: (row.cuisine as string[]) || [],
    category: (row.category as string[]) || [],
    dietTags: (row.diet_tags as string[]) || [],
    sourceDomain: row.source_domain as string,
    sourceName: row.source_name as string | null,
    rank: row.rank as number | undefined,
  }));
}

/**
 * Get search suggestions (prefix search for autocomplete)
 */
export async function getSearchSuggestions(prefix: string, limit: number = 10): Promise<string[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc('search_recipes_prefix', {
    prefix,
    result_limit: limit,
  });

  if (error) {
    console.error('Suggestions error:', error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => row.name as string);
}

/**
 * Get available filter options with counts
 */
export async function getFilterOptions(): Promise<{
  cuisines: { name: string; count: number }[];
  categories: { name: string; count: number }[];
  diets: { name: string; count: number }[];
}> {
  const supabase = createServerClient();

  // These queries would be more efficient with database functions
  // For now, we'll just return predefined options

  // In a production app, you'd query for distinct values with counts
  const defaultCuisines = [
    'American',
    'Italian',
    'Mexican',
    'Chinese',
    'Indian',
    'Japanese',
    'Thai',
    'Mediterranean',
    'French',
    'Greek',
  ];

  const defaultCategories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Appetizer',
    'Side Dish',
    'Dessert',
    'Snack',
    'Beverage',
    'Salad',
    'Soup',
  ];

  const defaultDiets = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Paleo',
    'Low-Carb',
    'Whole30',
  ];

  return {
    cuisines: defaultCuisines.map((name) => ({ name, count: 0 })),
    categories: defaultCategories.map((name) => ({ name, count: 0 })),
    diets: defaultDiets.map((name) => ({ name, count: 0 })),
  };
}
