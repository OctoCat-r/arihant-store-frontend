import { create } from "zustand";
import type { SavedFilter, SortKey, StockFilter } from "@/types";

export interface InventoryFilterType extends Partial<{
  searchQuery: string | null;
  activeCat: string | null;
  brands: string[] | null;
  colors: string[] | null;
  compat: string[] | null;
  stock: StockFilter | null;
  priceMin: string | null;
  priceMax: string | null;
}> {}

interface InventoryFilterStore {
  filters: InventoryFilterType;
  sortBy: SortKey;
  updateFilters: (updates: InventoryFilterType) => void;
  resetFilters: () => void;
  toggleArrayFilter: (
    field: "brands" | "colors" | "compat",
    val: string,
  ) => void;
  applySaved: (f: SavedFilter) => void;
  updateSorting: (sortBy: SortKey) => void;
}

const DEFAULT_FILTERS: InventoryFilterType = {
  stock: "all",
};

export const useInventoryFilterStore = create<InventoryFilterStore>((set) => ({
  filters: { ...DEFAULT_FILTERS },
  sortBy: "name",

  updateFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates },
    })),

  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

  toggleArrayFilter: (field, val) =>
    set((state) => {
      const arr = (state.filters[field] ?? []) as string[];
      return {
        filters: {
          ...state.filters,
          [field]: arr.includes(val)
            ? arr.filter((x) => x !== val)
            : [...arr, val],
        },
      };
    }),

  applySaved: (savedFilter) =>
    set({
      filters: {
        ...DEFAULT_FILTERS,
        ...(savedFilter.cat && { activeCat: savedFilter.cat }),
        ...savedFilter,
      },
    }),

  updateSorting: (sortBy) => set({ sortBy }),
}));
