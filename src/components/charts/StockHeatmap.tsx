import type { Category, Product } from '@/types'

interface StockHeatmapProps {
  products: Product[]
  categories: Category[]
}

function cellColor(p: Product): string {
  const ratio = p.stock / Math.max(p.lowStockThreshold * 4, 20)
  if (p.stock === 0) return '#EF4444'
  if (p.stock <= p.lowStockThreshold) return '#F59E0B'
  if (ratio < 0.4) return '#FCD34D'
  if (ratio < 0.7) return '#A3E635'
  return '#10B981'
}

const LEGEND = [['#EF4444', 'out'], ['#F59E0B', 'low'], ['#FCD34D', 'mid'], ['#A3E635', 'good'], ['#10B981', 'high']] as const

export function StockHeatmap({ products, categories }: StockHeatmapProps) {
  const byCat = categories
    .map(cat => ({ cat, items: products.filter(p => p.category === cat.id).slice(0, 12) }))
    .filter(g => g.items.length > 0)

  return (
    <div className="flex flex-col gap-2">
      {byCat.map(g => (
        <div key={g.cat.id} className="flex items-center gap-2">
          <div className="w-20 shrink-0 truncate text-xs text-zinc-500 dark:text-zinc-400" title={g.cat.name}>
            {g.cat.name}
          </div>
          <div className="flex flex-1 flex-wrap gap-1">
            {g.items.map(p => (
              <div key={p.id}
                className="flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold text-white"
                style={{ background: cellColor(p) }}
                title={`${p.name} — ${p.stock} in stock`}>
                {p.stock}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-1 flex flex-wrap gap-3 border-t border-stone-100 pt-2 dark:border-zinc-800">
        {LEGEND.map(([c, l]) => (
          <span key={l} className="inline-flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
