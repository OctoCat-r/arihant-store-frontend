import { cn } from '@/lib/cn'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/colors'
import { formatINR } from '@/lib/formatters'
import { genId } from '@/lib/utils'
import { useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useGetProductsQuery } from '@/hooks'
import { toast } from 'sonner'
import { Icon, Field } from '@/components'

interface FormValues {
  name: string
  icon: string
  color: string
}

export function CategoriesScreen() {
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: productsResult } = useGetProductsQuery()
  const products = productsResult?.data ?? []

  const [editingId, setEditingId] = useState<string | null>(null)

  const { mutateAsync: createCategory } = useCreateCategoryMutation()
  const { mutateAsync: updateCategory } = useUpdateCategoryMutation()
  const { mutateAsync: deleteCategory } = useDeleteCategoryMutation()

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { name: '', icon: '◰', color: '#F97316' },
  })

  const preview = watch()

  const onSubmit = async (data: FormValues) => {
    if (editingId) {
      await updateCategory({ id: editingId, ...data })
      setEditingId(null)
    } else {
      await createCategory({ id: genId('cat'), ...data })
    }
    reset({ name: '', icon: '◰', color: '#F97316' })
  }

  const startEdit = (c: typeof categories[number]) => {
    setEditingId(c.id)
    reset({ name: c.name, icon: c.icon, color: c.color })
  }

  const cancelEdit = () => {
    setEditingId(null)
    reset({ name: '', icon: '◰', color: '#F97316' })
  }

  const remove = async (id: string) => {
    const count = products.filter(p => p.category === id).length
    if (count > 0) return toast.error(`Cannot delete — ${count} products still use this`)
    await deleteCategory(id)
  }

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Categories</h1>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Organize products into groups</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Form card */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {editingId ? 'Edit category' : 'New category'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field label="Name" error={errors.name?.message}>
              <input {...register('name', { required: 'Name is required' })} placeholder="e.g. Tablets" />
            </Field>

            <Field label="Icon">
              <Controller name="icon" control={control} render={({ field }) => (
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_ICONS.map(i => (
                    <button type="button" key={i}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-colors',
                        field.value === i
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-stone-200 bg-white hover:border-stone-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600'
                      )}
                      onClick={() => field.onChange(i)}>{i}</button>
                  ))}
                </div>
              )} />
            </Field>

            <Field label="Color">
              <Controller name="color" control={control} render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map(c => (
                    <button type="button" key={c}
                      className={cn(
                        'h-7 w-7 rounded-full border-2 transition-transform',
                        field.value === c ? 'scale-110 border-zinc-900 dark:border-zinc-100' : 'border-transparent'
                      )}
                      style={{ background: c }}
                      onClick={() => field.onChange(c)} />
                  ))}
                </div>
              )} />
            </Field>

            <div className="flex items-center justify-center rounded-xl border-2 border-dashed p-4"
              style={{ borderColor: `${preview.color}44`, background: `${preview.color}0d` }}>
              <div className="flex flex-col items-center gap-2">
                <span style={{ color: preview.color, fontSize: 32 }}>{preview.icon}</span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{preview.name || 'Preview'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {editingId && (
                <button type="button"
                  className="flex-1 rounded-lg border border-stone-200 py-2.5 text-sm font-medium text-zinc-600 hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                  onClick={cancelEdit}>
                  Cancel
                </button>
              )}
              <button type="submit"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                {editingId ? 'Save changes' : 'Add category'}
              </button>
            </div>
          </form>
        </div>

        {/* List card */}
        <div className="rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">All categories</h3>
            <span className="text-xs text-zinc-400">{categories.length} total</span>
          </div>
          <div className="flex flex-col divide-y divide-stone-50 dark:divide-zinc-800/50">
            {categories.map(c => {
              const count = products.filter(p => p.category === c.id).length
              const value = products.filter(p => p.category === c.id).reduce((a, p) => a + p.stock * p.cost, 0)
              return (
                <div key={c.id}
                  className={cn(
                    'flex items-center gap-3 border-l-4 px-5 py-3 transition-colors',
                    editingId === c.id && 'bg-[var(--accent-soft)]'
                  )}
                  style={{ borderLeftColor: c.color }}>
                  <span style={{ color: c.color, fontSize: 24 }}>{c.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{c.name}</div>
                    <div className="text-xs text-zinc-400">{count} products · {formatINR(value)} value</div>
                  </div>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-stone-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
                    onClick={() => startEdit(c)}>
                    <Icon name="edit" size={13} />
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                    onClick={() => remove(c.id)}>
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
