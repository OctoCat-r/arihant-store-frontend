import type { Category } from '@/types'
import type { DashboardData } from '@/hooks/queries/useGetDashboardQuery'
import type { TopSellerEntry } from '@/components/charts/TopSellersChart'
import type { CategoryProfitabilityEntry } from '@/components/charts/CategoryProfitabilityChart'

const FALLBACK_COLOR = '#888'

export function buildCategoryProfitabilityData(
  dashboardData: DashboardData | undefined,
  categories: Category[],
): CategoryProfitabilityEntry[] {
  return (dashboardData?.byCategory ?? [])
    .filter(entry => entry.revenue > 0)
    .map(entry => ({
      name: categories.find(c => c.id === entry.category)?.name ?? entry.category,
      revenue: entry.revenue,
      profit: entry.profit,
    }))
}

export function buildTopSellingProductsData(
  dashboardData: DashboardData | undefined,
  categories: Category[],
): TopSellerEntry[] {
  return (dashboardData?.topSellers ?? []).map(product => ({
    name: product.name.length > 24 ? product.name.slice(0, 22) + '…' : product.name,
    sold: product.sold30d,
    fill: categories.find(c => c.id === product.category)?.color ?? FALLBACK_COLOR,
  }))
}
