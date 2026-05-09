import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { kyClient } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import type { ApiResponse } from '@/lib/api'

export const BRANDS_KEY = () => ['brands'] as const

type BrandsQueryKey = ReturnType<typeof BRANDS_KEY>

export function useGetBrandsQuery(
  options?: Omit<UseQueryOptions<string[], Error, string[], BrandsQueryKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: BRANDS_KEY(),
    queryFn: async () => {
      const response = await kyClient.get('products/brands/')
      const result = await response.json<ApiResponse<string[]>>()
      return result.data
    },
    staleTime: Infinity,
    ...options,
  })
}

export const invalidateBrandsQuery = () =>
  queryClient.invalidateQueries({ queryKey: BRANDS_KEY() })
