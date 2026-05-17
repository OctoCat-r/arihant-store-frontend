import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { toast } from 'sonner'
import { kyClient, strip } from '@/lib/api'
import type { ApiResponse, ApiError } from '@/lib/api'
import { invalidateSalesQuery } from '@/hooks/queries/useGetSalesQuery'
import { invalidateProductsQuery } from '@/hooks/queries/useGetProductsQuery'
import type { Sale } from '@/types'

export interface CreateSaleInput {
  productId: string
  qty: number
  sellingPrice: number
  customer: string
}

const createSale = async (data: CreateSaleInput): Promise<Sale> => {
  const response = await kyClient.post(strip('sales/create/'), { json: data })
  const result = await response.json<ApiResponse<Sale>>()
  return result.data
}

const useCreateSaleMutation = (
  options?: UseMutationOptions<Sale, HTTPError<ApiError>, CreateSaleInput>
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {}

  return useMutation<Sale, HTTPError<ApiError>, CreateSaleInput>({
    mutationFn: createSale,
    onSuccess: (...args) => {
      invalidateSalesQuery()
      invalidateProductsQuery()
      toast.success('Sale recorded')
      onSuccess?.(...args)
    },
    onError: async (error, ...args) => {
      const body = await error.response?.json<ApiError>().catch(() => null)
      toast.error(body?.error || 'Failed to record sale')
      onError?.(error, ...args)
    },
    ...restOptions,
  })
}

export default useCreateSaleMutation
