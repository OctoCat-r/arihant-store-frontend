import { cn } from '@/lib/cn'
import type { Category, Product } from '@/types'
import { colorHex, getStockState } from '@/lib/utils'
import { formatINRFull } from '@/lib/formatters'
import { Icon } from '@/components/ui'
import { ProductThumb } from './ProductThumb'

interface ProductRowProps {
  product: Product
  categories: Category[]
  onEdit: (id: string) => void
  onAdjust: (id: string, delta: number) => void
}

const stockBadgeClass = {
  ok: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  low: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  out: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}
const stockDotClass = {
  ok: 'bg-emerald-500',
  low: 'bg-amber-500',
  out: 'bg-red-500',
}

export function ProductRow({ product, categories, onEdit, onAdjust }: ProductRowProps) {
  const stockState = getStockState(product)
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <ProductThumb product={product} categories={categories} size={48} />
      <div className="min-w-0 flex-1">
        <div className="clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{product.name}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {product.brand}
          </span>
          <span className="text-xs text-zinc-400">SKU {product.sku}</span>
          {product.color && (
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: colorHex(product.color) }} />
              {product.color}
            </span>
          )}
        </div>
      </div>
      <div className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:block">
        {formatINRFull(product.price)}
      </div>
      <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', stockBadgeClass[stockState])}>
        <span className={cn('h-1.5 w-1.5 rounded-full', stockDotClass[stockState])} />
        {product.stock}
      </span>
      <div className="flex items-center gap-1">
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-sm font-bold text-zinc-700 hover:bg-stone-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          onClick={() => onAdjust(product.id, -1)}>−</button>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-sm font-bold text-zinc-700 hover:bg-stone-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          onClick={() => onAdjust(product.id, 1)}>+</button>
        <button
          className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
          onClick={() => onEdit(product.id)}>
          <Icon name="edit" size={13} />
        </button>
      </div>
    </div>
  )
}
