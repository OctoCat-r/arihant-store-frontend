import { COLOR_HEX } from '@/constants/colors'
import type { Product } from '@/types'

export function colorHex(name: string): string {
  return COLOR_HEX[name] ?? '#888'
}

export type StockState = 'ok' | 'low' | 'out'

export function getStockState(product: Product): StockState {
  if (product.stock === 0) return 'out'
  if (product.stock <= product.lowStockThreshold) return 'low'
  return 'ok'
}

export function genId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}
