/**
 * Ingredient parser for extracting structured data from ingredient strings
 * Examples:
 *   "2 cups flour" -> { amount: 2, unit: "cups", item: "flour" }
 *   "1/2 teaspoon salt" -> { amount: 0.5, unit: "tsp", item: "salt" }
 *   "3-4 cloves garlic, minced" -> { amount: 3, amountMax: 4, unit: null, item: "cloves garlic", preparation: "minced" }
 */

export interface ParsedIngredient {
  amount: number | null;
  amountMax: number | null;
  unit: string | null;
  unitNormalized: string | null;
  item: string | null;
  preparation: string | null;
}

// Unit normalization map
const UNIT_MAP: Record<string, string> = {
  // Volume - tablespoons
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  tbsp: 'tbsp',
  tbs: 'tbsp',
  tb: 'tbsp',

  // Volume - teaspoons
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  tsp: 'tsp',
  ts: 'tsp',

  // Volume - cups
  cup: 'cup',
  cups: 'cup',
  c: 'cup',

  // Volume - fluid ounces
  'fluid ounce': 'fl oz',
  'fluid ounces': 'fl oz',
  'fl oz': 'fl oz',
  floz: 'fl oz',

  // Volume - pints, quarts, gallons
  pint: 'pint',
  pints: 'pint',
  pt: 'pint',
  quart: 'quart',
  quarts: 'quart',
  qt: 'quart',
  gallon: 'gallon',
  gallons: 'gallon',
  gal: 'gallon',

  // Weight - ounces
  ounce: 'oz',
  ounces: 'oz',
  oz: 'oz',

  // Weight - pounds
  pound: 'lb',
  pounds: 'lb',
  lb: 'lb',
  lbs: 'lb',

  // Metric - grams
  gram: 'g',
  grams: 'g',
  g: 'g',
  gr: 'g',

  // Metric - kilograms
  kilogram: 'kg',
  kilograms: 'kg',
  kg: 'kg',

  // Metric - milliliters/liters
  milliliter: 'ml',
  milliliters: 'ml',
  ml: 'ml',
  liter: 'L',
  liters: 'L',
  l: 'L',

  // Other common units
  pinch: 'pinch',
  dash: 'dash',
  handful: 'handful',
  bunch: 'bunch',
  sprig: 'sprig',
  sprigs: 'sprig',
  clove: 'clove',
  cloves: 'clove',
  slice: 'slice',
  slices: 'slice',
  piece: 'piece',
  pieces: 'piece',
  can: 'can',
  cans: 'can',
  package: 'package',
  packages: 'package',
  pkg: 'package',
  stick: 'stick',
  sticks: 'stick',
  head: 'head',
  heads: 'head',
  stalk: 'stalk',
  stalks: 'stalk',
};

// Fraction map for common fractions
const FRACTION_MAP: Record<string, number> = {
  '½': 0.5,
  '⅓': 0.333,
  '⅔': 0.667,
  '¼': 0.25,
  '¾': 0.75,
  '⅛': 0.125,
  '⅜': 0.375,
  '⅝': 0.625,
  '⅞': 0.875,
  '⅕': 0.2,
  '⅖': 0.4,
  '⅗': 0.6,
  '⅘': 0.8,
  '⅙': 0.167,
  '⅚': 0.833,
};

// Regex patterns
const AMOUNT_PATTERN =
  /^([\d]+(?:[\d.,\/\s-]+)?|[½⅓⅔¼¾⅛⅜⅝⅞⅕⅖⅗⅘⅙⅚]+(?:\s*[\d½⅓⅔¼¾⅛⅜⅝⅞⅕⅖⅗⅘⅙⅚\/\d]+)?)/;
const UNIT_PATTERN = new RegExp(
  `^(${Object.keys(UNIT_MAP).join('|')})\\.?\\s+`,
  'i'
);
const PREPARATION_PATTERN = /,\s*(.+)$/;

/**
 * Parse an ingredient string into structured data
 */
export function parseIngredient(text: string): ParsedIngredient {
  const original = text.trim();
  let remaining = original;

  // Default result
  const result: ParsedIngredient = {
    amount: null,
    amountMax: null,
    unit: null,
    unitNormalized: null,
    item: null,
    preparation: null,
  };

  // Handle edge case: empty string
  if (!remaining) {
    return result;
  }

  // 1. Extract preparation (text after comma)
  const prepMatch = remaining.match(PREPARATION_PATTERN);
  if (prepMatch) {
    result.preparation = prepMatch[1].trim();
    remaining = remaining.replace(PREPARATION_PATTERN, '').trim();
  }

  // 2. Extract amount (at the start)
  const amountMatch = remaining.match(AMOUNT_PATTERN);
  if (amountMatch) {
    const amountStr = amountMatch[1];
    const { amount, amountMax } = parseAmount(amountStr);
    result.amount = amount;
    result.amountMax = amountMax;
    remaining = remaining.slice(amountStr.length).trim();
  }

  // 3. Extract unit
  const unitMatch = remaining.match(UNIT_PATTERN);
  if (unitMatch) {
    result.unit = unitMatch[1];
    result.unitNormalized = normalizeUnit(unitMatch[1]);
    remaining = remaining.slice(unitMatch[0].length).trim();
  }

  // 4. What's left is the item (minus any parenthetical notes)
  // Remove parenthetical notes like "(14 oz)" but keep important ones
  remaining = remaining
    .replace(/\([\d\s.,]+(?:oz|g|ml|lb|kg)?\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  result.item = remaining || null;

  return result;
}

/**
 * Parse amount string to number(s)
 * Handles: "2", "1/2", "1 1/2", "3-4", "½", "1½"
 */
function parseAmount(str: string): { amount: number; amountMax: number | null } {
  const trimmed = str.trim();

  // Check for range (e.g., "3-4", "3 to 4")
  const rangeMatch = trimmed.match(/^([\d\/\s.½⅓⅔¼¾⅛⅜⅝⅞]+)\s*[-–—to]\s*([\d\/\s.½⅓⅔¼¾⅛⅜⅝⅞]+)$/);
  if (rangeMatch) {
    return {
      amount: parseNumber(rangeMatch[1]),
      amountMax: parseNumber(rangeMatch[2]),
    };
  }

  return {
    amount: parseNumber(trimmed),
    amountMax: null,
  };
}

/**
 * Parse a single number string
 * Handles: "2", "1/2", "1 1/2", "½", "1½"
 */
function parseNumber(str: string): number {
  const trimmed = str.trim();

  // Replace Unicode fractions with decimals
  let processed = trimmed;
  for (const [frac, decimal] of Object.entries(FRACTION_MAP)) {
    if (processed.includes(frac)) {
      // "1½" -> "1" + 0.5
      const parts = processed.split(frac);
      const whole = parts[0] ? parseFloat(parts[0]) || 0 : 0;
      return whole + decimal;
    }
  }

  // Handle slash fractions: "1/2", "1 1/2"
  const parts = processed.split(/\s+/);
  let total = 0;

  for (const part of parts) {
    if (part.includes('/')) {
      const [num, denom] = part.split('/');
      total += parseFloat(num) / parseFloat(denom);
    } else {
      total += parseFloat(part) || 0;
    }
  }

  return total;
}

/**
 * Normalize unit to standard form
 */
function normalizeUnit(unit: string): string {
  const lower = unit.toLowerCase().trim();
  return UNIT_MAP[lower] || lower;
}

/**
 * Parse multiple ingredients
 */
export function parseIngredients(texts: string[]): ParsedIngredient[] {
  return texts.map(parseIngredient);
}
