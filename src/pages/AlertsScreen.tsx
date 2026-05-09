import { useNavigate } from 'react-router-dom'
import { Icon, ProductThumb } from '@/components'
import { useGetProductsQuery, useGetCategoriesQuery } from '@/hooks'
import type { Category, Product } from '@/types'

interface AlertCardProps {
  title: string
  count: string
  iconColor: string
  icon: string
  children: React.ReactNode
}

function AlertCard({ title, count, iconColor, icon, children }: AlertCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-4 dark:border-zinc-800">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${iconColor}22`, color: iconColor }}>
          <Icon name={icon} size={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
          <span className="text-xs text-zinc-400">{count}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

function ProductAlertRow({ p, categories, label, onEdit }: { p: Product; categories: Category[]; label: string; onEdit: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <ProductThumb product={p} categories={categories} size={40} />
      <div className="min-w-0 flex-1">
        <div className="clamp-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.name}</div>
        <div className="text-xs text-zinc-400">{p.stock > 0 ? `${p.stock} left · alerts at ${p.lowStockThreshold}` : `Last sold ${p.sold30d} this month`}</div>
      </div>
      <button
        className="shrink-0 rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        onClick={onEdit}>{label}</button>
    </div>
  )
}

export function AlertsScreen() {
  const navigate = useNavigate()
  const { data: productsResult } = useGetProductsQuery()
  const { data: categories = [] } = useGetCategoriesQuery()
  const products = productsResult?.data ?? []

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold)
  const outOfStock = products.filter(p => p.stock === 0)
  const slowMovers = [...products].sort((a, b) => a.sold30d - b.sold30d).slice(0, 5)

  const goEdit = (id: string) => navigate(`/products/${id}/edit`)

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Alerts & insights</h1>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{lowStock.length + outOfStock.length} items need attention</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AlertCard title="Out of stock" count={`${outOfStock.length} items`} iconColor="#EF4444" icon="alerts">
          {outOfStock.length === 0 ? (
            <p className="px-5 py-4 text-sm text-zinc-400">Nothing out of stock — well done!</p>
          ) : (
            <div className="flex flex-col divide-y divide-stone-50 dark:divide-zinc-800/50">
              {outOfStock.map(p => (
                <ProductAlertRow key={p.id} p={p} categories={categories} label="Restock" onEdit={() => goEdit(p.id)} />
              ))}
            </div>
          )}
        </AlertCard>

        <AlertCard title="Low stock" count={`${lowStock.length} items`} iconColor="#F59E0B" icon="alerts">
          <div className="flex flex-col divide-y divide-stone-50 dark:divide-zinc-800/50">
            {lowStock.map(p => (
              <ProductAlertRow key={p.id} p={p} categories={categories} label="Update" onEdit={() => goEdit(p.id)} />
            ))}
          </div>
        </AlertCard>

        <AlertCard title="Slow movers" count="consider promotions" iconColor="#7C3AED" icon="sales">
          <div className="flex flex-col divide-y divide-stone-50 dark:divide-zinc-800/50">
            {slowMovers.map(p => (
              <ProductAlertRow key={p.id} p={p} categories={categories} label="View" onEdit={() => goEdit(p.id)} />
            ))}
          </div>
        </AlertCard>
      </div>
    </div>
  )
}
