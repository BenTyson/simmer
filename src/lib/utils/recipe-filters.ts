/**
 * Recipe filter utilities for detecting proteins, cooking methods, and vegetables
 * Used by browse pages to categorize recipes based on ingredient/instruction analysis
 */

// Protein detection keywords
export const PROTEINS: Record<string, { name: string; keywords: string[]; emoji: string }> = {
  chicken: {
    name: 'Chicken',
    keywords: ['chicken', 'chicken breast', 'chicken thigh', 'drumstick', 'chicken wing', 'rotisserie chicken'],
    emoji: '🍗',
  },
  beef: {
    name: 'Beef',
    keywords: ['beef', 'ground beef', 'steak', 'sirloin', 'ribeye', 'brisket', 'roast beef', 'chuck'],
    emoji: '🥩',
  },
  pork: {
    name: 'Pork',
    keywords: ['pork', 'bacon', 'ham', 'pork chop', 'pork loin', 'sausage', 'ribs', 'pork belly', 'prosciutto'],
    emoji: '🥓',
  },
  fish: {
    name: 'Fish',
    keywords: ['salmon', 'cod', 'tilapia', 'tuna', 'halibut', 'trout', 'bass', 'fish fillet', 'mahi', 'snapper', 'catfish'],
    emoji: '🐟',
  },
  seafood: {
    name: 'Seafood',
    keywords: ['shrimp', 'prawns', 'crab', 'lobster', 'scallops', 'mussels', 'clams', 'oysters', 'calamari', 'squid'],
    emoji: '🦐',
  },
  turkey: {
    name: 'Turkey',
    keywords: ['turkey', 'ground turkey', 'turkey breast', 'turkey bacon'],
    emoji: '🦃',
  },
  lamb: {
    name: 'Lamb',
    keywords: ['lamb', 'lamb chop', 'ground lamb', 'lamb shank', 'rack of lamb'],
    emoji: '🍖',
  },
  tofu: {
    name: 'Tofu & Tempeh',
    keywords: ['tofu', 'tempeh', 'seitan', 'firm tofu', 'silken tofu'],
    emoji: '🧊',
  },
  beans: {
    name: 'Beans & Legumes',
    keywords: ['beans', 'lentils', 'chickpeas', 'black beans', 'kidney beans', 'cannellini', 'pinto beans', 'navy beans'],
    emoji: '🫘',
  },
  eggs: {
    name: 'Eggs',
    keywords: ['eggs', 'egg', 'egg whites', 'egg yolks'],
    emoji: '🥚',
  },
};

// Cooking time thresholds
export const COOKING_TIMES: Record<string, { name: string; maxMinutes: number; color: string }> = {
  '15-minutes': {
    name: '15 Minutes or Less',
    maxMinutes: 15,
    color: 'bg-green-100 text-green-700',
  },
  '30-minutes': {
    name: '30 Minutes or Less',
    maxMinutes: 30,
    color: 'bg-emerald-100 text-emerald-700',
  },
  '45-minutes': {
    name: '45 Minutes or Less',
    maxMinutes: 45,
    color: 'bg-teal-100 text-teal-700',
  },
  '1-hour': {
    name: 'Under 1 Hour',
    maxMinutes: 60,
    color: 'bg-cyan-100 text-cyan-700',
  },
};

// Cooking method keywords (detected from instructions)
export const COOKING_METHODS: Record<string, { name: string; keywords: string[]; emoji: string }> = {
  grilled: {
    name: 'Grilled',
    keywords: ['grill', 'grilled', 'grilling', 'barbecue', 'bbq', 'charcoal'],
    emoji: '🔥',
  },
  baked: {
    name: 'Baked',
    keywords: ['bake', 'baked', 'baking', 'roast', 'roasted', 'roasting', 'oven'],
    emoji: '🍞',
  },
  fried: {
    name: 'Fried',
    keywords: ['fry', 'fried', 'frying', 'pan-fry', 'deep-fry', 'sauté', 'saute', 'sautéed'],
    emoji: '🍳',
  },
  'slow-cooker': {
    name: 'Slow Cooker',
    keywords: ['slow cooker', 'crockpot', 'crock pot', 'slow-cooker'],
    emoji: '🥘',
  },
  'instant-pot': {
    name: 'Instant Pot',
    keywords: ['instant pot', 'pressure cooker', 'instapot'],
    emoji: '⚡',
  },
  'no-cook': {
    name: 'No-Cook',
    keywords: ['no-cook', 'no cook', 'raw', 'no bake', 'no-bake'],
    emoji: '🥗',
  },
  stovetop: {
    name: 'Stovetop',
    keywords: ['stovetop', 'stove top', 'simmer', 'boil', 'boiling', 'simmering'],
    emoji: '🍲',
  },
};

// Vegetable keywords
export const VEGETABLES: Record<string, { name: string; keywords: string[]; emoji: string }> = {
  potatoes: {
    name: 'Potatoes',
    keywords: ['potato', 'potatoes', 'sweet potato', 'sweet potatoes', 'yukon', 'russet'],
    emoji: '🥔',
  },
  broccoli: {
    name: 'Broccoli',
    keywords: ['broccoli', 'broccolini'],
    emoji: '🥦',
  },
  tomatoes: {
    name: 'Tomatoes',
    keywords: ['tomato', 'tomatoes', 'cherry tomatoes', 'grape tomatoes', 'roma'],
    emoji: '🍅',
  },
  spinach: {
    name: 'Spinach',
    keywords: ['spinach', 'baby spinach'],
    emoji: '🥬',
  },
  peppers: {
    name: 'Peppers',
    keywords: ['bell pepper', 'peppers', 'jalapeño', 'jalapeno', 'poblano', 'serrano'],
    emoji: '🫑',
  },
  mushrooms: {
    name: 'Mushrooms',
    keywords: ['mushroom', 'mushrooms', 'portobello', 'cremini', 'shiitake', 'button mushroom'],
    emoji: '🍄',
  },
  zucchini: {
    name: 'Zucchini',
    keywords: ['zucchini', 'squash', 'yellow squash', 'summer squash'],
    emoji: '🥒',
  },
  carrots: {
    name: 'Carrots',
    keywords: ['carrot', 'carrots', 'baby carrots'],
    emoji: '🥕',
  },
  onions: {
    name: 'Onions',
    keywords: ['onion', 'onions', 'red onion', 'yellow onion', 'white onion', 'shallot', 'shallots'],
    emoji: '🧅',
  },
  garlic: {
    name: 'Garlic',
    keywords: ['garlic', 'garlic cloves'],
    emoji: '🧄',
  },
};

/**
 * Detect proteins in ingredient list
 * Returns all matching protein slugs
 */
export function detectProteins(ingredients: { item: string | null }[]): string[] {
  const found = new Set<string>();

  for (const ing of ingredients) {
    if (!ing.item) continue;
    const itemLower = ing.item.toLowerCase();

    for (const [slug, config] of Object.entries(PROTEINS)) {
      if (config.keywords.some(kw => itemLower.includes(kw))) {
        found.add(slug);
      }
    }
  }

  return Array.from(found);
}

/**
 * Detect cooking methods from instruction text
 * Returns all matching method slugs
 */
export function detectCookingMethods(instructions: { text: string }[]): string[] {
  const found = new Set<string>();
  const allText = instructions.map(i => i.text.toLowerCase()).join(' ');

  for (const [slug, config] of Object.entries(COOKING_METHODS)) {
    if (config.keywords.some(kw => allText.includes(kw))) {
      found.add(slug);
    }
  }

  return Array.from(found);
}

/**
 * Detect vegetables in ingredient list
 * Returns all matching vegetable slugs
 */
export function detectVegetables(ingredients: { item: string | null }[]): string[] {
  const found = new Set<string>();

  for (const ing of ingredients) {
    if (!ing.item) continue;
    const itemLower = ing.item.toLowerCase();

    for (const [slug, config] of Object.entries(VEGETABLES)) {
      if (config.keywords.some(kw => itemLower.includes(kw))) {
        found.add(slug);
      }
    }
  }

  return Array.from(found);
}

/**
 * Build SQL ILIKE patterns for a keyword list
 * Used for database queries
 */
export function buildKeywordPatterns(keywords: string[]): string[] {
  return keywords.map(kw => `%${kw}%`);
}
