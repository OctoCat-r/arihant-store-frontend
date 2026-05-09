import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'
import { kyClient } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'

import type { ApiResponse } from '@/lib/api'
import { useProfitLossFilterStore } from '@/store'
import { createAPIParams } from '@/utils/common.utils'

export const PL_KEY = (qs = '') => ['analytics', 'pl', qs] as const

type PLQueryKey = ReturnType<typeof PL_KEY>

export interface ProfitLossData {
  totalRevenue: number
  totalCost: number
  totalProfit: number
  opex: number
  netProfit: number
  margin: number
  days: { date: string; revenue: number; cost: number; profit: number }[]
  byCategory: { category: string; revenue: number; profit: number }[]
}

export function useGetProfitLossQuery(
  options?: Omit<UseQueryOptions<ProfitLossData, Error, ProfitLossData, PLQueryKey>, 'queryKey' | 'queryFn'>
) {
  const { filters } = useProfitLossFilterStore(useShallow(s => ({ filters: s.filters })))

  const qs = createAPIParams({ range: filters.range ?? '30' })

  return useQuery({
    queryKey: PL_KEY(qs),
    queryFn: async ({ queryKey }) => {
      const response = await kyClient.get(`analytics/pl/?${queryKey[2]}`)
      const result = await response.json<ApiResponse<ProfitLossData>>()
      return result.data
    },
    ...options,
  })
}

export const invalidatePLQuery = () =>
  queryClient.invalidateQueries({ queryKey: ['analytics', 'pl'] })
