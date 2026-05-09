import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { toast } from 'sonner'
import { kyClient, strip } from '@/lib/api'
import type { ApiResponse, ApiError } from '@/lib/api'
import { invalidateProductsQuery } from '@/hooks/queries'
import type { Product } from '@/types'

type UpdateProductInput = Partial<Product> & { id: string; delta?: number }

const updateProduct = async ({ id, ...data }: UpdateProductInput): Promise<Product> => {
  const response = await kyClient.patch(strip(`products/${id}/`), { json: data })
  const result = await response.json<ApiResponse<Product>>()
  return result.data
}

const useUpdateProductMutation = (
  options?: UseMutationOptions<Product, HTTPError<ApiError>, UpdateProductInput>
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {}

  return useMutation<Product, HTTPError<ApiError>, UpdateProductInput>({
    mutationFn: updateProduct,
    onSuccess: (...args) => {
      invalidateProductsQuery()
      toast.success('Product updated')
      onSuccess?.(...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message || 'Failed to update product')
      onError?.(error, ...args)
    },
    ...restOptions,
  })
}

export default useUpdateProductMutation
