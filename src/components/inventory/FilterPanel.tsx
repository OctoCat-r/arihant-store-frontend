import { cn } from "@/lib/cn";
import { useState } from "react";
import { useInventoryFilterStore } from "@/store";
import { useGetBrandsQuery } from "@/hooks/queries";
import { COLORS_AVAILABLE, COMPATIBLE_MODELS } from "@/constants/colors";
import { colorHex } from "@/lib/utils";
import { FilterSection } from "./FilterSection";

const STOCK_OPTIONS = [
  ["all", "All"],
  ["inStock", "In stock"],
  ["low", "Low"],
  ["out", "Out"],
] as const;

export function FilterPanel() {
  const { filters, updateFilters, toggleArrayFilter } =
    useInventoryFilterStore();

  const {
    brands: selectedBrands,
    colors: selectedColors,
    compat: selectedModels,
    stock: stockFilter,
    priceMin,
    priceMax,
  } = filters ?? {};

  const { data: availableBrands = [] } = useGetBrandsQuery();

  const [sectionsOpen, setSectionsOpen] = useState({
    stock: true,
    brand: true,
    color: true,
    compat: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof sectionsOpen) =>
    setSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }));

  return (
    <div className="flex flex-col">
      <FilterSection
        title="Stock status"
        open={sectionsOpen.stock}
        onToggle={() => toggleSection("stock")}
      >
        <div className="flex rounded-lg border border-stone-200 dark:border-zinc-700 overflow-hidden text-xs">
          {STOCK_OPTIONS.map(([value, label]) => (
            <button
              key={value}
              className={cn(
                "flex-1 py-1.5 font-medium transition-colors px-1",
                stockFilter === value
                  ? "bg-[#c4976a] text-white"
                  : "bg-white text-zinc-600 hover:bg-stone-50 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800",
              )}
              onClick={() => updateFilters({ stock: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Brand"
        open={sectionsOpen.brand}
        onToggle={() => toggleSection("brand")}
        count={selectedBrands?.length}
      >
        <div className="flex flex-wrap gap-1.5">
          {availableBrands.map((brand) => (
            <label
              key={brand}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                selectedBrands?.includes(brand)
                  ? "border-(--accent) bg-(--accent-soft) text-(--accent)"
                  : "border-stone-200 bg-white text-zinc-600 hover:border-stone-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedBrands?.includes(brand)}
                onChange={() => toggleArrayFilter("brands", brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Color"
        open={sectionsOpen.color}
        onToggle={() => toggleSection("color")}
        count={selectedColors?.length}
      >
        <div className="flex flex-wrap gap-1.5">
          {COLORS_AVAILABLE.map((color) => (
            <button
              key={color}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                selectedColors?.includes(color)
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-stone-200 bg-white text-zinc-600 hover:border-stone-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
              )}
              onClick={() => toggleArrayFilter("colors", color)}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: colorHex(color) }}
              />
              {color}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Compatible with"
        open={sectionsOpen.compat}
        onToggle={() => toggleSection("compat")}
        count={selectedModels?.length}
      >
        <div className="flex flex-wrap gap-1.5">
          {COMPATIBLE_MODELS.map((model) => (
            <label
              key={model}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                selectedModels?.includes(model)
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-stone-200 bg-white text-zinc-600 hover:border-stone-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedModels?.includes(model)}
                onChange={() => toggleArrayFilter("compat", model)}
              />
              {model}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Price range"
        open={sectionsOpen.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
              ₹
            </span>
            <input
              type="number"
              placeholder="Min"
              value={priceMin!}
              onChange={(e) => updateFilters({ priceMin: e.target.value })}
              className="!pl-6"
            />
          </div>
          <span className="text-zinc-400">—</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
              ₹
            </span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax!}
              onChange={(e) => updateFilters({ priceMax: e.target.value })}
              className="!pl-6"
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );
}
