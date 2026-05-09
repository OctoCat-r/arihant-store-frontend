import type { NavItem } from '@/types'

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',  label: 'Dashboard',     icon: 'dashboard',  path: '/'           },
  { id: 'inventory',  label: 'Inventory',      icon: 'inventory',  path: '/inventory'  },
  // { id: 'sales',      label: 'Sales & Orders', icon: 'sales',      path: '/sales'      },
  { id: 'pl',         label: 'Profit & Loss',  icon: 'pl',         path: '/pl'         },
  { id: 'categories', label: 'Categories',     icon: 'categories', path: '/categories' },
  { id: 'alerts',     label: 'Alerts',         icon: 'alerts',     path: '/alerts'     },
]
