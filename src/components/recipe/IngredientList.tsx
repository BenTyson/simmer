'use client';

import { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { Ingredient } from '@/types/recipe';

interface IngredientListProps {
  ingredients: Ingredient[];
  recipeId: string;
  recipeName: string;
}

export function IngredientList({ ingredients, recipeId, recipeName }: IngredientListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

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
    // This will integrate with the shopping list store
    console.log('Add to shopping list:', ingredient.originalText);
    // TODO: Integrate with Zustand store
  };

  const addAllToShoppingList = () => {
    // Add all unchecked items to shopping list
    ingredients.forEach((ing) => {
      if (!checkedItems.has(ing.id)) {
        addToShoppingList(ing);
      }
    });
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
                {formatIngredient(ingredient)}
              </span>
            </label>

            {/* Add to list button */}
            <button
              onClick={() => addToShoppingList(ingredient)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
              title="Add to shopping list"
            >
              <Plus className="w-4 h-4" />
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

// Format ingredient for display
function formatIngredient(ingredient: Ingredient): string {
  // If we have parsed data, format nicely
  if (ingredient.amount && ingredient.item) {
    const amount = formatAmount(ingredient.amount, ingredient.amountMax);
    const unit = ingredient.unitNormalized || ingredient.unit || '';
    const item = ingredient.item;
    const prep = ingredient.preparation ? `, ${ingredient.preparation}` : '';

    return `${amount} ${unit} ${item}${prep}`.trim().replace(/\s+/g, ' ');
  }

  // Fall back to original text
  return ingredient.originalText;
}

// Format amount with fractions
function formatAmount(amount: number, amountMax?: number | null): string {
  const formatted = formatNumber(amount);

  if (amountMax && amountMax !== amount) {
    return `${formatted}-${formatNumber(amountMax)}`;
  }

  return formatted;
}

// Convert decimal to fraction for display
function formatNumber(num: number): string {
  // Common fractions
  const fractions: Record<number, string> = {
    0.125: '⅛',
    0.25: '¼',
    0.333: '⅓',
    0.375: '⅜',
    0.5: '½',
    0.625: '⅝',
    0.666: '⅔',
    0.75: '¾',
    0.875: '⅞',
  };

  const whole = Math.floor(num);
  const decimal = num - whole;

  // Find closest fraction
  let closestFrac = '';
  let minDiff = 1;

  for (const [key, value] of Object.entries(fractions)) {
    const diff = Math.abs(decimal - parseFloat(key));
    if (diff < minDiff && diff < 0.05) {
      minDiff = diff;
      closestFrac = value;
    }
  }

  if (closestFrac) {
    return whole > 0 ? `${whole}${closestFrac}` : closestFrac;
  }

  // No close fraction, return decimal
  if (decimal === 0) {
    return whole.toString();
  }

  return num.toFixed(num < 1 ? 2 : 1).replace(/\.?0+$/, '');
}
