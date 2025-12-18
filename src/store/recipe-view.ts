import { create } from 'zustand';

type UnitSystem = 'us' | 'metric';

interface RecipeViewState {
  // State
  servings: number;
  defaultServings: number;
  unitSystem: UnitSystem;

  // Computed
  scale: number;

  // Actions
  setServings: (servings: number) => void;
  setDefaultServings: (defaultServings: number) => void;
  incrementServings: () => void;
  decrementServings: () => void;
  setUnitSystem: (system: UnitSystem) => void;
  toggleUnitSystem: () => void;
  reset: () => void;
}

export const useRecipeView = create<RecipeViewState>()((set, get) => ({
  servings: 4,
  defaultServings: 4,
  unitSystem: 'us',

  get scale() {
    const state = get();
    return state.servings / state.defaultServings;
  },

  setServings: (servings) => {
    if (servings >= 1) {
      set({ servings });
    }
  },

  setDefaultServings: (defaultServings) => {
    set({ defaultServings, servings: defaultServings });
  },

  incrementServings: () => {
    set((state) => ({ servings: state.servings + 1 }));
  },

  decrementServings: () => {
    set((state) => ({
      servings: state.servings > 1 ? state.servings - 1 : 1
    }));
  },

  setUnitSystem: (unitSystem) => {
    set({ unitSystem });
  },

  toggleUnitSystem: () => {
    set((state) => ({
      unitSystem: state.unitSystem === 'us' ? 'metric' : 'us'
    }));
  },

  reset: () => {
    set((state) => ({
      servings: state.defaultServings,
      unitSystem: 'us'
    }));
  },
}));
