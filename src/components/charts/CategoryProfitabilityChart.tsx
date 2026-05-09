import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { formatINR } from '@/lib/formatters'

export interface CategoryProfitabilityEntry {
  name: string
  revenue: number
  profit: number
}

interface CategoryProfitabilityChartProps {
  data: CategoryProfitabilityEntry[]
  height?: number
  chartProps?: Partial<React.ComponentProps<typeof BarChart>>
}

export function CategoryProfitabilityChart({ data, height = 220, chartProps }: CategoryProfitabilityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%" {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f4620" vertical={false} />
        <XAxis
          dataKey="name"
          interval={0}
          tick={{ fontSize: 11, fill: '#71717a' }}
          tickFormatter={(name: string) => name.length > 10 ? name.slice(0, 9) + '…' : name}
          axisLine={false}
          tickLine={false}
          angle={-30}
          textAnchor="end"
          height={52}
        />
        <YAxis tickFormatter={value => `₹${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} width={48} tickCount={8} />
        <Tooltip
          formatter={(value: unknown) => formatINR(Number(value))}
          contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 10, fontSize: 12 }}
          labelStyle={{ color: '#a1a1aa' }}
          itemStyle={{ color: '#f4f4f5' }}
          cursor={{ fill: '#ffffff08' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <ReferenceLine y={0} stroke="#3f3f46" />
        <Bar dataKey="revenue" name="Revenue" fill="#F97316" radius={[4, 4, 0, 0]} />
        <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
