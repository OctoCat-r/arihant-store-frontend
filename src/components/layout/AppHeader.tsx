import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui";
import type { Theme } from "@/types";
import logoUrl from "@/assets/logo.svg";

interface AppHeaderProps {
  theme: Theme;
  lowStockCount: number;
  onMenuOpen: () => void;
  onToggleTheme: () => void;
}

export function AppHeader({
  theme,
  lowStockCount,
  onMenuOpen,
  onToggleTheme,
}: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="z-20 relative flex lg:h-20 h-12 shrink-0 items-center gap-3 border-b border-stone-200 bg-white/90 px-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90 lg:px-5">
      <button
        className="inline-flex items-center justify-center rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800 lg:hidden"
        onClick={onMenuOpen}
      >
        <Icon name="menu" size={17} />
      </button>

      <div className="flex items-center  lg:absolute lg:left-1/2  lg:-translate-x-1/2 gap-2.5">
        <img
          src={logoUrl}
          alt="Arihant Store logo"
          className="lg:h-16 h-12 w-auto dark:invert hidden lg:block"
        />
        <span
          className="lg:text-3xl text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          style={{ fontFamily: "'Fraunces', serif", fontOpticalSizing: "auto" }}
        >
          Arihant Store
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-0.5">
        <button
          className="relative inline-flex items-center justify-center rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          onClick={() => navigate("/alerts")}
          title="Stock alerts"
        >
          <Icon name="bell" size={16} />
          {lowStockCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 text-[9px] font-bold leading-none text-red-500">
              {lowStockCount}
            </span>
          )}
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          onClick={onToggleTheme}
          title={theme === "light" ? "Dark mode" : "Light mode"}
        >
          <Icon name={theme === "light" ? "moon" : "sun"} size={16} />
        </button>
      </div>
    </header>
  );
}
