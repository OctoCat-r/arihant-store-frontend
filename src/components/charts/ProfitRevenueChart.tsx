import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatINR } from '@/lib/formatters'

export interface ProfitRevenueEntry {
  date: string
  revenue: number
  profit: number
}

interface ProfitRevenueChartProps {
  data: ProfitRevenueEntry[]
  height?: number
  chartProps?: Partial<React.ComponentProps<typeof AreaChart>>
}

export function ProfitRevenueChart({ data, height = 220, chartProps }: ProfitRevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} {...chartProps}>
        <defs>
          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f4620" />
        <XAxis dataKey="date" tickFormatter={date => date.slice(8)} tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={value => `₹${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} width={48} />
        <Tooltip
          formatter={(value: unknown) => formatINR(Number(value))}
          contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 10, fontSize: 12 }}
          labelStyle={{ color: '#a1a1aa' }}
          itemStyle={{ color: '#f4f4f5' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#F97316" strokeWidth={2} fill="url(#gradRevenue)" dot={false} />
        <Area type="monotone" dataKey="profit" name="Profit" stroke="#10B981" strokeWidth={2} fill="url(#gradProfit)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
