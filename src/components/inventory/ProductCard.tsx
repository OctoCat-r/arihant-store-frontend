import { cn } from '@/lib/cn'
import type { Category, Product } from '@/types'
import { getStockState } from '@/lib/utils'
import { formatINRFull } from '@/lib/formatters'
import { Icon } from '@/components/ui'
import { ProductThumb } from './ProductThumb'

interface ProductCardProps {
  product: Product
  categories: Category[]
  onEdit: (id: string) => void
  onAdjust: (id: string, delta: number) => void
}

const stockBadge = {
  ok:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  low: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  out: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

export function ProductCard({ product, categories, onEdit, onAdjust }: ProductCardProps) {
  const s = getStockState(product)

  return (
    <div className="flex flex-col rounded-xl border border-stone-200 bg-white transition-colors hover:border-stone-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">

      {/* Info */}
      <div className="flex flex-col gap-1.5 px-3 pt-3 pb-2">

        {/* Row 1 — thumb + name + stock badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <ProductThumb product={product} categories={categories} size={36} />
            <span
              className="clamp-2 pt-0.5 text-[13px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100"
              title={product.name}
            >
              {product.name}
            </span>
          </div>
          <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums', stockBadge[s])}>
            {product.stock}
          </span>
        </div>

        {/* Row 2 — brand + price */}
        <div className="flex items-center justify-between gap-2">
          <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {product.brand}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400">₹{product.cost}</span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
              {formatINRFull(product.price)}
            </span>
          </div>
        </div>

      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 border-t border-stone-100 px-2.5 py-1.5 dark:border-zinc-800">
        <button
          className="flex h-6 w-6 items-center justify-center rounded border border-stone-200 text-xs font-bold text-zinc-600 transition-colors hover:bg-stone-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          onClick={() => onAdjust(product.id, -1)}
        >−</button>
        <span className="w-7 text-center text-xs font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
          {product.stock}
        </span>
        <button
          className="flex h-6 w-6 items-center justify-center rounded border border-stone-200 text-xs font-bold text-zinc-600 transition-colors hover:bg-stone-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          onClick={() => onAdjust(product.id, 1)}
        >+</button>
        <button
          className="ml-auto inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-stone-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          onClick={() => onEdit(product.id)}
        >
          <Icon name="edit" size={11} />Edit
        </button>
      </div>

    </div>
  )
}
