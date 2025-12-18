'use client';

import { useState } from 'react';
import { Plus, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { useRecipeView } from '@/store/recipe-view';
import { useShoppingList } from '@/store/shopping-list';
import { convertUnit, formatAmount, scaleAmount } from '@/lib/utils/units';
import type { Ingredient } from '@/types/recipe';

interface IngredientListProps {
  ingredients: Ingredient[];
  recipeId: string;
  recipeName: string;
}

export function IngredientList({ ingredients, recipeId, recipeName }: IngredientListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const { servings, defaultServings, unitSystem } = useRecipeView();
  const { addItem } = useShoppingList();

  const scale = servings / defaultServings;

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const addToShoppingList = (ingredient: Ingredient) => {
    const shoppingText = formatForShoppingList(ingredient, scale, unitSystem);
    addItem(shoppingText, recipeId, recipeName);
    setAddedItems(prev => new Set(prev).add(ingredient.id));

    // Clear the "added" indicator after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(ingredient.id);
        return next;
      });
    }, 2000);
  };

  const addAllToShoppingList = () => {
    ingredients.forEach((ing) => {
      if (!checkedItems.has(ing.id)) {
        const shoppingText = formatForShoppingList(ing, scale, unitSystem);
        addItem(shoppingText, recipeId, recipeName);
      }
    });
    // Mark all as added briefly
    const allIds = new Set(ingredients.map(i => i.id));
    setAddedItems(allIds);
    setTimeout(() => setAddedItems(new Set()), 2000);
  };

  if (ingredients.length === 0) {
    return (
      <p className="text-neutral-500 italic">No ingredients available.</p>
    );
  }

  return (
    <div>
      <ul className="space-y-3">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className="group flex items-start gap-3">
            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={checkedItems.has(ingredient.id)}
                onChange={() => toggleItem(ingredient.id)}
                className="sr-only peer"
              />
              <span
                className={cn(
                  'flex-shrink-0 w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
                  checkedItems.has(ingredient.id)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-neutral-300 group-hover:border-primary-400'
                )}
              >
                {checkedItems.has(ingredient.id) && (
                  <svg className="w-3 h-3 text-white animate-check" viewBox="0 0 12 12">
                    <path
                      fill="currentColor"
                      d="M10.28 2.28a.75.75 0 00-1.06 0L4.5 7l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25a.75.75 0 000-1.06z"
                    />
                  </svg>
                )}
              </span>
              <span
                className={cn(
                  'text-base leading-relaxed transition-all',
                  checkedItems.has(ingredient.id) && 'text-neutral-400 line-through'
                )}
              >
                {formatIngredient(ingredient, scale, unitSystem)}
              </span>
            </label>

            {/* Add to list button */}
            <button
              onClick={() => addToShoppingList(ingredient)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                addedItems.has(ingredient.id)
                  ? 'opacity-100 text-green-600 bg-green-50'
                  : 'opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-primary-600 hover:bg-primary-50'
              )}
              title={addedItems.has(ingredient.id) ? 'Added!' : 'Add to shopping list'}
            >
              {addedItems.has(ingredient.id) ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Add all button */}
      <div className="mt-6">
        <Button variant="outline" onClick={addAllToShoppingList} className="w-full">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add all to shopping list
        </Button>
      </div>
    </div>
  );
}

type UnitSystem = 'us' | 'metric';

// Format ingredient for display with scaling and unit conversion
function formatIngredient(
  ingredient: Ingredient,
  scale: number = 1,
  unitSystem: UnitSystem = 'us'
): string {
  // If we have parsed data, format with scaling and conversion
  if (ingredient.amount && ingredient.item) {
    // Scale the amount
    let scaledAmount = scaleAmount(ingredient.amount, scale);
    let scaledMax = ingredient.amountMax ? scaleAmount(ingredient.amountMax, scale) : null;
    let unit = ingredient.unitNormalized || ingredient.unit || '';

    // Convert units if metric is selected
    if (unitSystem === 'metric' && unit) {
      const converted = convertUnit(scaledAmount, unit, 'metric');
      scaledAmount = converted.amount;
      unit = converted.unit;

      if (scaledMax) {
        const convertedMax = convertUnit(scaledMax, ingredient.unitNormalized || ingredient.unit || '', 'metric');
        scaledMax = convertedMax.amount;
      }
    }

    // Format the amount
    const formattedAmount = formatDisplayAmount(scaledAmount, scaledMax, unitSystem);
    const item = ingredient.item;
    const prep = ingredient.preparation ? `, ${ingredient.preparation}` : '';

    return `${formattedAmount} ${unit} ${item}${prep}`.trim().replace(/\s+/g, ' ');
  }

  // Fall back to original text (can't scale without parsed data)
  return ingredient.originalText;
}

// Format amount with optional max value
function formatDisplayAmount(
  amount: number,
  amountMax: number | null,
  unitSystem: UnitSystem
): string {
  const formatted = formatAmount(amount, unitSystem);

  if (amountMax && Math.abs(amountMax - amount) > 0.01) {
    return `${formatted}-${formatAmount(amountMax, unitSystem)}`;
  }

  return formatted;
}

// Units that represent small quantities (spices, seasonings) - just show item name
const SMALL_QUANTITY_UNITS = new Set([
  'tsp', 'teaspoon', 'teaspoons',
  'tbsp', 'tablespoon', 'tablespoons',
  'pinch', 'dash', 'sprinkle',
  'ml', // small metric volumes
]);

// Units where quantity matters for shopping (produce, proteins, large volumes)
const COUNTABLE_UNITS = new Set([
  'lb', 'lbs', 'pound', 'pounds',
  'oz', 'ounce', 'ounces',
  'cup', 'cups',
  'can', 'cans',
  'package', 'packages', 'pkg',
  'bunch', 'bunches',
  'head', 'heads',
  'clove', 'cloves',
  'slice', 'slices',
  'piece', 'pieces',
  'g', 'kg', 'L', // larger metric
]);

/**
 * Format ingredient for shopping list - focuses on what you actually buy
 *
 * Examples:
 * - "2 tsp cumin" → "cumin"
 * - "2 carrots" → "carrots (2)"
 * - "1 lb chicken breast" → "chicken breast (1 lb)"
 * - "1 cup olive oil" → "olive oil (1 cup)"
 * - "salt to taste" → "salt"
 */
function formatForShoppingList(
  ingredient: Ingredient,
  scale: number = 1,
  unitSystem: UnitSystem = 'us'
): string {
  // If no parsed data, return original but try to clean it
  if (!ingredient.item) {
    return cleanItemName(ingredient.originalText);
  }

  const item = cleanItemName(ingredient.item);
  const unit = ingredient.unitNormalized || ingredient.unit || '';
  const normalizedUnit = unit.toLowerCase().trim();

  // No amount - just the item
  if (!ingredient.amount) {
    return item;
  }

  // Scale the amount
  let scaledAmount = scaleAmount(ingredient.amount, scale);
  let displayUnit = unit;

  // Convert units if metric
  if (unitSystem === 'metric' && unit) {
    const converted = convertUnit(scaledAmount, unit, 'metric');
    scaledAmount = converted.amount;
    displayUnit = converted.unit;
  }

  // Small quantities (spices, seasonings) - just the item name
  if (SMALL_QUANTITY_UNITS.has(normalizedUnit)) {
    // Exception: if it's a large amount (like 1/4 cup of a spice), show it
    if (normalizedUnit === 'tbsp' && scaledAmount >= 3) {
      return `${item} (${formatAmount(scaledAmount, unitSystem)} ${displayUnit})`;
    }
    if (normalizedUnit === 'ml' && scaledAmount >= 50) {
      return `${item} (${formatAmount(scaledAmount, unitSystem)} ${displayUnit})`;
    }
    return item;
  }

  // No unit but has amount (like "2 carrots", "4 garlic cloves")
  if (!unit && scaledAmount) {
    // Whole numbers look cleaner without decimals
    const displayAmount = scaledAmount % 1 === 0
      ? scaledAmount.toString()
      : formatAmount(scaledAmount, unitSystem);
    return `${item} (${displayAmount})`;
  }

  // Countable/significant units - show with quantity
  if (COUNTABLE_UNITS.has(normalizedUnit) || scaledAmount >= 0.5) {
    const formattedAmount = formatAmount(scaledAmount, unitSystem);
    return `${item} (${formattedAmount} ${displayUnit})`.trim();
  }

  // Default: just the item
  return item;
}

/**
 * Clean up item name for shopping list display
 */
function cleanItemName(text: string): string {
  return text
    // Remove leading/trailing whitespace
    .trim()
    // Capitalize first letter
    .replace(/^./, (c) => c.toUpperCase());
}
