import { z } from 'zod'

const productOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  brand: z.string(),
  stock: z.number(),
  cost: z.number(),
  price: z.number(),
})

export type ProductOptionValue = z.infer<typeof productOptionSchema>

// Explicit interface so RHF resolver types align cleanly
export interface RecordSaleFormValues {
  product: ProductOptionValue | null
  qty: number
  sellingPrice: number
  customer?: string
}

export const recordSaleSchema = z.object({
  product: productOptionSchema.nullable(),

  qty: z
    .number({ error: 'Quantity is required' })
    .int('Must be a whole number')
    .min(1, 'Minimum quantity is 1'),

  sellingPrice: z
    .number({ error: 'Selling price is required' })
    .min(0, 'Cannot be negative')
    .max(1_000_000, 'Price seems too high'),

  customer: z
    .string()
    .max(120, 'Max 120 characters')
    .optional(),

}).superRefine((data, ctx) => {
  if (!data.product) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please select a product', path: ['product'] })
  }
  if (data.product && data.qty > data.product.stock) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Only ${data.product.stock} units in stock`, path: ['qty'] })
  }
})

export const recordSaleDefaultValues: RecordSaleFormValues = {
  product: null,
  qty: 1,
  sellingPrice: 0,
  customer: '',
}
