import { cn } from '@/lib/cn'
import { formatINRFull } from '@/lib/formatters'
import { LineChart, AppSelect } from '@/components'
import { useProfitLossFilterStore } from '@/store'
import { useGetProfitLossQuery, useGetCategoriesQuery } from '@/hooks'

const RANGE_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
]

export function ProfitLoss() {
  const { filters, updateFilters } = useProfitLossFilterStore()
  const range = filters.range ?? '30'

  const { data: pl, isLoading } = useGetProfitLossQuery()
  const { data: categories = [] } = useGetCategoriesQuery()

  const totalRev = pl?.totalRevenue ?? 0
  const totalCost = pl?.totalCost ?? 0
  const totalProfit = pl?.totalProfit ?? 0
  const opex = pl?.opex ?? 0
  const netProfit = pl?.netProfit ?? 0
  const margin = pl?.margin ?? 0
  const days = pl?.days ?? []

  const byCat = (pl?.byCategory ?? []).map(d => ({
    cat: categories.find(c => c.id === d.category) ?? { id: d.category, name: d.category, icon: '📦', color: '#888' },
    rev: d.revenue,
    profit: d.profit,
  }))
  const maxRev = Math.max(...byCat.map(b => b.rev), 1)

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Profit & Loss</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Net {netProfit >= 0 ? 'profit' : 'loss'}:{' '}
            <strong className={netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
              {formatINRFull(netProfit)}
            </strong>
          </p>
        </div>
        <div>
          <AppSelect
            className="w-32"
            options={RANGE_OPTIONS}
            value={RANGE_OPTIONS.find(o => o.value === range) ?? null}
            onChange={opt => opt && updateFilters({ range: opt.value })}
            isSearchable={false}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">Loading…</div>
      ) : (
        <>
          <div className="rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col divide-y divide-stone-100 dark:divide-zinc-800">
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Gross revenue</span>
                <strong className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{formatINRFull(totalRev)}</strong>
              </div>
              <div className="flex items-center justify-between bg-red-50/50 px-5 py-3.5 dark:bg-red-900/5">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">− Cost of goods sold</span>
                <span className="text-sm font-medium text-red-500">−{formatINRFull(totalCost)}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Gross profit</span>
                <strong className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatINRFull(totalProfit)}</strong>
              </div>
              <div className="flex items-center justify-between bg-red-50/50 px-5 py-3.5 dark:bg-red-900/5">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">− Operating expenses (est.)</span>
                <span className="text-sm font-medium text-red-500">−{formatINRFull(opex)}</span>
              </div>
              <div className="flex items-center justify-between rounded-b-2xl bg-emerald-50/50 px-5 py-4 dark:bg-emerald-900/5">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Net profit</span>
                <strong className={cn('text-2xl font-bold', netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500')}>
                  {formatINRFull(netProfit)}
                </strong>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Profit margin</span>
                <strong className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{margin.toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 lg:p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Revenue, cost & profit trend</h3>
              <span className="text-xs text-zinc-400">{range} days</span>
            </div>
            <LineChart
              series={[
                { label: 'Revenue', data: days.map(d => d.revenue), color: '#F97316' },
                { label: 'Cost', data: days.map(d => d.cost), color: '#EF4444' },
                { label: 'Profit', data: days.map(d => d.profit), color: '#10B981' },
              ]}
              labels={days.map(d => d.date.slice(8))}
              height={260}
            />
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 lg:p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">By category</h3>
              <span className="text-xs text-zinc-400">profit contribution</span>
            </div>
            <div className="flex flex-col gap-3">
              {byCat.map(({ cat, rev, profit }) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className="flex w-36 shrink-0 items-center gap-2">
                    <span style={{ color: cat.color, fontSize: 18 }}>{cat.icon}</span>
                    <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">{cat.name}</span>
                  </div>
                  <div className="relative flex-1 h-4 rounded overflow-hidden bg-stone-100 dark:bg-zinc-800">
                    <div className="absolute inset-y-0 left-0 rounded transition-all duration-700"
                      style={{ width: `${(rev / maxRev) * 100}%`, background: cat.color }} />
                  </div>
                  <div className="w-20 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300">{formatINRFull(rev)}</div>
                  <div className="w-20 text-right text-xs font-medium text-emerald-600 dark:text-emerald-400">+{formatINRFull(profit)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
