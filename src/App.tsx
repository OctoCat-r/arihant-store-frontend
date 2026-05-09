import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore, useAuthStore } from "@/store";
import { useGetProductsQuery } from "@/hooks";
import { Sidebar, AppHeader } from "@/components";
import {
  Login,
  Dashboard,
  Inventory,
  SalesLog,
  ProfitLoss,
  CategoriesScreen,
  AlertsScreen,
  ProductForm,
} from "@/pages";

function RequireAuth() {
  const token = useAuthStore((s) => s.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function AppLayout() {
  const { theme, accentColor, accentSecondary, setTheme } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const { data: productsResult } = useGetProductsQuery();
  const products = productsResult?.data ?? [];
  const lowStockCount = products.filter(
    (p) => p.stock === 0 || p.stock <= p.lowStockThreshold,
  ).length;

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accentColor);
    document.documentElement.style.setProperty("--accent-2", accentSecondary);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, accentColor, accentSecondary]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeader
        theme={theme}
        lowStockCount={lowStockCount}
        onMenuOpen={() => setSidebarOpen(true)}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar lowStockCount={lowStockCount} isOpen={sidebarOpen} />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#fdfbf7] dark:bg-zinc-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<SalesLog />} />
          <Route path="/pl" element={<ProfitLoss />} />
          <Route path="/categories" element={<CategoriesScreen />} />
          <Route path="/alerts" element={<AlertsScreen />} />
          <Route path="/products/new" element={<ProductForm isNew />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
        </Route>
      </Route>
    </Routes>
  );
}
