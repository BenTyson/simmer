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

  // Additional filters (can be combined with primary filter)
  const extraCuisines = searchParams.get('cuisines')?.split(',').filter(Boolean) || [];
  const extraDiets = searchParams.get('diets')?.split(',').filter(Boolean) || [];
  const maxTime = searchParams.get('maxTime') ? parseInt(searchParams.get('maxTime')!, 10) : null;
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : null;

  if (!filterType || !filterValue) {
    return NextResponse.json({ error: 'Missing type or value parameter' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Helper to apply extra filters to a query
  const applyExtraFilters = (query: any) => {
    let q = query;

    // Apply cuisine filters
    for (const cuisine of extraCuisines) {
      q = q.contains('cuisine', [cuisine]);
    }

    // Apply diet filters
    for (const diet of extraDiets) {
      q = q.contains('diet_tags', [diet]);
    }

    // Apply time filter
    if (maxTime) {
      q = q.not('total_time', 'is', null).lte('total_time', maxTime);
    }

    // Apply rating filter
    if (minRating) {
      q = q.not('avg_rating', 'is', null).gte('avg_rating', minRating);
    }

    return q;
  };

  try {
    let recipes: any[] = [];
    let totalCount = 0;

    if (filterType === 'category') {
      const categoryName = CATEGORIES[filterValue];
      if (!categoryName) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }

      let countQuery = supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .contains('category', [categoryName]);
      countQuery = applyExtraFilters(countQuery);
      const { count } = await countQuery;
      totalCount = count || 0;

      let dataQuery = supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name, avg_rating, review_count')
        .eq('is_deleted', false)
        .contains('category', [categoryName]);
      dataQuery = applyExtraFilters(dataQuery);
      const { data, error } = await dataQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      recipes = data || [];

    } else if (filterType === 'cuisine') {
      const cuisineName = CUISINES[filterValue];
      if (!cuisineName) {
        return NextResponse.json({ error: 'Invalid cuisine' }, { status: 400 });
      }

      let countQuery = supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .contains('cuisine', [cuisineName]);
      countQuery = applyExtraFilters(countQuery);
      const { count } = await countQuery;
      totalCount = count || 0;

      let dataQuery = supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name, avg_rating, review_count')
        .eq('is_deleted', false)
        .contains('cuisine', [cuisineName]);
      dataQuery = applyExtraFilters(dataQuery);
      const { data, error } = await dataQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      recipes = data || [];

    } else if (filterType === 'diet') {
      const dietName = DIETS[filterValue];
      if (!dietName) {
        return NextResponse.json({ error: 'Invalid diet' }, { status: 400 });
      }

      let countQuery = supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .contains('diet_tags', [dietName]);
      countQuery = applyExtraFilters(countQuery);
      const { count } = await countQuery;
      totalCount = count || 0;

      let dataQuery = supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name, avg_rating, review_count')
        .eq('is_deleted', false)
        .contains('diet_tags', [dietName]);
      dataQuery = applyExtraFilters(dataQuery);
      const { data, error } = await dataQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      recipes = data || [];

    } else if (filterType === 'time') {
      const timeConfig = COOKING_TIMES[filterValue];
      if (!timeConfig) {
        return NextResponse.json({ error: 'Invalid time filter' }, { status: 400 });
      }

      let countQuery = supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .not('total_time', 'is', null)
        .lte('total_time', timeConfig.maxMinutes);
      countQuery = applyExtraFilters(countQuery);
      const { count } = await countQuery;
      totalCount = count || 0;

      let dataQuery = supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name, avg_rating, review_count')
        .eq('is_deleted', false)
        .not('total_time', 'is', null)
        .lte('total_time', timeConfig.maxMinutes);
      dataQuery = applyExtraFilters(dataQuery);
      const { data, error } = await dataQuery
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

      // Apply extra filters and get count
      let countQuery = supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .in('id', recipeIds);
      countQuery = applyExtraFilters(countQuery);
      const { count } = await countQuery;
      totalCount = count || 0;

      let dataQuery = supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name, avg_rating, review_count')
        .eq('is_deleted', false)
        .in('id', recipeIds);
      dataQuery = applyExtraFilters(dataQuery);
      const { data, error } = await dataQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

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

      // Apply extra filters and get count
      let countQuery = supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .in('id', recipeIds);
      countQuery = applyExtraFilters(countQuery);
      const { count } = await countQuery;
      totalCount = count || 0;

      let dataQuery = supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name, avg_rating, review_count')
        .eq('is_deleted', false)
        .in('id', recipeIds);
      dataQuery = applyExtraFilters(dataQuery);
      const { data, error } = await dataQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

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

      // Apply extra filters and get count
      let countQuery = supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .in('id', recipeIds);
      countQuery = applyExtraFilters(countQuery);
      const { count } = await countQuery;
      totalCount = count || 0;

      let dataQuery = supabase
        .from('recipes')
        .select('id, slug, name, description, prep_time, cook_time, total_time, servings, cuisine, category, diet_tags, source_domain, source_name, avg_rating, review_count')
        .eq('is_deleted', false)
        .in('id', recipeIds);
      dataQuery = applyExtraFilters(dataQuery);
      const { data, error } = await dataQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

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
      avgRating: row.avg_rating,
      reviewCount: row.review_count || 0,
    }));

    return NextResponse.json({ recipes: transformedRecipes, totalCount });

  } catch (error) {
    console.error('Recipe fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}
