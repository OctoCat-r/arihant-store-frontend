import { useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/nav'
import { Icon } from '@/components/ui'

interface MobileTopbarProps {
  lowStockCount: number
  onMenuOpen: () => void
}

export function MobileTopbar({ lowStockCount, onMenuOpen }: MobileTopbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const label = NAV_ITEMS.find(n => location.pathname === n.path || location.pathname.startsWith(n.path + '/') && n.path !== '/')?.label ?? 'Arihant Store'

  return (
    <div className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b border-stone-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
      <button
        className="inline-flex items-center justify-center rounded-md p-1.5 text-zinc-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        onClick={onMenuOpen}>
        <Icon name="menu" size={16} />
      </button>
      <div className="flex-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">{label}</div>
      <button
        className="relative inline-flex items-center justify-center rounded-md p-1.5 text-zinc-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        onClick={() => navigate('/alerts')}>
        <Icon name="bell" size={16} />
        {lowStockCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 text-[10px] font-bold text-red-500">{lowStockCount}</span>
        )}
      </button>
    </div>
  )
}
