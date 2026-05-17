import { useQueryClient } from '@tanstack/react-query'
import { kyClient } from '@/lib/api'
import type { ApiResponse } from '@/lib/api'

export interface ProductSearchResult {
  id: string
  name: string
  brand: string
  stock: number
  cost: number
  price: number
}

export const PRODUCT_SEARCH_KEY = (q: string) => ['products', 'search', q] as const

const fetchProductSearch = async (q: string): Promise<ProductSearchResult[]> => {
  const response = await kyClient.get(`products/search/?q=${encodeURIComponent(q)}`)
  const result = await response.json<ApiResponse<ProductSearchResult[]>>()
  return result.data
}

export function useProductSearchFetcher() {
  const queryClient = useQueryClient()

  return async (q: string): Promise<ProductSearchResult[]> => {
    return queryClient.fetchQuery({
      queryKey: PRODUCT_SEARCH_KEY(q),
      queryFn: () => fetchProductSearch(q),
      staleTime: 30_000,
    })
  }
}
