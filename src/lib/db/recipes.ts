import { createServerClient, createAdminClient } from './client';
import type { Recipe, RecipeWithDetails, Ingredient, Instruction, Nutrition } from '@/types/recipe';

/**
 * Transform database row to Recipe type
 */
function transformRecipe(row: Record<string, unknown>): Recipe {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string | null,
    prepTime: row.prep_time as number | null,
    cookTime: row.cook_time as number | null,
    totalTime: row.total_time as number | null,
    servings: row.servings as number | null,
    servingsUnit: row.servings_unit as string | null,
    cuisine: (row.cuisine as string[]) || [],
    category: (row.category as string[]) || [],
    dietTags: (row.diet_tags as string[]) || [],
    sourceUrl: row.source_url as string,
    sourceDomain: row.source_domain as string,
    sourceName: row.source_name as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    avgRating: row.avg_rating as number | null,
    reviewCount: (row.review_count as number) || 0,
  };
}

/**
 * Transform database row to Ingredient type
 */
function transformIngredient(row: Record<string, unknown>): Ingredient {
  return {
    id: row.id as string,
    recipeId: row.recipe_id as string,
    position: row.position as number,
    originalText: row.original_text as string,
    amount: row.amount as number | null,
    amountMax: row.amount_max as number | null,
    unit: row.unit as string | null,
    unitNormalized: row.unit_normalized as string | null,
    item: row.item as string | null,
    preparation: row.preparation as string | null,
    affiliateCategory: row.affiliate_category as string | null,
  };
}

/**
 * Transform database row to Instruction type
 */
function transformInstruction(row: Record<string, unknown>): Instruction {
  return {
    id: row.id as string,
    recipeId: row.recipe_id as string,
    stepNumber: row.step_number as number,
    text: row.text as string,
  };
}

/**
 * Transform database row to Nutrition type
 */
function transformNutrition(row: Record<string, unknown>): Nutrition {
  return {
    id: row.id as string,
    recipeId: row.recipe_id as string,
    calories: row.calories as number | null,
    fatGrams: row.fat_grams as number | null,
    saturatedFatGrams: row.saturated_fat_grams as number | null,
    carbsGrams: row.carbs_grams as number | null,
    fiberGrams: row.fiber_grams as number | null,
    sugarGrams: row.sugar_grams as number | null,
    proteinGrams: row.protein_grams as number | null,
    sodiumMg: row.sodium_mg as number | null,
    cholesterolMg: row.cholesterol_mg as number | null,
    servingSize: row.serving_size as string | null,
  };
}

/**
 * Get a single recipe by slug with all related data
 * Used for the recipe detail page (SSR)
 */
export async function getRecipeBySlug(slug: string): Promise<RecipeWithDetails | null> {
  const supabase = createServerClient();

  // Fetch recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .eq('is_deleted', false)
    .single();

  if (recipeError || !recipe) {
    return null;
  }

  // Fetch related data in parallel
  const [ingredientsResult, instructionsResult, nutritionResult] = await Promise.all([
    supabase
      .from('ingredients')
      .select('*')
      .eq('recipe_id', recipe.id)
      .order('position', { ascending: true }),
    supabase
      .from('instructions')
      .select('*')
      .eq('recipe_id', recipe.id)
      .order('step_number', { ascending: true }),
    supabase.from('nutrition').select('*').eq('recipe_id', recipe.id).single(),
  ]);

  return {
    ...transformRecipe(recipe),
    ingredients: (ingredientsResult.data || []).map(transformIngredient),
    instructions: (instructionsResult.data || []).map(transformInstruction),
    nutrition: nutritionResult.data ? transformNutrition(nutritionResult.data) : null,
  };
}

/**
 * Get a single recipe by ID
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error || !data) {
    return null;
  }

  return transformRecipe(data);
}

/**
 * Get recent recipes for homepage
 */
export async function getRecentRecipes(limit: number = 12): Promise<Recipe[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map(transformRecipe);
}

/**
 * Get recipes by category
 */
export async function getRecipesByCategory(
  category: string,
  limit: number = 20,
  offset: number = 0
): Promise<Recipe[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_deleted', false)
    .contains('category', [category])
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return [];
  }

  return data.map(transformRecipe);
}

/**
 * Get recipes by cuisine
 */
export async function getRecipesByCuisine(
  cuisine: string,
  limit: number = 20,
  offset: number = 0
): Promise<Recipe[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_deleted', false)
    .contains('cuisine', [cuisine])
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return [];
  }

  return data.map(transformRecipe);
}

/**
 * Get recipes by diet tag
 */
export async function getRecipesByDiet(
  diet: string,
  limit: number = 20,
  offset: number = 0
): Promise<Recipe[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_deleted', false)
    .contains('diet_tags', [diet])
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return [];
  }

  return data.map(transformRecipe);
}

/**
 * Insert a new recipe (admin only, used by scraper)
 */
export async function insertRecipe(
  recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>,
  ingredients: Omit<Ingredient, 'id' | 'recipeId'>[],
  instructions: Omit<Instruction, 'id' | 'recipeId'>[],
  nutrition?: Omit<Nutrition, 'id' | 'recipeId'>
): Promise<{ id: string } | null> {
  const supabase = createAdminClient();

  // Insert recipe
  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .upsert(
      {
        slug: recipe.slug,
        name: recipe.name,
        description: recipe.description,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        total_time: recipe.totalTime,
        servings: recipe.servings,
        servings_unit: recipe.servingsUnit,
        cuisine: recipe.cuisine,
        category: recipe.category,
        diet_tags: recipe.dietTags,
        source_url: recipe.sourceUrl,
        source_domain: recipe.sourceDomain,
        source_name: recipe.sourceName,
        last_scraped_at: new Date().toISOString(),
      },
      { onConflict: 'source_url' }
    )
    .select('id')
    .single();

  if (recipeError || !recipeData) {
    console.error('Failed to insert recipe:', recipeError?.message, recipeError?.details, recipeError?.hint);
    console.error('Recipe data attempted:', JSON.stringify({ slug: recipe.slug, name: recipe.name, sourceUrl: recipe.sourceUrl }));
    return null;
  }

  const recipeId = recipeData.id;

  // Delete existing related data (for upsert)
  await Promise.all([
    supabase.from('ingredients').delete().eq('recipe_id', recipeId),
    supabase.from('instructions').delete().eq('recipe_id', recipeId),
    supabase.from('nutrition').delete().eq('recipe_id', recipeId),
  ]);

  // Insert ingredients
  if (ingredients.length > 0) {
    const { error: ingredientsError } = await supabase.from('ingredients').insert(
      ingredients.map((ing) => ({
        recipe_id: recipeId,
        position: ing.position,
        original_text: ing.originalText,
        amount: ing.amount,
        amount_max: ing.amountMax,
        unit: ing.unit,
        unit_normalized: ing.unitNormalized,
        item: ing.item,
        preparation: ing.preparation,
        affiliate_category: ing.affiliateCategory,
      }))
    );

    if (ingredientsError) {
      console.error('Failed to insert ingredients:', ingredientsError);
    }
  }

  // Insert instructions
  if (instructions.length > 0) {
    const { error: instructionsError } = await supabase.from('instructions').insert(
      instructions.map((inst) => ({
        recipe_id: recipeId,
        step_number: inst.stepNumber,
        text: inst.text,
      }))
    );

    if (instructionsError) {
      console.error('Failed to insert instructions:', instructionsError);
    }
  }

  // Insert nutrition if available
  if (nutrition) {
    const { error: nutritionError } = await supabase.from('nutrition').insert({
      recipe_id: recipeId,
      calories: nutrition.calories,
      fat_grams: nutrition.fatGrams,
      saturated_fat_grams: nutrition.saturatedFatGrams,
      carbs_grams: nutrition.carbsGrams,
      fiber_grams: nutrition.fiberGrams,
      sugar_grams: nutrition.sugarGrams,
      protein_grams: nutrition.proteinGrams,
      sodium_mg: nutrition.sodiumMg,
      cholesterol_mg: nutrition.cholesterolMg,
      serving_size: nutrition.servingSize,
    });

    if (nutritionError) {
      console.error('Failed to insert nutrition:', nutritionError);
    }
  }

  return { id: recipeId };
}
