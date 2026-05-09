import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

export interface TopSellerEntry {
  name: string
  sold: number
  fill: string
}

interface TopSellersChartProps {
  data: TopSellerEntry[]
  chartProps?: Partial<React.ComponentProps<typeof BarChart>>
}

export function TopSellersChart({ data, chartProps }: TopSellersChartProps) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 36 + 20, 160)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }} {...chartProps}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value: unknown) => [`${value} sold`, 'Units']}
          contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 10, fontSize: 12 }}
          labelStyle={{ color: '#a1a1aa' }}
          itemStyle={{ color: '#f4f4f5' }}
          cursor={{ fill: '#ffffff08' }}
        />
        <Bar dataKey="sold" radius={[0, 4, 4, 0]}>
          <LabelList dataKey="sold" position="right" style={{ fontSize: 11, fill: '#a1a1aa' }} formatter={(v: unknown) => `${v}`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
