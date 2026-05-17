import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'
import { AsyncProductSelect } from '@/components/ui/AsyncProductSelect'
import useCreateSaleMutation from '@/hooks/mutations/useCreateSaleMutation'
import { recordSaleSchema, recordSaleDefaultValues } from './RecordSaleModal.schema'
import type { RecordSaleFormValues } from './RecordSaleModal.schema'

interface RecordSaleModalProps {
  onClose: () => void
}

export function RecordSaleModal({ onClose }: RecordSaleModalProps) {
  const { mutate: createSale, isPending } = useCreateSaleMutation({
    onSuccess: () => onClose(),
  })

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<RecordSaleFormValues>({
      resolver: zodResolver(recordSaleSchema) as Resolver<RecordSaleFormValues>,
      defaultValues: recordSaleDefaultValues as RecordSaleFormValues,
    })

  const selectedProduct = useWatch({ control, name: 'product' })
  useEffect(() => {
    if (selectedProduct) {
      setValue('sellingPrice', selectedProduct.price)
    }
  }, [selectedProduct, setValue])

  const onSubmit = (values: RecordSaleFormValues) => {
    if (!values.product) return
    createSale({
      productId: values.product.value,
      qty: values.qty,
      sellingPrice: values.sellingPrice,
      customer: values.customer?.trim() || 'Walk-in',
    })
  }

  const qty = watch('qty')
  const stockAfter = selectedProduct ? Math.max(0, selectedProduct.stock - Number(qty || 0)) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Record Sale</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-stone-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5">
          {/* Product */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Product *</label>
            <AsyncProductSelect
              control={control}
              name="product"
              placeholder="Search product…"
            />
            {errors.product && (
              <span className="text-xs text-red-500">{errors.product.message as string}</span>
            )}
          </div>

          {/* Qty + Remaining Quantity row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Quantity *</label>
              <input
                type="number"
                min={1}
                {...register('qty', { valueAsNumber: true })}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--accent) focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              {errors.qty && <span className="text-xs text-red-500">{errors.qty.message}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Remaining Quantity</label>
              <input
                readOnly
                value={selectedProduct ? `${selectedProduct.stock} units` : '—'}
                className="cursor-not-allowed rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500"
              />
            </div>
          </div>

          {/* Cost price + Selling price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Cost Price</label>
              <input
                readOnly
                value={selectedProduct ? `₹${selectedProduct.cost}` : '—'}
                className="cursor-not-allowed rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Selling Price *</label>
              <input
                type="number"
                min={0}
                {...register('sellingPrice', { valueAsNumber: true })}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--accent) focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              {errors.sellingPrice && <span className="text-xs text-red-500">{errors.sellingPrice.message}</span>}
            </div>
          </div>

          {/* Stock remaining */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Stock After Sale</label>
            <input
              readOnly
              value={stockAfter !== null ? `${stockAfter} units` : '—'}
              className="cursor-not-allowed rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500"
            />
          </div>

          {/* Customer name (optional) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Customer Name</label>
            <input
              type="text"
              placeholder="Walk-in (optional)"
              {...register('customer')}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-(--accent) focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            {errors.customer && <span className="text-xs text-red-500">{errors.customer.message}</span>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-stone-200 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-(--accent) py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? 'Saving…' : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
