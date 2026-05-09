import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { kyClient } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

import type { ApiResponse } from "@/lib/api";
import { useDashboardFilterStore } from "@/store";
import { createAPIParams } from "@/utils/common.utils";

export const DASHBOARD_KEY = (qs = "") =>
  ["analytics", "dashboard", qs] as const;

type DashboardQueryKey = ReturnType<typeof DASHBOARD_KEY>;

export interface DashboardData {
  revenue: number;
  profit: number;
  orders: number;
  avgOrder: number;
  products: number;
  lowStock: number;
  outOfStock: number;
  revenueSpark: { date: string; revenue: number }[];
  inventoryValue: number;
  byCategory: { category: string; revenue: number; profit: number }[];
  topSellers: {
    productId: string;
    name: string;
    category: string;
    sold30d: number;
  }[];
  days: { date: string; revenue: number; profit: number }[];
}

export function useGetDashboardQuery(
  options?: Omit<
    UseQueryOptions<DashboardData, Error, DashboardData, DashboardQueryKey>,
    "queryKey" | "queryFn"
  >,
) {
  const filters = useDashboardFilterStore(useShallow((s) => s.filters));

  const qs = createAPIParams(filters);

  return useQuery({
    queryKey: DASHBOARD_KEY(qs),
    queryFn: async ({ queryKey }) => {
      const response = await kyClient.get(
        `analytics/dashboard/?${queryKey[2]}`,
      );
      const result = await response.json<ApiResponse<DashboardData>>();
      return result.data;
    },
    ...options,
  });
}

export const invalidateDashboardQuery = () =>
  queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
