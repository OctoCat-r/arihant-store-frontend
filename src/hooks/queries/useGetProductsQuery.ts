import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { kyClient } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

import { useInventoryFilterStore } from "@/store";
import type { ApiPaginated } from "@/lib/api";
import type { Product } from "@/types";
import { createAPIParams } from "@/utils/common.utils";

export const PRODUCTS_KEY = (qs = "") => ["products", qs] as const;

type ProductsQueryKey = ReturnType<typeof PRODUCTS_KEY>;

export function useGetProductsQuery(
  options?: Omit<
    UseQueryOptions<
      ApiPaginated<Product>,
      Error,
      ApiPaginated<Product>,
      ProductsQueryKey
    >,
    "queryKey" | "queryFn"
  >,
) {
  const { filters, sortBy } = useInventoryFilterStore();

  const { searchQuery, activeCat, stock, priceMax, priceMin, ...restFilters } =
    filters;

  const qs = createAPIParams({
    q: searchQuery,
    category: activeCat === "all" ? "" : activeCat,
    stock: stock === "all" ? "" : stock,
    price_min: priceMin,
    price_max: priceMax,
    ...restFilters,
    sort_by: sortBy,
    page_size: "200",
  });

  return useQuery({
    queryKey: PRODUCTS_KEY(qs),
    queryFn: async ({ queryKey }) => {
      const response = await kyClient.get(`products/?${queryKey[1]}`);
      return response.json<ApiPaginated<Product>>();
    },
    ...options,
  });
}

export const invalidateProductsQuery = () =>
  queryClient.invalidateQueries({ queryKey: ["products"] });
