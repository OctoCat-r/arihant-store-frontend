import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/cn'
import { kyClient } from '@/lib/api'
import { formatINR } from '@/lib/formatters'
import type { ApiPaginated } from '@/lib/api'
import type { Sale } from '@/types'

type Range = '1d' | '7d' | '30d' | '6m'

const RANGES: { key: Range; label: string; days: number }[] = [
  { key: '1d', label: 'Day',     days: 2   },
  { key: '7d', label: 'Week',    days: 7   },
  { key: '30d', label: 'Month',  days: 30  },
  { key: '6m',  label: '6 Mo',  days: 180 },
]

interface Point { date: string; revenue: number; profit: number; units: number }

function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  return d.toISOString().slice(0, 10)
}

function buildPoints(sales: Sale[], range: Range): Point[] {
  const map = new Map<string, Point>()

  for (const s of sales) {
    const key = range === '6m' ? getWeekStart(s.date) : s.date
    const prev = map.get(key) ?? { date: key, revenue: 0, profit: 0, units: 0 }
    map.set(key, {
      date: key,
      revenue: prev.revenue + s.revenue,
      profit:  prev.profit  + s.profit,
      units:   prev.units   + s.qty,
    })
  }

  const today = new Date()
  const points: Point[] = []

  if (range === '6m') {
    const seen = new Set<string>()
    for (let i = 25; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i * 7)
      const key = getWeekStart(d.toISOString().slice(0, 10))
      if (!seen.has(key)) {
        seen.add(key)
        points.push(map.get(key) ?? { date: key, revenue: 0, profit: 0, units: 0 })
      }
    }
    return points
  }

  const days = RANGES.find(r => r.key === range)!.days
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    points.push(map.get(key) ?? { date: key, revenue: 0, profit: 0, units: 0 })
  }
  return points
}

function xLabel(date: string, range: Range): string {
  const d = new Date(date + 'T00:00:00')
  if (range === '7d')  return d.toLocaleDateString('en-US', { weekday: 'short' })
  if (range === '30d') return String(d.getDate())
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function yLabel(v: number): string {
  return v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
}

export function SalesChart() {
  const [range, setRange] = useState<Range>('30d')
  const days = RANGES.find(r => r.key === range)!.days

  const { data, isLoading } = useQuery({
    queryKey: ['sales-chart', range],
    queryFn: async () => {
      const res  = await kyClient.get(`sales/?range=${days}&page_size=1000`)
      const json = await res.json<ApiPaginated<Sale>>()
      return json.data
    },
    staleTime: 60_000,
  })

  const chartData = useMemo(() => buildPoints(data ?? [], range), [data, range])

  const totalRevenue = chartData.reduce((s, p) => s + p.revenue, 0)
  const totalUnits   = chartData.reduce((s, p) => s + p.units,   0)

  const xInterval = range === '30d' ? 4 : range === '6m' ? 3 : 0

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sales</h3>
          {!isLoading && (
            <p className="mt-0.5 text-xs text-zinc-400">
              {formatINR(totalRevenue)} · {totalUnits} units
            </p>
          )}
        </div>

        <div className="flex rounded-lg border border-stone-200 p-0.5 dark:border-zinc-700">
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                range === r.key
                  ? 'bg-stone-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[220px] items-center justify-center">
          <span className="text-xs text-zinc-400">Loading…</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="scGradRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#F97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="scGradPro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f4620" />

            <XAxis
              dataKey="date"
              tickFormatter={d => xLabel(d, range)}
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              axisLine={false}
              tickLine={false}
              interval={xInterval}
            />
            <YAxis
              tickFormatter={yLabel}
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              axisLine={false}
              tickLine={false}
              width={46}
            />

            <Tooltip
              formatter={(val: unknown, name: unknown) => [formatINR(Number(val)), String(name)]}
              labelFormatter={d => xLabel(String(d), range)}
              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: '#a1a1aa' }}
              itemStyle={{ color: '#f4f4f5' }}
            />

            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#F97316" strokeWidth={2} fill="url(#scGradRev)" dot={false} />
            <Area type="monotone" dataKey="profit"  name="Profit"  stroke="#10B981" strokeWidth={2} fill="url(#scGradPro)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <div className="mt-2 flex gap-4 px-1">
        {[{ color: '#F97316', label: 'Revenue' }, { color: '#10B981', label: 'Profit' }].map(s => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </>
  )
}
