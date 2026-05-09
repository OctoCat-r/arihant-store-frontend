import { cn } from "@/lib/cn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ViewMode } from "@/types";
import {
  useInventoryFilters,
  useUpdateProductMutation,
  useGetProductsQuery,
} from "@/hooks";
import { toast } from "sonner";
import {
  Icon,
  FilterPanel,
  ProductCard,
  ProductRow,
  AppSelect,
} from "@/components";
import type { SelectOption } from "@/components/ui/AppSelect";
import { SORT_OPTIONS, SAVED_FILTERS } from "@/constants/inventory";

export function Inventory() {
  const navigate = useNavigate();
  const { mutateAsync: updateProduct } = useUpdateProductMutation();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const { data: productsResult } = useGetProductsQuery();
  const allProducts = productsResult?.data ?? [];

  const {
    filters,
    setField,
    clearAll,
    applySaved,
    filtered,
    activeChips,
    categories,
  } = useInventoryFilters();

  const handleEditProduct = (productId: string) =>
    navigate(`/products/${productId}/edit`);

  const handleUpdateStockCount = async (productId: string, delta: number) => {
    await updateProduct({ id: productId, delta });
    const productName =
      allProducts.find((product) => product.id === productId)?.name ?? "";
    const toastMessage = `${productName.slice(0, 30)} ${delta > 0 ? "+" : ""}${delta}`;
    delta > 0 ? toast.success(toastMessage) : toast.warning(toastMessage);
  };

  const ghostButtonClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors";
  const primaryButtonClass =
    "inline-flex items-center gap-1.5 rounded-lg bg-[#c4976a] px-3.5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity";

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Inventory
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {filtered.length} of {allProducts.length} products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={cn(ghostButtonClass, "lg:hidden")}
            onClick={() => setIsFilterSheetOpen(true)}
          >
            <Icon name="filter" size={16} />
          </button>
          <div className="hidden items-center gap-0 overflow-hidden rounded-lg border border-stone-200 dark:border-zinc-700 lg:flex">
            <button
              className={cn(
                "flex h-9 w-9 items-center justify-center transition-colors",
                viewMode === "grid"
                  ? "bg-[#c4976a] text-white"
                  : "bg-white text-zinc-500 hover:bg-stone-50 dark:bg-zinc-900 dark:hover:bg-zinc-800",
              )}
              onClick={() => setViewMode("grid")}
            >
              <Icon name="grid" size={14} />
            </button>
            <button
              className={cn(
                "flex h-9 w-9 items-center justify-center transition-colors",
                viewMode === "list"
                  ? "bg-[#c4976a] text-white"
                  : "bg-white text-zinc-500 hover:bg-stone-50 dark:bg-zinc-900 dark:hover:bg-zinc-800",
              )}
              onClick={() => setViewMode("list")}
            >
              <Icon name="list" size={14} />
            </button>
          </div>
          <button
            className={primaryButtonClass}
            onClick={() => navigate("/products/new")}
          >
            <Icon name="plus" size={16} />
            <span className="hidden xs:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Search + sort */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <Icon name="search" size={16} />
          </span>
          <input
            className="!pl-9"
            value={filters.searchQuery}
            onChange={(e) => setField("searchQuery", e.target.value)}
            placeholder="Search by name, brand, SKU, or compatible model…"
          />
          {filters.searchQuery && (
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              onClick={() => setField("searchQuery", "")}
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
        <AppSelect<string>
          className="w-44"
          options={SORT_OPTIONS}
          value={
            SORT_OPTIONS.find((option) => option.value === filters.sort) ?? null
          }
          onChange={(opt) =>
            opt &&
            setField("sort", (opt as SelectOption).value as typeof filters.sort)
          }
          isSearchable={false}
        />
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-400">Quick filters:</span>
        {SAVED_FILTERS.map((savedFilter) => (
          <button
            key={savedFilter.name}
            className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 hover:border-[#c4976a] hover:text-[#c4976a] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 transition-colors"
            onClick={() => {
              applySaved(savedFilter);
              toast.success(`Applied: ${savedFilter.name}`);
            }}
          >
            <Icon name="filter" size={11} />
            {savedFilter.name}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-1">
        <button
          className={cn(
            "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            filters.activeCat === "all"
              ? "bg-[#c4976a] text-white"
              : "text-zinc-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
          )}
          onClick={() => setField("activeCat", "all")}
        >
          All{" "}
          <span className="ml-1 text-xs opacity-70">{allProducts.length}</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              filters.activeCat === category.id
                ? "text-white"
                : "text-zinc-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
            )}
            onClick={() => setField("activeCat", category.id)}
            style={
              filters.activeCat === category.id
                ? { background: category.color }
                : {}
            }
          >
            <span>{category.icon}</span>
            {category.name}
            <span className="text-xs opacity-70">
              {
                allProducts.filter(
                  (product) => product.category === category.id,
                ).length
              }
            </span>
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden">
        <aside className="hidden w-56 shrink-0 overflow-y-auto lg:block">
          <FilterPanel />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden">
          {activeChips.length > 0 && (
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[#c4976a] hover:opacity-80 transition-opacity"
                  onClick={chip.clear}
                >
                  {chip.label}
                  <Icon name="close" size={12} />
                </button>
              ))}
              <button
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                onClick={clearAll}
              >
                Clear all
              </button>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="text-4xl text-zinc-300">⌕</div>
                <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">
                  No products match your filters
                </h3>
                <p className="text-sm text-zinc-400">
                  Try removing some filters or adding a new product.
                </p>
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#c4976a] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  onClick={clearAll}
                >
                  Clear filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categories={categories}
                    onEdit={handleEditProduct}
                    onAdjust={handleUpdateStockCount}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    categories={categories}
                    onEdit={handleEditProduct}
                    onAdjust={handleUpdateStockCount}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      {isFilterSheetOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 animate-fade-in"
          onClick={() => setIsFilterSheetOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 flex max-h-[85dvh] flex-col rounded-t-2xl border-t border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-stone-200 dark:bg-zinc-700" />
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Filters
              </h3>
              <button
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                onClick={() => setIsFilterSheetOpen(false)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <FilterPanel />
            </div>
            <div className="flex gap-2 border-t border-stone-100 p-4 dark:border-zinc-800">
              <button
                className={cn(ghostButtonClass, "flex-1 justify-center")}
                onClick={clearAll}
              >
                Clear
              </button>
              <button
                className={cn(primaryButtonClass, "flex-1 justify-center")}
                onClick={() => setIsFilterSheetOpen(false)}
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
