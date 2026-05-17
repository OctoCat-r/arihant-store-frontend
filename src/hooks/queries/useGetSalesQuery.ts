import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { kyClient } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

import type { ApiPaginated } from "@/lib/api";
import type { Sale } from "@/types";
import { useSalesFilterStore } from "@/store";
import { createAPIParams } from "@/utils/common.utils";

export const SALES_KEY = (qs = "") => ["sales", qs] as const;

type SalesQueryKey = ReturnType<typeof SALES_KEY>;

export function useGetSalesQuery(
  options?: Omit<
    UseQueryOptions<
      ApiPaginated<Sale>,
      Error,
      ApiPaginated<Sale>,
      SalesQueryKey
    >,
    "queryKey" | "queryFn"
  >,
) {
  const { filters } = useSalesFilterStore(
    useShallow((s) => ({ filters: s.filters })),
  );

  const qs = createAPIParams({
    range: filters.range ?? "30",
    ...(filters.catFilter && filters.catFilter !== "all"
      ? { category: filters.catFilter }
      : {}),
    page_size: "80",
  });

  return useQuery({
    queryKey: SALES_KEY(qs),
    queryFn: async ({ queryKey }) => {
      const response = await kyClient.get(`sales/?${queryKey[1]}`);
      return response.json<ApiPaginated<Sale>>();
    },
    ...options,
  });
}

export const invalidateSalesQuery = () =>
  queryClient.invalidateQueries({ queryKey: ["sales"] });
