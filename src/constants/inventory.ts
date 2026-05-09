import type { SavedFilter } from '@/types'

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'priceAsc', label: 'Price ↑' },
  { value: 'priceDesc', label: 'Price ↓' },
  { value: 'stock', label: 'Stock (low first)' },
  { value: 'sales', label: 'Best selling' },
] as const

export const SAVED_FILTERS: SavedFilter[] = [
  {
    name: 'Black covers — Samsung A13',
    cat: 'cat-cases',
    colors: ['Black'],
    compat: ['Samsung A13'],
  },
  { name: 'Low-stock urgents', stock: 'low' },
  { name: 'Boat earphones', cat: 'cat-earphones', brands: ['Boat'] },
]
