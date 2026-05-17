import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be under 100 characters"),

  category: z.string().min(1, "Please select a category"),

  brand: z
    .string()
    .min(1, "Brand is required")
    .max(50, "Brand must be under 50 characters"),

  compatibleWith: z.array(z.string()),

  cost: z
    .number({ error: "Cost must be a number" })
    .min(0, "Cost cannot be negative")
    .max(1_000_000, "Cost seems too high"),

  stock: z
    .number({ error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  lowStockThreshold: z
    .number({ error: "Threshold must be a number" })
    .int("Threshold must be a whole number")
    .min(1, "Threshold must be at least 1")
    .max(1000, "Threshold seems too high"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productFormDefaultValues: ProductFormValues = {
  name: "",
  category: "",
  brand: "",
  stock: 0,
  cost: 0,
  compatibleWith: [],
  lowStockThreshold: 5,
};
