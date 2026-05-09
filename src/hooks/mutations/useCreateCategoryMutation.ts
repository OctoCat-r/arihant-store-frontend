import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { toast } from 'sonner'
import { kyClient, strip } from '@/lib/api'
import type { ApiResponse, ApiError } from '@/lib/api'
import { invalidateCategoriesQuery } from '@/hooks/queries'
import type { Category } from '@/types'

const createCategory = async (cat: Category): Promise<Category> => {
  const response = await kyClient.post(strip('products/categories/create/'), { json: cat })
  const result = await response.json<ApiResponse<Category>>()
  return result.data
}

const useCreateCategoryMutation = (
  options?: UseMutationOptions<Category, HTTPError<ApiError>, Category>
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {}

  return useMutation<Category, HTTPError<ApiError>, Category>({
    mutationFn: createCategory,
    onSuccess: (...args) => {
      invalidateCategoriesQuery()
      toast.success('Category created')
      onSuccess?.(...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message || 'Failed to create category')
      onError?.(error, ...args)
    },
    ...restOptions,
  })
}

export default useCreateCategoryMutation
