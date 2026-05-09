import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui'

interface FilterSectionProps {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
  count?: number
}

export function FilterSection({ title, open, onToggle, children, count }: FilterSectionProps) {
  return (
    <div className="border-b border-stone-100 dark:border-zinc-800">
      <button
        className="flex w-full items-center justify-between px-1 py-2.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
        onClick={onToggle}>
        <span className="flex items-center gap-1.5">
          {title}
          {(count ?? 0) > 0 && (
            <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </span>
        <Icon name="chevDown" size={14} className={cn('transition-transform', open ? '' : '-rotate-90')} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}
