import ReactSelect, {
  type Props as ReactSelectProps,
  type GroupBase,
  type StylesConfig,
} from "react-select";
import { useAppStore } from "@/store";

export interface SelectOption<V = string> {
  value: V;
  label: string;
}

type AppSelectProps<V = string, IsMulti extends boolean = false> = Omit<
  ReactSelectProps<SelectOption<V>, IsMulti, GroupBase<SelectOption<V>>>,
  "styles" | "theme"
> & {
  isDark?: boolean;
};

export function buildStyles<V, IsMulti extends boolean>(
  isDark: boolean,
): StylesConfig<SelectOption<V>, IsMulti, GroupBase<SelectOption<V>>> {
  const bg = isDark ? "#27272a" : "#ffffff"; // zinc-800 / white
  const bgHover = isDark ? "#3f3f46" : "#fafaf9"; // zinc-700 / stone-50
  const bgSelected = isDark ? "#2C2118" : "#F5EFE7"; // accent-soft dark / light
  const border = isDark ? "#3f3f46" : "#e7e5e4"; // zinc-700 / stone-200
  const text = isDark ? "#f4f4f5" : "#18181b"; // zinc-100 / zinc-900
  const textMuted = isDark ? "#a1a1aa" : "#71717a"; // zinc-400 / zinc-500
  const accent = "var(--accent)";

  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: bg,
      borderColor: state.isFocused ? "var(--accent)" : border,
      borderRadius: "0.5rem",
      boxShadow: state.isFocused
        ? "0 0 0 2px color-mix(in srgb, var(--accent) 20%, transparent)"
        : "none",
      minHeight: "38px",
      fontSize: "0.875rem",
      cursor: "pointer",
      

      transition: "border-color 0.15s, box-shadow 0.15s",
      "&:hover": { borderColor: state.isFocused ? "var(--accent)" : border },
    }),
    valueContainer: (base) => ({ ...base, padding: "2px 10px" }),
    singleValue: (base) => ({ ...base, color: text }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: bgSelected,
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: text,
      fontSize: "0.8125rem",
      padding: "1px 4px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: textMuted,
      borderRadius: "0 0.375rem 0.375rem 0",
      "&:hover": {
        backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
        color: accent,
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: textMuted,
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: text,
      fontSize: "0.875rem",
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: textMuted,
      padding: "0 8px",
      transition: "transform 0.2s, color 0.15s",
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      "&:hover": { color: text },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: textMuted,
      padding: "0 4px",
      "&:hover": { color: text },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: bg,
      border: `1px solid ${border}`,
      borderRadius: "0.625rem",
      boxShadow: isDark
        ? "0 8px 24px rgba(0,0,0,0.5)"
        : "0 8px 24px rgba(0,0,0,0.10)",
      overflow: "hidden",
      zIndex: 50,
    }),
    menuList: (base) => ({ ...base, padding: "4px" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? bgSelected
        : state.isFocused
          ? bgHover
          : "transparent",
      color: state.isSelected ? accent : text,
      fontWeight: state.isSelected ? 500 : 400,
      fontSize: "0.875rem",
      borderRadius: "0.375rem",
      padding: "7px 10px",
      cursor: "pointer",
      transition: "background-color 0.1s",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: textMuted,
      fontSize: "0.875rem",
    }),
    loadingMessage: (base) => ({
      ...base,
      color: textMuted,
      fontSize: "0.875rem",
    }),
  };
}

export function AppSelect<V = string, IsMulti extends boolean = false>({
  isDark: isDarkProp,
  ...props
}: AppSelectProps<V, IsMulti>) {
  const theme = useAppStore((s) => s.theme);
  const isDark = isDarkProp ?? theme === "dark";

  return (
    <ReactSelect
      {...props}
      styles={buildStyles<V, IsMulti>(isDark)}
      menuPortalTarget={document.body}
      menuPosition="fixed"
    />
  );
}
