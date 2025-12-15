import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShoppingListItem } from '@/types/recipe';

interface ShoppingListState {
  items: ShoppingListItem[];

  // Actions
  addItem: (text: string, recipeId?: string, recipeName?: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  clearChecked: () => void;
  clearAll: () => void;
  getItemsByRecipe: () => Map<string | undefined, ShoppingListItem[]>;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useShoppingList = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (text, recipeId, recipeName) => {
        // Don't add duplicates
        const existing = get().items.find(
          (item) => item.text.toLowerCase() === text.toLowerCase()
        );
        if (existing) return;

        const newItem: ShoppingListItem = {
          id: generateId(),
          text,
          recipeId,
          recipeName,
          checked: false,
          addedAt: new Date().toISOString(),
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        }));
      },

      clearChecked: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.checked),
        }));
      },

      clearAll: () => {
        set({ items: [] });
      },

      getItemsByRecipe: () => {
        const items = get().items;
        const grouped = new Map<string | undefined, ShoppingListItem[]>();

        items.forEach((item) => {
          const key = item.recipeId;
          const existing = grouped.get(key) || [];
          grouped.set(key, [...existing, item]);
        });

        return grouped;
      },
    }),
    {
      name: 'simmer-shopping-list',
    }
  )
);
