import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { invalidateProductsQuery } from '@/hooks/queries'
import type { Product } from '@/types'

const reorderProducts = async (products: Product[]): Promise<Product[]> => products

const useReorderProductsMutation = (
  options?: UseMutationOptions<Product[], never, Product[]>
) => {
  const { onSuccess, ...restOptions } = options ?? {}

  return useMutation<Product[], never, Product[]>({
    mutationFn: reorderProducts,
    onSuccess: (...args) => {
      invalidateProductsQuery()
      onSuccess?.(...args)
    },
    ...restOptions,
  })
}

export default useReorderProductsMutation
