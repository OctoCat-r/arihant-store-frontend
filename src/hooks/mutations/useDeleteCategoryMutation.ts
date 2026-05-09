import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { toast } from 'sonner'
import { kyClient, strip } from '@/lib/api'
import type { ApiError } from '@/lib/api'
import { invalidateCategoriesQuery } from '@/hooks/queries'

const deleteCategory = async (id: string): Promise<void> => {
  await kyClient.delete(strip(`products/categories/${id}/`)).json<void>()
}

const useDeleteCategoryMutation = (
  options?: UseMutationOptions<void, HTTPError<ApiError>, string>
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {}

  return useMutation<void, HTTPError<ApiError>, string>({
    mutationFn: deleteCategory,
    onSuccess: (...args) => {
      invalidateCategoriesQuery()
      toast.warning('Category deleted')
      onSuccess?.(...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message || 'Failed to delete category')
      onError?.(error, ...args)
    },
    ...restOptions,
  })
}

export default useDeleteCategoryMutation
