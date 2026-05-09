import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/constants/nav";
import { Icon } from "@/components/ui";
import { useAuthStore } from "@/store";

interface SidebarProps {
  lowStockCount: number;
  isOpen: boolean;
}

export function Sidebar({ lowStockCount, isOpen }: SidebarProps) {
  const { user, clearAuth } = useAuthStore();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AR";
  const displayName = user?.name ?? "Arihant R.";

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-56 flex-col overflow-y-auto border-r border-stone-200 bg-white p-3 transition-transform dark:border-zinc-800 dark:bg-zinc-900",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:static lg:translate-x-0",
      )}
    >
      <div className="mt-2 mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        Manage
      </div>
      {NAV_ITEMS.map((n) => (
        <NavLink
          key={n.id}
          to={n.path}
          end={n.path === "/"}
          className={({ isActive }) =>
            cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-(--accent-soft) font-medium text-(--accent)"
                : "text-zinc-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
            )
          }
        >
          <Icon name={n.icon} size={17} />
          <span>{n.label}</span>
          {n.id === "alerts" && lowStockCount > 0 && (
            <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {lowStockCount}
            </span>
          )}
        </NavLink>
      ))}

      <div className="mt-4 mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        Quick
      </div>
      <NavLink
        to="/products/new"
        className={({ isActive }) =>
          cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-(--accent-soft) font-medium text-(--accent)"
              : "text-zinc-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
          )
        }
      >
        <Icon name="plus" size={17} />
        <span>Add product</span>
      </NavLink>
      {/* Footer */}
      <div className="mt-auto border-t border-stone-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c4976a] text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
              {displayName}
            </div>
            <div className="text-xs text-zinc-400">Owner</div>
          </div>
          <button
            onClick={clearAuth}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-stone-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            title="Sign out"
          >
            <Icon name="logout" size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
