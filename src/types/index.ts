export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Product {
  id: string
  name: string
  category: string
  brand: string
  stock: number
  cost: number
  price: number
  compatibleWith: string[]
  color: string | null
  sku: string
  sold30d: number
  rating: number
  addedDate: string
  lowStockThreshold: number
  image: string | null
}

export interface Sale {
  id: string
  date: string
  productId: string
  productName: string
  category: string
  qty: number
  revenue: number
  cost: number
  profit: number
  customer: string
}

export type Theme = 'light' | 'dark'
export type StockFilter = 'all' | 'inStock' | 'low' | 'out'
export type SortKey = 'name' | 'priceAsc' | 'priceDesc' | 'stock' | 'sales'
export type ViewMode = 'grid' | 'list'

export interface SavedFilter {
  name: string
  cat?: string
  brands?: string[]
  colors?: string[]
  compat?: string[]
  stock?: StockFilter
}

export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
}

export interface ActiveChip {
  key: string
  label: string
  clear: () => void
}
