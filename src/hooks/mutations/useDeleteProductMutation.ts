import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { toast } from 'sonner'
import { kyClient, strip } from '@/lib/api'
import type { ApiError } from '@/lib/api'
import { invalidateProductsQuery } from '@/hooks/queries'

const deleteProduct = async (id: string): Promise<void> => {
  await kyClient.delete(strip(`products/${id}/`)).json<void>()
}

const useDeleteProductMutation = (
  options?: UseMutationOptions<void, HTTPError<ApiError>, string>
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {}

  return useMutation<void, HTTPError<ApiError>, string>({
    mutationFn: deleteProduct,
    onSuccess: (...args) => {
      invalidateProductsQuery()
      toast.warning('Product deleted')
      onSuccess?.(...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message || 'Failed to delete product')
      onError?.(error, ...args)
    },
    ...restOptions,
  })
}

export default useDeleteProductMutation
