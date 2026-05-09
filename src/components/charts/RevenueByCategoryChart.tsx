import { PieChart, Pie, Tooltip, ResponsiveContainer, type PieProps } from 'recharts'
import { formatINR } from '@/lib/formatters'

export interface RevenueByCategoryEntry {
  name: string
  value: number
  fill: string
}

interface RevenueByCategoryChartProps {
  data: RevenueByCategoryEntry[]
  pieProps?: Partial<PieProps>
}

export function RevenueByCategoryChart({ data, pieProps }: RevenueByCategoryChartProps) {
  const sliced = data.slice(0, 6)

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={sliced}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={80}
            dataKey="value"
            strokeWidth={0}
            {...pieProps}
          />
          <Tooltip
            formatter={(value: unknown) => formatINR(Number(value))}
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 10, fontSize: 12 }}
            labelStyle={{ color: '#a1a1aa' }}
            itemStyle={{ color: '#f4f4f5' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2 min-w-0">
        {sliced.map(entry => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: entry.fill }} />
            <span className="flex-1 truncate text-xs text-zinc-700 dark:text-zinc-300">{entry.name}</span>
            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{formatINR(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
