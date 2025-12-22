/**
 * Main scraper orchestrator
 * Ties together fetching, parsing, and database operations
 */

import { fetchWithRetry, rateLimiter } from './fetcher';
import {
  extractRecipe,
  parseDuration,
  parseServings,
  normalizeInstructions,
  normalizeArray,
  parseNutritionValue,
  cleanText,
} from './schema-parser';
import { parseIngredient } from './ingredient-parser';
import { insertRecipe } from '@/lib/db/recipes';
import type { Recipe, Ingredient, Instruction, Nutrition } from '@/types/recipe';

export interface ScrapeResult {
  success: boolean;
  recipeId?: string;
  error?: string;
  url: string;
}

/**
 * Generate a URL-safe slug from recipe name and domain
 */
function generateSlug(name: string, domain: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);

  const domainPrefix = domain.replace(/\./g, '-').slice(0, 30);

  return `${cleanName}-${domainPrefix}`;
}

/**
 * Scrape a single recipe URL
 */
export async function scrapeRecipe(url: string): Promise<ScrapeResult> {
  const domain = new URL(url).hostname.replace(/^www\./, '');

  try {
    // Rate limit
    await rateLimiter.throttle(domain);

    // Fetch HTML
    const html = await fetchWithRetry(url);

    // Extract schema.org data
    const schemaRecipe = extractRecipe(html);

    if (!schemaRecipe) {
      return {
        success: false,
        error: 'No Recipe schema found',
        url,
      };
    }

    if (!schemaRecipe.name) {
      return {
        success: false,
        error: 'Recipe has no name',
        url,
      };
    }

    // Generate slug
    const slug = generateSlug(schemaRecipe.name, domain);

    // Parse servings
    const servingsData = parseServings(schemaRecipe.recipeYield);

    // Build recipe object
    const recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
      slug,
      name: cleanText(schemaRecipe.name) || schemaRecipe.name,
      description: cleanText(schemaRecipe.description),
      prepTime: parseDuration(schemaRecipe.prepTime),
      cookTime: parseDuration(schemaRecipe.cookTime),
      totalTime: parseDuration(schemaRecipe.totalTime),
      servings: servingsData?.servings || null,
      servingsUnit: servingsData?.unit || null,
      cuisine: normalizeArray(schemaRecipe.recipeCuisine),
      category: normalizeArray(schemaRecipe.recipeCategory),
      dietTags: schemaRecipe.keywords ? normalizeArray(schemaRecipe.keywords) : [],
      sourceUrl: url,
      sourceDomain: domain,
      sourceName: extractSourceName(schemaRecipe),
      avgRating: null,
      reviewCount: 0,
    };

    // Parse ingredients
    const ingredientTexts = schemaRecipe.recipeIngredient || [];
    const ingredients: Omit<Ingredient, 'id' | 'recipeId'>[] = ingredientTexts.map(
      (text, index) => {
        const cleanedText = cleanText(text) || text;
        const parsed = parseIngredient(cleanedText);
        return {
          position: index + 1,
          originalText: cleanedText,
          amount: parsed.amount,
          amountMax: parsed.amountMax,
          unit: parsed.unit,
          unitNormalized: parsed.unitNormalized,
          item: parsed.item,
          preparation: parsed.preparation,
          affiliateCategory: categorizeIngredient(parsed.item),
        };
      }
    );

    // Parse instructions
    const instructionTexts = normalizeInstructions(schemaRecipe.recipeInstructions);
    const instructions: Omit<Instruction, 'id' | 'recipeId'>[] = instructionTexts.map(
      (text, index) => ({
        stepNumber: index + 1,
        text: cleanText(text) || text,
      })
    );

    // Parse nutrition
    let nutrition: Omit<Nutrition, 'id' | 'recipeId'> | undefined;
    if (schemaRecipe.nutrition) {
      nutrition = {
        calories: parseNutritionValue(schemaRecipe.nutrition.calories),
        fatGrams: parseNutritionValue(schemaRecipe.nutrition.fatContent),
        saturatedFatGrams: parseNutritionValue(schemaRecipe.nutrition.saturatedFatContent),
        carbsGrams: parseNutritionValue(schemaRecipe.nutrition.carbohydrateContent),
        fiberGrams: parseNutritionValue(schemaRecipe.nutrition.fiberContent),
        sugarGrams: parseNutritionValue(schemaRecipe.nutrition.sugarContent),
        proteinGrams: parseNutritionValue(schemaRecipe.nutrition.proteinContent),
        sodiumMg: parseNutritionValue(schemaRecipe.nutrition.sodiumContent),
        cholesterolMg: parseNutritionValue(schemaRecipe.nutrition.cholesterolContent),
        servingSize: schemaRecipe.nutrition.servingSize || null,
      };
    }

    // Insert into database
    const result = await insertRecipe(recipe, ingredients, instructions, nutrition);

    if (!result) {
      return {
        success: false,
        error: 'Failed to insert recipe into database',
        url,
      };
    }

    return {
      success: true,
      recipeId: result.id,
      url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
    };
  }
}

/**
 * Extract source name from schema
 */
function extractSourceName(schema: {
  author?: { '@type': string; name: string } | string;
  publisher?: { '@type': string; name: string };
}): string | null {
  if (schema.publisher && typeof schema.publisher === 'object') {
    return schema.publisher.name;
  }
  if (schema.author) {
    if (typeof schema.author === 'string') return schema.author;
    if (typeof schema.author === 'object') return schema.author.name;
  }
  return null;
}

/**
 * Categorize ingredient for affiliate linking
 */
function categorizeIngredient(item: string | null): string | null {
  if (!item) return null;

  const lower = item.toLowerCase();

  // Produce
  if (
    /\b(lettuce|tomato|onion|garlic|pepper|carrot|celery|potato|broccoli|spinach|kale|cucumber|zucchini|mushroom|avocado|lemon|lime|orange|apple|banana|berry|fruit|vegetable)\b/.test(
      lower
    )
  ) {
    return 'produce';
  }

  // Dairy
  if (
    /\b(milk|cream|cheese|butter|yogurt|sour cream|cottage cheese|egg)\b/.test(lower)
  ) {
    return 'dairy';
  }

  // Meat & Seafood
  if (
    /\b(chicken|beef|pork|lamb|turkey|fish|salmon|tuna|shrimp|bacon|sausage|ground)\b/.test(
      lower
    )
  ) {
    return 'meat';
  }

  // Bakery
  if (/\b(bread|roll|bun|tortilla|pita|bagel)\b/.test(lower)) {
    return 'bakery';
  }

  // Pantry
  if (
    /\b(flour|sugar|salt|oil|vinegar|sauce|paste|stock|broth|rice|pasta|noodle|bean|lentil|spice|herb|seasoning)\b/.test(
      lower
    )
  ) {
    return 'pantry';
  }

  return 'other';
}

// Re-export types and utilities
export { parseIngredient } from './ingredient-parser';
export { extractRecipe, parseDuration, parseServings } from './schema-parser';
export { fetchWithRetry, rateLimiter } from './fetcher';
