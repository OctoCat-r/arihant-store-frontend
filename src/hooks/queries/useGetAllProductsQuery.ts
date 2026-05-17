import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { kyClient } from "@/lib/api";
import type { ApiPaginated } from "@/lib/api";
import type { Product } from "@/types";

// Stable key — never includes filter params, so inventory filters can't pollute it.
export const ALL_PRODUCTS_KEY = ["products", "all"] as const;

type AllProductsKey = typeof ALL_PRODUCTS_KEY;

export function useGetAllProductsQuery(
  options?: Omit<
    UseQueryOptions<ApiPaginated<Product>, Error, ApiPaginated<Product>, AllProductsKey>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: ALL_PRODUCTS_KEY,
    queryFn: async () => {
      const response = await kyClient.get("products/?page_size=500");
      return response.json<ApiPaginated<Product>>();
    },
    staleTime: 30_000,
    ...options,
  });
}
