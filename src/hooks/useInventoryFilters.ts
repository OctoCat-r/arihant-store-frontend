import { useMemo } from "react";
import type { ActiveChip } from "@/types";
import { useInventoryFilterStore } from "@/store";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/hooks/queries";

export function useInventoryFilters() {
  const { data: categories = [] } = useGetCategoriesQuery();
  const {
    filters,
    sortBy,
    updateFilters,
    resetFilters,
    toggleArrayFilter,
    applySaved,
    updateSorting,
  } = useInventoryFilterStore();

  const setField = (key: string, value: unknown) => {
    if (key === "sort") {
      updateSorting(
        value as ReturnType<typeof useInventoryFilterStore.getState>["sortBy"],
      );
    } else {
      updateFilters({ [key]: value });
    }
  };

  const toggle = (field: "brands" | "colors" | "compat", val: string) =>
    toggleArrayFilter(field, val);

  const clearAll = resetFilters;

  const normalizedFilters = {
    searchQuery: filters.searchQuery ?? "",
    activeCat: filters.activeCat ?? "all",
    brands: filters.brands ?? [],
    colors: filters.colors ?? [],
    compat: filters.compat ?? [],
    stock: filters.stock ?? "all",
    priceMin: filters.priceMin ?? "",
    priceMax: filters.priceMax ?? "",
    sort: sortBy,
  };

  const { data: serverResult } = useGetProductsQuery();
  const filtered = serverResult?.data ?? [];

  const activeChips = useMemo((): ActiveChip[] => {
    const { activeCat, brands, colors, compat, stock, priceMin, priceMax } =
      normalizedFilters;
    return [
      ...(activeCat !== "all"
        ? [
            {
              key: "cat",
              label: categories.find((c) => c.id === activeCat)?.name ?? "",
              clear: () => setField("activeCat", "all"),
            },
          ]
        : []),
      ...brands.map((brand: string) => ({
        key: `b-${brand}`,
        label: brand,
        clear: () => toggle("brands", brand),
      })),
      ...colors.map((color: string) => ({
        key: `c-${color}`,
        label: color,
        clear: () => toggle("colors", color),
      })),
      ...compat.map((model: string) => ({
        key: `cm-${model}`,
        label: model,
        clear: () => toggle("compat", model),
      })),
      ...(stock !== "all"
        ? [
            {
              key: "st",
              label: (
                {
                  inStock: "In stock",
                  low: "Low stock",
                  out: "Out of stock",
                } as const
              )[stock as "inStock" | "low" | "out"],
              clear: () => setField("stock", "all"),
            },
          ]
        : []),
      ...(priceMin || priceMax
        ? [
            {
              key: "pr",
              label: `₹${priceMin || 0}–${priceMax || "∞"}`,
              clear: () => {
                setField("priceMin", "");
                setField("priceMax", "");
              },
            },
          ]
        : []),
    ];
  }, [filters, sortBy, categories]);

  return {
    filters: normalizedFilters,
    setField,
    clearAll,
    applySaved,
    filtered,
    activeChips,
    categories,
  };
}
