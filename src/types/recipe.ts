/**
 * Core recipe type definitions for Simmer
 */

export interface Recipe {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  prepTime: number | null;
  cookTime: number | null;
  totalTime: number | null;
  servings: number | null;
  servingsUnit: string | null;
  cuisine: string[];
  category: string[];
  dietTags: string[];
  sourceUrl: string;
  sourceDomain: string;
  sourceName: string | null;
  createdAt: string;
  updatedAt: string;
  avgRating: number | null;
  reviewCount: number;
}

export interface Ingredient {
  id: string;
  recipeId: string;
  position: number;
  originalText: string;
  amount: number | null;
  amountMax: number | null;
  unit: string | null;
  unitNormalized: string | null;
  item: string | null;
  preparation: string | null;
  affiliateCategory: string | null;
}

export interface Instruction {
  id: string;
  recipeId: string;
  stepNumber: number;
  text: string;
}

export interface Nutrition {
  id: string;
  recipeId: string;
  calories: number | null;
  fatGrams: number | null;
  saturatedFatGrams: number | null;
  carbsGrams: number | null;
  fiberGrams: number | null;
  sugarGrams: number | null;
  proteinGrams: number | null;
  sodiumMg: number | null;
  cholesterolMg: number | null;
  servingSize: string | null;
}

export interface RecipeWithDetails extends Recipe {
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutrition: Nutrition | null;
}

export interface RecipeSearchResult {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  prepTime: number | null;
  cookTime: number | null;
  totalTime: number | null;
  servings: number | null;
  cuisine: string[];
  category: string[];
  dietTags: string[];
  sourceDomain: string;
  sourceName: string | null;
  avgRating: number | null;
  reviewCount: number;
  rank?: number;
}

export interface Review {
  id: string;
  recipeId: string;
  authorName: string;
  rating: number;
  title: string | null;
  comment: string;
  helpfulCount: number;
  createdAt: string;
}

export interface SearchParams {
  query: string;
  cuisine?: string[];
  category?: string[];
  diet?: string[];
  maxTime?: number;
  limit?: number;
  offset?: number;
}

// Scraping types
export interface ScrapeQueueItem {
  id: string;
  url: string;
  domain: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  priority: number;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  scheduledFor: string;
  createdAt: string;
  completedAt: string | null;
}

export interface ScrapeDomain {
  id: string;
  domain: string;
  isEnabled: boolean;
  rateLimitSeconds: number;
  lastScrapedAt: string | null;
  sitemapUrl: string | null;
  totalRecipes: number;
  successfulScrapes: number;
  failedScrapes: number;
}

// Shopping list types (client-side only)
export interface ShoppingListItem {
  id: string;
  text: string;
  recipeId?: string;
  recipeName?: string;
  checked: boolean;
  addedAt: string;
}
