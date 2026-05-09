import { cn } from '@/lib/cn'
import { Sparkline } from '@/components/charts'
import { Icon } from './Icon'

interface KpiCardProps {
  label: string
  value: string | number
  delta?: number | null
  accent?: string
  spark?: number[]
}

export function KpiCard({ label, value, delta, accent, spark }: KpiCardProps) {
  const positive = (delta ?? 0) >= 0
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
        {delta != null && (
          <span className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
            positive
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400'
          )}>
            <Icon name={positive ? 'arrowUp' : 'arrowDown'} size={10} />
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold" style={{ color: accent }}>{value}</div>
      {spark && <Sparkline data={spark} color={accent} />}
    </div>
  )
}
