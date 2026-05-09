import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types";

interface AppStore {
  theme: Theme;
  accentColor: string;
  accentSecondary: string;
  setTheme: (t: Theme) => void;
  setAccentColor: (c: string) => void;
  setAccentSecondary: (c: string) => void;
  applyPreset: (primary: string, secondary: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: "light",
      accentColor: "#c4976a",
      accentSecondary: "#F97316",
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setAccentSecondary: (accentSecondary) => set({ accentSecondary }),
      applyPreset: (accentColor, accentSecondary) =>
        set({ accentColor, accentSecondary }),
    }),
    { name: "arihant_app_settings" },
  ),
);
