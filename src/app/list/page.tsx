'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Check, ShoppingCart, ArrowRight, ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useShoppingList } from '@/store/shopping-list';
import { cn } from '@/lib/utils/cn';
import { openInstacartWithItems } from '@/lib/utils/instacart';
import type { ShoppingListItem } from '@/types/recipe';

export default function ShoppingListPage() {
  const { items, toggleItem, removeItem, clearChecked, clearAll } = useShoppingList();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-8 md:py-12">
        <Container size="sm">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-neutral-200 rounded mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-neutral-200 rounded-xl" />
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const checkedCount = items.filter((item) => item.checked).length;
  const uncheckedCount = items.length - checkedCount;

  // Group items by recipe
  const groupedItems = groupByRecipe(items);

  return (
    <div className="py-8 md:py-12">
      <Container size="sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-neutral-900">Shopping List</h1>
            {items.length > 0 && (
              <p className="text-neutral-500 mt-1">
                {uncheckedCount} item{uncheckedCount !== 1 ? 's' : ''} to get
                {checkedCount > 0 && `, ${checkedCount} checked off`}
              </p>
            )}
          </div>

          {items.length > 0 && (
            <div className="flex gap-2">
              {checkedCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearChecked}>
                  Clear checked
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-primary-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
              Your list is empty
            </h2>
            <p className="text-neutral-600 max-w-md mx-auto mb-8">
              Add ingredients from any recipe to build your shopping list. We&apos;ll keep track
              of everything you need.
            </p>
            <Link href="/search">
              <Button>
                Find recipes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Shopping list */}
        {items.length > 0 && (
          <div className="space-y-8">
            {Array.from(groupedItems.entries()).map(([recipeId, recipeItems]) => (
              <div key={recipeId || 'ungrouped'}>
                {/* Recipe name header */}
                {recipeId && recipeItems[0].recipeName && (
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-sm font-medium text-neutral-500">
                      From: {recipeItems[0].recipeName}
                    </h2>
                  </div>
                )}

                {/* Items */}
                <ul className="space-y-2">
                  {recipeItems.map((item) => (
                    <ShoppingItem
                      key={item.id}
                      item={item}
                      onToggle={() => toggleItem(item.id)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </ul>
              </div>
            ))}

            {/* Checkout buttons */}
            <div className="pt-6 border-t border-neutral-200 space-y-3">
              <p className="text-sm text-neutral-500 text-center mb-4">
                Ready to shop? Send your list to:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => openInstacartWithItems(items)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Instacart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => copyToClipboard(items)}
                >
                  Copy list
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

// Shopping list item component
function ShoppingItem({
  item,
  onToggle,
  onRemove,
}: {
  item: ShoppingListItem;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 hover:border-primary-200 transition-colors">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
          item.checked
            ? 'bg-primary-500 border-primary-500'
            : 'border-neutral-300 hover:border-primary-400'
        )}
      >
        {item.checked && <Check className="w-4 h-4 text-white" />}
      </button>

      {/* Text */}
      <span
        className={cn(
          'flex-1 text-base transition-all',
          item.checked && 'text-neutral-400 line-through'
        )}
      >
        {item.text}
      </span>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"
        title="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}

// Group items by recipe
function groupByRecipe(items: ShoppingListItem[]): Map<string | undefined, ShoppingListItem[]> {
  const grouped = new Map<string | undefined, ShoppingListItem[]>();

  // First, add items with recipes
  items
    .filter((item) => item.recipeId)
    .forEach((item) => {
      const existing = grouped.get(item.recipeId) || [];
      grouped.set(item.recipeId, [...existing, item]);
    });

  // Then, add ungrouped items
  const ungrouped = items.filter((item) => !item.recipeId);
  if (ungrouped.length > 0) {
    grouped.set(undefined, ungrouped);
  }

  return grouped;
}

// Copy list to clipboard
async function copyToClipboard(items: ShoppingListItem[]) {
  const unchecked = items.filter((item) => !item.checked);
  const text = unchecked.map((item) => `- ${item.text}`).join('\n');

  try {
    await navigator.clipboard.writeText(text);
    alert('List copied to clipboard!');
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('List copied to clipboard!');
  }
}
