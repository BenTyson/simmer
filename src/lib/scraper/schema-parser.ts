import * as cheerio from 'cheerio';

/**
 * Schema.org Recipe type definition
 * Based on https://schema.org/Recipe
 */
export interface SchemaRecipe {
  '@type': 'Recipe' | string[];
  name: string;
  description?: string;
  recipeIngredient?: string[];
  recipeInstructions?: (string | { '@type': string; text: string })[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string | string[];
  recipeCategory?: string | string[];
  recipeCuisine?: string | string[];
  keywords?: string;
  nutrition?: {
    '@type': 'NutritionInformation';
    calories?: string;
    proteinContent?: string;
    carbohydrateContent?: string;
    fatContent?: string;
    fiberContent?: string;
    sodiumContent?: string;
    sugarContent?: string;
    saturatedFatContent?: string;
    cholesterolContent?: string;
    servingSize?: string;
  };
  author?: { '@type': string; name: string } | string;
  publisher?: { '@type': string; name: string };
  datePublished?: string;
  image?: string | string[] | { '@type': string; url: string }[];
}

/**
 * Extract all JSON-LD blocks from HTML
 */
export function extractJsonLd(html: string): unknown[] {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  const jsonLdData: unknown[] = [];

  scripts.each((_, element) => {
    try {
      const content = $(element).html();
      if (content) {
        const parsed = JSON.parse(content);
        jsonLdData.push(parsed);
      }
    } catch {
      // Skip invalid JSON
    }
  });

  return jsonLdData;
}

/**
 * Find Recipe schema from JSON-LD data
 * Handles various formats: direct type, array, @graph
 */
export function findRecipeSchema(jsonLdArray: unknown[]): SchemaRecipe | null {
  for (const item of jsonLdArray) {
    if (!item || typeof item !== 'object') continue;

    const obj = item as Record<string, unknown>;

    // Direct Recipe type
    if (isRecipeType(obj['@type'])) {
      return obj as unknown as SchemaRecipe;
    }

    // @graph format (common on recipe sites)
    if (Array.isArray(obj['@graph'])) {
      const recipe = obj['@graph'].find(
        (node: unknown) =>
          node && typeof node === 'object' && isRecipeType((node as Record<string, unknown>)['@type'])
      );
      if (recipe) return recipe as SchemaRecipe;
    }

    // Array of schemas
    if (Array.isArray(item)) {
      const recipe = item.find(
        (node: unknown) =>
          node && typeof node === 'object' && isRecipeType((node as Record<string, unknown>)['@type'])
      );
      if (recipe) return recipe as SchemaRecipe;
    }
  }

  return null;
}

/**
 * Check if @type is Recipe
 */
function isRecipeType(type: unknown): boolean {
  if (type === 'Recipe') return true;
  if (Array.isArray(type) && type.includes('Recipe')) return true;
  return false;
}

/**
 * Parse ISO 8601 duration to minutes
 * Examples: PT1H30M -> 90, PT45M -> 45, PT2H -> 120
 */
export function parseDuration(duration: string | undefined): number | null {
  if (!duration) return null;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 60 + minutes + Math.round(seconds / 60);
}

/**
 * Parse servings/yield from various formats
 * Examples: "4 servings", "12 cookies", "4", "Makes 6"
 */
export function parseServings(
  yield_: string | string[] | undefined
): { servings: number; unit: string } | null {
  if (!yield_) return null;

  const text = Array.isArray(yield_) ? yield_[0] : yield_;
  if (!text) return null;

  // Try to extract number
  const match = text.match(/(\d+)/);
  if (!match) return null;

  const servings = parseInt(match[1], 10);

  // Try to extract unit (servings, cookies, cups, etc.)
  const unitMatch = text.match(/\d+\s*(\w+)/);
  const unit = unitMatch ? unitMatch[1].toLowerCase() : 'servings';

  return { servings, unit };
}

/**
 * Normalize instructions to array of strings
 * Handles: string[], HowToStep[], HowToSection[], string
 */
export function normalizeInstructions(
  instructions: SchemaRecipe['recipeInstructions']
): string[] {
  if (!instructions) return [];

  const result: string[] = [];

  const processItem = (item: unknown) => {
    if (typeof item === 'string') {
      // Plain string instruction
      result.push(item.trim());
    } else if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>;

      if (obj['@type'] === 'HowToStep' && obj.text) {
        result.push(String(obj.text).trim());
      } else if (obj['@type'] === 'HowToSection' && Array.isArray(obj.itemListElement)) {
        // Section with nested steps
        obj.itemListElement.forEach(processItem);
      } else if (obj.text) {
        result.push(String(obj.text).trim());
      }
    }
  };

  if (Array.isArray(instructions)) {
    instructions.forEach(processItem);
  } else if (instructions && typeof instructions === 'string') {
    // Sometimes instructions are a single string with newlines
    const instructionStr = instructions as string;
    instructionStr
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => result.push(s));
  }

  return result;
}

/**
 * Normalize category/cuisine to array
 */
export function normalizeArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((s) => s.trim()).filter(Boolean);
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parse nutrition value from string
 * Examples: "200 calories", "15g", "150mg"
 */
export function parseNutritionValue(value: string | undefined): number | null {
  if (!value) return null;

  const match = value.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;

  return parseFloat(match[1]);
}

/**
 * Extract recipe data from HTML
 * Main entry point for scraping
 */
export function extractRecipe(html: string): SchemaRecipe | null {
  const jsonLdData = extractJsonLd(html);
  return findRecipeSchema(jsonLdData);
}
