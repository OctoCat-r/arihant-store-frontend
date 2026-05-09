import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { toast } from 'sonner'
import { kyClient, strip } from '@/lib/api'
import type { ApiResponse, ApiError } from '@/lib/api'
import { invalidateCategoriesQuery } from '@/hooks/queries'
import type { Category } from '@/types'

const updateCategory = async ({ id, ...data }: Category): Promise<Category> => {
  const response = await kyClient.patch(strip(`products/categories/${id}/`), { json: data })
  const result = await response.json<ApiResponse<Category>>()
  return result.data
}

const useUpdateCategoryMutation = (
  options?: UseMutationOptions<Category, HTTPError<ApiError>, Category>
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {}

  return useMutation<Category, HTTPError<ApiError>, Category>({
    mutationFn: updateCategory,
    onSuccess: (...args) => {
      invalidateCategoriesQuery()
      toast.success('Category updated')
      onSuccess?.(...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message || 'Failed to update category')
      onError?.(error, ...args)
    },
    ...restOptions,
  })
}

export default useUpdateCategoryMutation
