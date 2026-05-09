import { cn } from '@/lib/cn'

type BadgeColor = 'purple' | 'green' | 'blue' | 'gray'

interface BadgeProps {
  children: React.ReactNode
  color?: BadgeColor
}

const colorMap: Record<BadgeColor, string> = {
  purple: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  blue: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  gray: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', colorMap[color])}>
      {children}
    </span>
  )
}
