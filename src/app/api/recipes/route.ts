import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db/client';
import { PROTEINS, COOKING_METHODS, COOKING_TIMES, VEGETABLES } from '@/lib/utils/recipe-filters';

const PAGE_SIZE = 48;

// Category, cuisine, diet mappings (duplicated from pages for API use)
const CATEGORIES: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  dessert: 'Dessert',
  appetizer: 'Appetizer',
  soup: 'Soup',
  salad: 'Salad',
  'side-dish': 'Side Dish',
  snack: 'Snack',
  beverage: 'Beverage',
};

const CUISINES: Record<string, string> = {
  american: 'American',
  italian: 'Italian',
  mexican: 'Mexican',
  chinese: 'Chinese',
  indian: 'Indian',
  japanese: 'Japanese',
  thai: 'Thai',
  mediterranean: 'Mediterranean',
  french: 'French',
  greek: 'Greek',
  korean: 'Korean',
  vietnamese: 'Vietnamese',
  spanish: 'Spanish',
  'middle-eastern': 'Middle Eastern',
  caribbean: 'Caribbean',
};

const DIETS: Record<string, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-free': 'Gluten-Free',
  'dairy-free': 'Dairy-Free',
  keto: 'Keto',
  paleo: 'Paleo',
  'low-carb': 'Low-Carb',
  whole30: 'Whole30',
  'low-fat': 'Low-Fat',
  'low-sodium': 'Low-Sodium',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filterType = searchParams.get('type'); // protein, category, cuisine, diet, time, method, vegetable
  const filterValue = searchParams.get('value');
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  if (!filterType || !filterValue) {
    return NextResponse.json({ error: 'Missing type or value parameter' }, { status: 400 });
  }

  const supabase = createServerClient();

  try {
    let recipes: any[] = [];
    let totalCount = 0;

    if (filterType === 'category') {
      const categoryName = CATEGORIES[filterValue];
      if (!categoryName) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }

      const { count } = await supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .contains('category', [categoryName]);
      totalCount = count || 0;

      const { data, error } = await supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
        .eq('is_deleted', false)
        .contains('category', [categoryName])
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      recipes = data || [];

    } else if (filterType === 'cuisine') {
      const cuisineName = CUISINES[filterValue];
      if (!cuisineName) {
        return NextResponse.json({ error: 'Invalid cuisine' }, { status: 400 });
      }

      const { count } = await supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .contains('cuisine', [cuisineName]);
      totalCount = count || 0;

      const { data, error } = await supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
        .eq('is_deleted', false)
        .contains('cuisine', [cuisineName])
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      recipes = data || [];

    } else if (filterType === 'diet') {
      const dietName = DIETS[filterValue];
      if (!dietName) {
        return NextResponse.json({ error: 'Invalid diet' }, { status: 400 });
      }

      const { count } = await supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .contains('diet_tags', [dietName]);
      totalCount = count || 0;

      const { data, error } = await supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
        .eq('is_deleted', false)
        .contains('diet_tags', [dietName])
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      recipes = data || [];

    } else if (filterType === 'time') {
      const timeConfig = COOKING_TIMES[filterValue];
      if (!timeConfig) {
        return NextResponse.json({ error: 'Invalid time filter' }, { status: 400 });
      }

      const { count } = await supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .not('total_time', 'is', null)
        .lte('total_time', timeConfig.maxMinutes);
      totalCount = count || 0;

      const { data, error } = await supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
        .eq('is_deleted', false)
        .not('total_time', 'is', null)
        .lte('total_time', timeConfig.maxMinutes)
        .order('total_time', { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      recipes = data || [];

    } else if (filterType === 'protein') {
      const proteinConfig = PROTEINS[filterValue];
      if (!proteinConfig) {
        return NextResponse.json({ error: 'Invalid protein' }, { status: 400 });
      }

      // Two-step query for protein
      const orFilters = proteinConfig.keywords.map(kw => `item.ilike.%${kw}%`).join(',');
      const { data: ingredientMatches } = await supabase
        .from('ingredients')
        .select('recipe_id')
        .or(orFilters);

      if (!ingredientMatches || ingredientMatches.length === 0) {
        return NextResponse.json({ recipes: [], totalCount: 0 });
      }

      const recipeIds = [...new Set(ingredientMatches.map(i => i.recipe_id))];
      totalCount = recipeIds.length;

      const paginatedIds = recipeIds.slice(offset, offset + PAGE_SIZE);

      const { data, error } = await supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
        .eq('is_deleted', false)
        .in('id', paginatedIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      recipes = data || [];

    } else if (filterType === 'method') {
      const methodConfig = COOKING_METHODS[filterValue];
      if (!methodConfig) {
        return NextResponse.json({ error: 'Invalid cooking method' }, { status: 400 });
      }

      // Two-step query for method
      const orFilters = methodConfig.keywords.map(kw => `text.ilike.%${kw}%`).join(',');
      const { data: instructionMatches } = await supabase
        .from('instructions')
        .select('recipe_id')
        .or(orFilters);

      if (!instructionMatches || instructionMatches.length === 0) {
        return NextResponse.json({ recipes: [], totalCount: 0 });
      }

      const recipeIds = [...new Set(instructionMatches.map(i => i.recipe_id))];
      totalCount = recipeIds.length;

      const paginatedIds = recipeIds.slice(offset, offset + PAGE_SIZE);

      const { data, error } = await supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
        .eq('is_deleted', false)
        .in('id', paginatedIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      recipes = data || [];

    } else if (filterType === 'vegetable') {
      const vegConfig = VEGETABLES[filterValue];
      if (!vegConfig) {
        return NextResponse.json({ error: 'Invalid vegetable' }, { status: 400 });
      }

      // Two-step query for vegetable
      const orFilters = vegConfig.keywords.map(kw => `item.ilike.%${kw}%`).join(',');
      const { data: ingredientMatches } = await supabase
        .from('ingredients')
        .select('recipe_id')
        .or(orFilters);

      if (!ingredientMatches || ingredientMatches.length === 0) {
        return NextResponse.json({ recipes: [], totalCount: 0 });
      }

      const recipeIds = [...new Set(ingredientMatches.map(i => i.recipe_id))];
      totalCount = recipeIds.length;

      const paginatedIds = recipeIds.slice(offset, offset + PAGE_SIZE);

      const { data, error } = await supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name')
        .eq('is_deleted', false)
        .in('id', paginatedIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      recipes = data || [];

    } else {
      return NextResponse.json({ error: 'Invalid filter type' }, { status: 400 });
    }

    // Transform to RecipeSearchResult format
    const transformedRecipes = recipes.map((row) => ({
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

    return NextResponse.json({ recipes: transformedRecipes, totalCount });

  } catch (error) {
    console.error('Recipe fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}
