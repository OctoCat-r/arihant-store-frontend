import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { kyClient } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import type { ApiResponse } from '@/lib/api'
import type { Category } from '@/types'

export const CATEGORIES_KEY = () => ['categories'] as const

type CategoriesQueryKey = ReturnType<typeof CATEGORIES_KEY>

export function useGetCategoriesQuery(
  options?: Omit<UseQueryOptions<Category[], Error, Category[], CategoriesQueryKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: CATEGORIES_KEY(),
    queryFn: async () => {
      const response = await kyClient.get('products/categories/')
      const result = await response.json<ApiResponse<Category[]>>()
      return result.data
    },
    staleTime: Infinity,
    ...options,
  })
}

export const invalidateCategoriesQuery = () =>
  queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY() })
