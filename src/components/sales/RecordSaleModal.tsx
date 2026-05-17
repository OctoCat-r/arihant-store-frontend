import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { AppSelect } from '@/components/ui/AppSelect'
import { AsyncProductSelect } from '@/components/ui/AsyncProductSelect'
import type { ProductOption } from '@/components/ui/AsyncProductSelect'
import useCreateSaleMutation from '@/hooks/mutations/useCreateSaleMutation'
import type { SelectOption } from '@/components/ui/AppSelect'

const PM_OPTIONS: SelectOption[] = [
  { value: 'UPI', label: 'UPI' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Card', label: 'Card' },
]

interface SaleFormValues {
  product: ProductOption | null
  qty: number
  sellingPrice: number
  customer: string
  paymentMethod: SelectOption
}

interface RecordSaleModalProps {
  onClose: () => void
}

export function RecordSaleModal({ onClose }: RecordSaleModalProps) {
  const { mutate: createSale, isPending } = useCreateSaleMutation({
    onSuccess: () => onClose(),
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SaleFormValues>({
    defaultValues: {
      product: null,
      qty: 1,
      sellingPrice: 0,
      customer: '',
      paymentMethod: PM_OPTIONS[0],
    },
  })

  const selectedProduct = useWatch({ control, name: 'product' })
  const qty = watch('qty')

  // Auto-fill cost + selling price + stock when product changes
  useEffect(() => {
    if (selectedProduct) {
      setValue('sellingPrice', selectedProduct.price)
    }
  }, [selectedProduct, setValue])

  const onSubmit = (values: SaleFormValues) => {
    if (!values.product) return
    createSale({
      productId: values.product.value,
      qty: Number(values.qty),
      sellingPrice: Number(values.sellingPrice),
      customer: values.customer.trim() || 'Walk-in',
      paymentMethod: values.paymentMethod.value as 'UPI' | 'Cash' | 'Card',
    })
  }

  const stockRemaining = selectedProduct ? Math.max(0, selectedProduct.stock - Number(qty || 0)) : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5">
          {/* Product search */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Product *</label>
            <AsyncProductSelect
              control={control}
              name="product"
              rules={{ required: 'Select a product' }}
              placeholder="Search product…"
            />
            {errors.product && (
              <span className="text-xs text-red-500">{errors.product.message as string}</span>
            )}
          </div>

          {/* Qty */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Quantity *</label>
            <input
              type="number"
              min={1}
              max={selectedProduct?.stock ?? undefined}
              {...register('qty', {
                required: 'Quantity is required',
                min: { value: 1, message: 'Min 1' },
                validate: (v) =>
                  !selectedProduct || Number(v) <= selectedProduct.stock || `Max stock: ${selectedProduct.stock}`,
              })}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            {errors.qty && <span className="text-xs text-red-500">{errors.qty.message}</span>}
          </div>

          {/* Cost price + Selling price row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Cost Price</label>
              <input
                readOnly
                value={selectedProduct ? `₹${selectedProduct.cost}` : '—'}
                className="rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Selling Price *</label>
              <input
                type="number"
                min={0}
                {...register('sellingPrice', {
                  required: 'Required',
                  min: { value: 0, message: 'Min 0' },
                })}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              {errors.sellingPrice && <span className="text-xs text-red-500">{errors.sellingPrice.message}</span>}
            </div>
          </div>

          {/* Stock remaining */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Stock Remaining After Sale</label>
            <input
              readOnly
              value={selectedProduct ? `${stockRemaining} units` : '—'}
              className="rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed"
            />
          </div>

          {/* Customer name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Customer Name</label>
            <input
              type="text"
              placeholder="Walk-in"
              {...register('customer')}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          {/* Payment method */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Payment Method</label>
            <AppSelect
              options={PM_OPTIONS}
              value={watch('paymentMethod')}
              onChange={(opt) => opt && setValue('paymentMethod', opt as SelectOption)}
              isSearchable={false}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-stone-200 py-2 text-sm font-medium text-zinc-600 hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-(--accent) py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {isPending ? 'Saving…' : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
