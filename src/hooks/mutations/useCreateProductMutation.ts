import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { toast } from 'sonner'
import { kyClient, strip } from '@/lib/api'
import type { ApiResponse, ApiError } from '@/lib/api'
import { invalidateProductsQuery } from '@/hooks/queries'
import type { Product } from '@/types'

const createProduct = async (product: Product): Promise<Product> => {
  const response = await kyClient.post(strip('products/create/'), { json: product })
  const result = await response.json<ApiResponse<Product>>()
  return result.data
}

const useCreateProductMutation = (
  options?: UseMutationOptions<Product, HTTPError<ApiError>, Product>
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {}

  return useMutation<Product, HTTPError<ApiError>, Product>({
    mutationFn: createProduct,
    onSuccess: (...args) => {
      invalidateProductsQuery()
      toast.success('Product created')
      onSuccess?.(...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message || 'Failed to create product')
      onError?.(error, ...args)
    },
    ...restOptions,
  })
}

export default useCreateProductMutation
