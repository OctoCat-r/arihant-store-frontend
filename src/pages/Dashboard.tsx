import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatINR } from "@/lib/formatters";
import {
  KpiCard,
  Icon,
  RevenueByCategoryChart,
  ProfitRevenueChart,
  TopSellersChart,
  CategoryProfitabilityChart,
} from "@/components";
import { useGetDashboardQuery, useGetCategoriesQuery } from "@/hooks";
import { useAuthStore } from "@/store";
import {
  buildRevenueByCategoryData,
  buildTopSellingProductsData,
  buildCategoryProfitabilityData,
} from "@/utils/dashboard.utils";

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: dashboardData } = useGetDashboardQuery();

  const { data: categories = [] } = useGetCategoriesQuery();

  const last14Days = dashboardData?.days ?? [];

  const revenueByCategoryChartData = useMemo(
    () => buildRevenueByCategoryData(dashboardData, categories),
    [dashboardData, categories],
  );

  const topSellingProducts = useMemo(
    () => buildTopSellingProductsData(dashboardData, categories),
    [dashboardData, categories],
  );

  const categoryProfitabilityData = useMemo(
    () => buildCategoryProfitabilityData(dashboardData, categories),
    [dashboardData, categories],
  );

  const stockAlertCount =
    (dashboardData?.lowStock ?? 0) + (dashboardData?.outOfStock ?? 0);
  const greetingMessage = user?.name
    ? `Good evening, ${user.name.split(" ")[0]} 👋`
    : "Good evening 👋";

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 lg:p-6">
      <div className="animate-fade-up flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {greetingMessage}
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Here's how your store is doing — last 30 days
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => navigate("/alerts")}
          >
            <Icon name="bell" size={16} />
            <span>{stockAlertCount}</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#c4976a] px-3.5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            onClick={() => navigate("/products/new")}
          >
            <Icon name="plus" size={16} />
            Add product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="animate-fade-up delay-1"><KpiCard label="Revenue (30d)" value={formatINR(dashboardData?.revenue ?? 0)} accent="#F97316" spark={(dashboardData?.revenueSpark ?? []).map((day) => day.revenue)} /></div>
        <div className="animate-fade-up delay-2"><KpiCard label="Profit (30d)" value={formatINR(dashboardData?.profit ?? 0)} accent="#10B981" spark={last14Days.map((day) => day.profit)} /></div>
        <div className="animate-fade-up delay-3"><KpiCard label="Inventory value" value={formatINR(dashboardData?.inventoryValue ?? 0)} accent="#7C3AED" /></div>
        <div className="animate-fade-up delay-4"><KpiCard label="Active SKUs" value={dashboardData?.products ?? 0} accent="#0EA5E9" /></div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="animate-fade-up delay-3 rounded-2xl border border-stone-200 bg-white p-4 lg:p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Revenue by category
            </h3>
            <span className="text-xs text-zinc-400">last 30 days</span>
          </div>
          <RevenueByCategoryChart data={revenueByCategoryChartData} />
        </div>

        <div className="animate-fade-up delay-4 rounded-2xl border border-stone-200 bg-white p-4 lg:p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Profit vs Revenue
            </h3>
            <span className="text-xs text-zinc-400">last 14 days</span>
          </div>
          <ProfitRevenueChart data={last14Days} />
        </div>

        <div className="animate-fade-up delay-4 rounded-2xl border border-stone-200 bg-white p-4 lg:p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Top selling products
            </h3>
            <span className="text-xs text-zinc-400">by units sold (30d)</span>
          </div>
          <TopSellersChart data={topSellingProducts} />
        </div>

        <div className="animate-fade-up delay-4 rounded-2xl border border-stone-200 bg-white p-4 lg:p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Revenue vs Profit by category
            </h3>
            <span className="text-xs text-zinc-400">last 30 days</span>
          </div>
          <CategoryProfitabilityChart data={categoryProfitabilityData} />
        </div>
      </div>
    </div>
  );
}
