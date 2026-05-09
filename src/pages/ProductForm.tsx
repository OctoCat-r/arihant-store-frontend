import { cn } from "@/lib/cn";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@/types";
import {
  productFormDefaultValues,
  productFormSchema,
  type ProductFormValues,
} from "./ProductForm.schema";
import { COLORS_AVAILABLE, COMPATIBLE_MODELS } from "@/constants/colors";
import { formatINRFull } from "@/lib/formatters";
import { genId, today } from "@/lib/utils";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddBrandMutation,
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
} from "@/hooks";
import { Icon, Field, BrandCombo, ProductThumb, AppSelect } from "@/components";

interface ProductFormProps {
  isNew?: boolean;
}

const SectionMark = ({ n, label }: { n: string; label: string }) => (
  <div className="mb-4 flex items-center gap-2">
    <span
      className="font-[Fraunces,Georgia,serif] text-xs italic text-[var(--accent)] opacity-60"
      style={{ fontOpticalSizing: "auto" } as React.CSSProperties}
    >
      {n}
    </span>
    <div className="h-px flex-1 bg-stone-100 dark:bg-zinc-800" />
    <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
      {label}
    </span>
  </div>
);

export function ProductForm({ isNew = false }: ProductFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: brands = [] } = useGetBrandsQuery();
  const { data: productsResult } = useGetProductsQuery();
  const product = id
    ? (productsResult?.data ?? []).find((p) => p.id === id)
    : undefined;

  const { mutateAsync: createProduct } = useCreateProductMutation();
  const { mutateAsync: updateProduct } = useUpdateProductMutation();
  const { mutateAsync: deleteProduct } = useDeleteProductMutation();
  const { mutateAsync: addBrand } = useAddBrandMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: productFormDefaultValues,
  });

  useEffect(() => {
    if (product) reset({ ...product });
  }, [product?.id]);

  const formValues = watch();
  const cost = formValues.cost ?? 0;
  const price = formValues.price ?? 0;
  const stock = formValues.stock ?? 0;
  const alertAt = formValues.lowStockThreshold ?? 5;
  const profitMargin = price - cost;
  const profitMarginPercent = cost > 0 ? (profitMargin / price) * 100 : 0;
  const isProfit = profitMargin > 0;

  const stockPct = alertAt > 0 ? Math.min((stock / (alertAt * 6)) * 100, 100) : 0;
  const stockStatus =
    stock === 0
      ? { label: "Out of stock", bar: "bg-red-400", text: "text-red-500 dark:text-red-400" }
      : stock <= alertAt
        ? { label: "Low stock", bar: "bg-amber-400", text: "text-amber-600 dark:text-amber-400" }
        : { label: "In stock", bar: "bg-emerald-400", text: "text-emerald-600 dark:text-emerald-400" };

  const activeCat = categories.find((c) => c.id === formValues.category);

  const navigateBack = () => navigate("/inventory");

  const onSubmit = async (formData: ProductFormValues) => {
    const productPayload: Product = {
      id: product?.id ?? genId("p"),
      sold30d: product?.sold30d ?? 0,
      rating: product?.rating ?? 4,
      addedDate: product?.addedDate ?? today(),
      image: null,
      ...formData,
    };
    await (isNew ? createProduct(productPayload) : updateProduct(productPayload));
    navigateBack();
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    await deleteProduct(product.id);
    navigateBack();
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* ── Sticky page header ── */}
      <div className="sticky top-0 z-10 border-b border-stone-200/80 px-4 py-3 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-[#100f0d]/90 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={navigateBack}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-zinc-500 transition-colors hover:border-stone-300 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Icon name="chevron" size={14} className="rotate-180" />
            </button>
            <div>
              <h1 className="text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                {isNew ? "New product" : "Edit product"}
              </h1>
              {!isNew && product?.name && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500">{product.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isNew && (
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Icon name="trash" size={12} />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={navigateBack}
              className="flex h-8 items-center rounded-lg border border-stone-200 bg-white px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              className="flex h-8 items-center gap-1.5 rounded-lg bg-[#c4976a] px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Icon name="save" size={12} />
              {isNew ? "Add product" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4 lg:p-6">
        <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">

            {/* ── Main form card ── */}
            <div className="animate-fade-up overflow-hidden rounded-2xl bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">

              {/* 01 — Identity */}
              <div className="p-6">
                <SectionMark n="01" label="Identity" />
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Product name" error={errors.name?.message}>
                    <input {...register("name")} placeholder="e.g. Silicone Back Cover" />
                  </Field>
                  <Field label="Cost price (₹)" error={errors.cost?.message}>
                    <input
                      type="number"
                      {...register("cost", { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Selling price (₹)" error={errors.price?.message}>
                    <input
                      type="number"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </Field>
                </div>

                {/* Margin callout */}
                <div
                  className={cn(
                    "mt-4 flex items-center gap-4 overflow-hidden rounded-xl px-5 py-3.5 transition-colors",
                    isProfit
                      ? "bg-emerald-50 dark:bg-emerald-950/20"
                      : "bg-stone-100 dark:bg-zinc-800/60",
                  )}
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
                      Margin per unit
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 font-[Fraunces,Georgia,serif] text-2xl font-semibold leading-none",
                        isProfit
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-stone-400 dark:text-zinc-500",
                      )}
                      style={{ fontOpticalSizing: "auto" } as React.CSSProperties}
                    >
                      {formatINRFull(profitMargin)}
                    </p>
                  </div>
                  {cost > 0 && price > 0 && (
                    <>
                      <div className="h-8 w-px bg-stone-200 dark:bg-zinc-700" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
                          Margin %
                        </p>
                        <p
                          className={cn(
                            "mt-0.5 text-xl font-bold leading-none",
                            isProfit
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-500",
                          )}
                        >
                          {profitMarginPercent.toFixed(1)}
                          <span className="text-sm font-normal opacity-70">%</span>
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
                          Sell at
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                          {formatINRFull(price)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mx-6 border-t border-stone-100 dark:border-zinc-800" />

              {/* 02 — Classification */}
              <div className="p-6">
                <SectionMark n="02" label="Classification" />
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Brand" error={errors.brand?.message}>
                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <BrandCombo
                          value={field.value}
                          onChange={field.onChange}
                          options={brands}
                          onAddNew={addBrand}
                          placeholder="Search or add…"
                        />
                      )}
                    />
                  </Field>
                  <Field label="Category" error={errors.category?.message}>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <AppSelect
                          options={categories.map((c) => ({ value: c.id, label: c.name }))}
                          value={
                            categories.find((c) => c.id === field.value)
                              ? { value: field.value, label: categories.find((c) => c.id === field.value)!.name }
                              : null
                          }
                          onChange={(opt) => field.onChange(opt?.value ?? "")}
                          isSearchable={false}
                        />
                      )}
                    />
                  </Field>
                  <Field label="Color">
                    <Controller
                      name="color"
                      control={control}
                      render={({ field }) => (
                        <AppSelect
                          options={[
                            { value: "", label: "— None —" },
                            ...COLORS_AVAILABLE.map((c) => ({ value: c, label: c })),
                          ]}
                          value={{ value: field.value ?? "", label: field.value || "— None —" }}
                          onChange={(opt) => field.onChange(opt?.value ?? null)}
                          isSearchable={false}
                        />
                      )}
                    />
                  </Field>
                </div>
              </div>

              <div className="mx-6 border-t border-stone-100 dark:border-zinc-800" />

              {/* 03 — Inventory */}
              <div className="p-6">
                <SectionMark n="03" label="Inventory" />
                <div className="grid grid-cols-3 gap-4">
                  <Field label="SKU" error={errors.sku?.message}>
                    <input {...register("sku")} placeholder="ARI-XXX" />
                  </Field>
                  <Field label="Current stock" error={errors.stock?.message}>
                    <input
                      type="number"
                      {...register("stock", { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Low-stock alert at" error={errors.lowStockThreshold?.message}>
                    <input
                      type="number"
                      {...register("lowStockThreshold", { valueAsNumber: true })}
                      placeholder="5"
                    />
                  </Field>
                </div>
              </div>

              <div className="mx-6 border-t border-stone-100 dark:border-zinc-800" />

              {/* 04 — Compatibility */}
              <div className="p-6">
                <SectionMark n="04" label="Compatibility" />
                <Controller
                  name="compatibleWith"
                  control={control}
                  render={({ field }) => {
                    const selected = field.value ?? [];
                    return (
                      <div>
                        <div className="flex flex-wrap gap-1.5">
                          {COMPATIBLE_MODELS.map((model) => {
                            const active = selected.includes(model);
                            return (
                              <button
                                key={model}
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    active
                                      ? selected.filter((m) => m !== model)
                                      : [...selected, model],
                                  )
                                }
                                className={cn(
                                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                                  active
                                    ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm"
                                    : "border-stone-200 bg-white text-zinc-500 hover:border-[var(--accent)] hover:text-[var(--accent)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
                                )}
                              >
                                {model}
                              </button>
                            );
                          })}
                        </div>
                        {selected.length > 0 && (
                          <button
                            type="button"
                            onClick={() => field.onChange([])}
                            className="mt-3 text-[11px] text-stone-400 underline underline-offset-2 hover:text-stone-600 dark:hover:text-zinc-300"
                          >
                            Clear {selected.length} selected
                          </button>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="flex flex-col gap-4">

              {/* Preview card */}
              <div className="animate-fade-up delay-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {/* Tinted header */}
                <div
                  className="flex h-28 items-center justify-center transition-colors"
                  style={{
                    background: activeCat?.color
                      ? `linear-gradient(135deg, ${activeCat.color}22 0%, ${activeCat.color}11 100%)`
                      : "linear-gradient(135deg, #f5efe7 0%, #ede5d8 100%)",
                  }}
                >
                  <ProductThumb
                    product={{ name: formValues.name ?? "", category: formValues.category ?? "" }}
                    categories={categories}
                    size={64}
                  />
                </div>

                {/* Product info */}
                <div className="p-4 text-center">
                  <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                    {formValues.name || <span className="text-stone-300 dark:text-zinc-600">Product name</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {formValues.brand || "—"}
                    {activeCat && (
                      <>
                        {" · "}
                        <span style={{ color: activeCat.color }}>{activeCat.icon} {activeCat.name}</span>
                      </>
                    )}
                  </p>
                  <div className="mt-3 border-t border-stone-100 pt-3 dark:border-zinc-800">
                    <p
                      className="font-[Fraunces,Georgia,serif] text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
                      style={{ fontOpticalSizing: "auto" } as React.CSSProperties}
                    >
                      {formatINRFull(price)}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-400">
                      cost {formatINRFull(cost)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stock & margin stats */}
              <div className="animate-fade-up delay-3 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {/* Stock level bar */}
                <div className="px-4 pt-4 pb-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
                      Stock level
                    </span>
                    <span className={cn("text-[11px] font-semibold", stockStatus.text)}>
                      {stockStatus.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-zinc-800">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", stockStatus.bar)}
                      style={{ width: `${stockPct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[10px] text-stone-400 dark:text-zinc-500">
                    {stock} units · alert at {alertAt}
                  </p>
                </div>

                <div className="border-t border-stone-100 dark:border-zinc-800" />

                {/* Stat rows */}
                {[
                  { label: "Selling price", value: formatINRFull(price) },
                  { label: "Cost price", value: formatINRFull(cost) },
                  {
                    label: "Margin",
                    value: `${profitMarginPercent.toFixed(1)}%`,
                    valueClass: isProfit
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500",
                  },
                  { label: "SKU", value: formValues.sku || "—", valueClass: "font-mono text-[11px]" },
                ].map(({ label, value, valueClass }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-stone-50 px-4 py-2.5 last:border-0 dark:border-zinc-800/50"
                  >
                    <span className="text-xs text-zinc-500">{label}</span>
                    <span className={cn("text-xs font-semibold text-zinc-800 dark:text-zinc-200", valueClass)}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
