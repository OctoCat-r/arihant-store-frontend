import { create } from 'zustand'

export interface SalesFilterType
  extends Partial<{
    range: string | null
    catFilter: string | null
    pmFilter: string | null
  }> {}

interface SalesFilterStore {
  filters: SalesFilterType
  updateFilters: (updates: SalesFilterType) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: SalesFilterType = {
  range: '30',
  catFilter: 'all',
  pmFilter: 'all',
}

export const useSalesFilterStore = create<SalesFilterStore>(set => ({
  filters: { ...DEFAULT_FILTERS },

  updateFilters: updates =>
    set(state => ({
      filters: { ...state.filters, ...updates },
    })),

  resetFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS } }),
}))
