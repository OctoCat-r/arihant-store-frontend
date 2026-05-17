import { useState } from 'react'
import { formatINR, formatINRFull } from '@/lib/formatters'
import { KpiCard, Icon, AppSelect } from '@/components'
import { RecordSaleModal } from '@/components/sales/RecordSaleModal'
import { useSalesFilterStore } from '@/store'
import { useGetSalesQuery, useGetCategoriesQuery } from '@/hooks'
import type { SelectOption } from '@/components/ui/AppSelect'

const RANGE_OPTIONS: SelectOption[] = [
  { value: '1', label: 'Today' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
]

export function SalesLog() {
  const [modalOpen, setModalOpen] = useState(false)
  const { filters, updateFilters } = useSalesFilterStore()
  const range = filters.range ?? '30'
  const catFilter = filters.catFilter ?? 'all'

  const { data, isLoading } = useGetSalesQuery()
  const { data: categories = [] } = useGetCategoriesQuery()
  const sales = data?.data ?? []
  const total = data?.meta?.total ?? 0

  const totalRev = sales.reduce((a, s) => a + s.revenue, 0)
  const totalProfit = sales.reduce((a, s) => a + s.profit, 0)

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Sales & Orders</h1>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{total} orders · {formatINRFull(totalRev)} revenue</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
              <Icon name="upload" size={14} />Export
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-(--accent) px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Icon name="plus" size={14} />Record Sale
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <AppSelect
            className="w-36"
            options={RANGE_OPTIONS}
            value={RANGE_OPTIONS.find(o => o.value === range) ?? null}
            onChange={opt => opt && updateFilters({ range: (opt as SelectOption).value })}
            isSearchable={false}
          />
          <AppSelect
            className="w-44"
            options={[{ value: 'all', label: 'All categories' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
            value={catFilter === 'all' ? { value: 'all', label: 'All categories' } : categories.find(c => c.id === catFilter) ? { value: catFilter, label: categories.find(c => c.id === catFilter)!.name } : null}
            onChange={opt => updateFilters({ catFilter: (opt as SelectOption | null)?.value ?? 'all' })}
            isSearchable={false}
          />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Revenue" value={formatINRFull(totalRev)} accent="#F97316" />
          <KpiCard label="Profit" value={formatINRFull(totalProfit)} accent="#10B981" />
          <KpiCard label="Avg order" value={formatINR(totalRev / Math.max(1, sales.length))} accent="#7C3AED" />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Order log</h3>
            <span className="text-xs text-zinc-400">most recent first</span>
          </div>
          <div className="overflow-x-auto">
            <div className="grid min-w-160 grid-cols-6 gap-2 border-b border-stone-100 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:border-zinc-800">
              <span>Date</span><span>Product</span><span>Qty</span>
              <span>Customer</span><span>Profit</span><span>Total</span>
            </div>
            {isLoading ? (
              <div className="py-12 text-center text-sm text-zinc-400">Loading…</div>
            ) : sales.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-400">No sales yet</div>
            ) : sales.map(s => (
              <div key={s.id} className="grid min-w-160 grid-cols-6 gap-2 border-b border-stone-50 px-5 py-3 text-sm last:border-0 hover:bg-stone-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30 transition-colors">
                <span className="text-zinc-400">{s.date.slice(5)}</span>
                <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">{s.productName}</span>
                <span className="text-zinc-600 dark:text-zinc-400">×{s.qty}</span>
                <span className="truncate text-zinc-500">{s.customer}</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formatINR(s.profit)}</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatINRFull(s.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && <RecordSaleModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
