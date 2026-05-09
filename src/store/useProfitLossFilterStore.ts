import { create } from 'zustand'

export interface ProfitLossFilterType
  extends Partial<{
    range: string | null
  }> {}

interface ProfitLossFilterStore {
  filters: ProfitLossFilterType
  updateFilters: (updates: ProfitLossFilterType) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: ProfitLossFilterType = {
  range: '30',
}

export const useProfitLossFilterStore = create<ProfitLossFilterStore>(set => ({
  filters: { ...DEFAULT_FILTERS },

  updateFilters: updates =>
    set(state => ({
      filters: { ...state.filters, ...updates },
    })),

  resetFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS } }),
}))
