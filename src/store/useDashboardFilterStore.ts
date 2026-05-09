import { create } from 'zustand'

interface DashboardFilters {
  range: string
}

interface DashboardFilterStore {
  filters: DashboardFilters
  updateFilters: (f: Partial<DashboardFilters>) => void
}

export const useDashboardFilterStore = create<DashboardFilterStore>()(set => ({
  filters: { range: '30' },
  updateFilters: f => set(s => ({ filters: { ...s.filters, ...f } })),
}))
