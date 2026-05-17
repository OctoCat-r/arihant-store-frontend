import { useRef, useCallback } from "react";
import { Controller } from "react-hook-form";
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import AsyncSelect from "react-select/async";
import { cn } from "@/lib/cn";
import { useProductSearchFetcher } from "@/hooks/queries/useSearchProductsQuery";
import type { ProductSearchResult } from "@/hooks/queries/useSearchProductsQuery";

export interface ProductOption {
  value: string;
  label: string;
  brand: string;
  stock: number;
  cost: number;
  price: number;
}

function toOption(p: ProductSearchResult): ProductOption {
  return {
    value: p.id,
    label: p.name,
    brand: p.brand,
    stock: p.stock,
    cost: p.cost,
    price: p.price,
  };
}

const CUSTOM_CONTROL_STYLES = {
  base: "w-full rounded-lg border border-stone-200 bg-white text-sm text-zinc-900 transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
  focused:
    "border-(--accent) ring-2 ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] outline-none",
  error: "border-red-500 ring-2 ring-red-500/20",
};

const CUSTOM_OPTION_STYLES = {
  base: "cursor-pointer rounded-md px-2.5 py-2 text-sm text-zinc-900 dark:text-zinc-100",
  focused: "bg-stone-50 dark:bg-zinc-700",
  selected: "bg-[#F5EFE7] dark:bg-[#2C2118]",
};

interface AsyncProductSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  placeholder?: string;
  disabled?: boolean;
}

export function AsyncProductSelect<T extends FieldValues>({
  control,
  name,
  rules,
  placeholder = "Search product…",
  disabled,
}: AsyncProductSelectProps<T>) {
  const fetchProducts = useProductSearchFetcher();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOptions = useCallback(
    (inputValue: string, callback: (opts: ProductOption[]) => void) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (inputValue.trim().length < 1) {
        callback([]);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await fetchProducts(inputValue);
          callback(results.map(toOption));
        } catch {
          callback([]);
        }
      }, 350);
    },
    [fetchProducts],
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <div className="flex flex-col gap-1">
          <AsyncSelect<ProductOption>
            unstyled
            classNames={{
              control: ({ isFocused }) =>
                cn(
                  CUSTOM_CONTROL_STYLES.base,
                  error
                    ? CUSTOM_CONTROL_STYLES.error
                    : isFocused && CUSTOM_CONTROL_STYLES.focused,
                ),
              valueContainer: () => "px-3 py-2 flex flex-wrap gap-1",
              singleValue: () => "text-sm text-zinc-900 dark:text-zinc-100",
              placeholder: () => "text-sm text-zinc-400 dark:text-zinc-500",
              input: ({ isHidden }) =>
                cn(
                  "text-sm *:border-none",
                  !isHidden && "text-zinc-900 dark:text-zinc-100",
                ),
                
              indicatorSeparator: () => "hidden",
              dropdownIndicator: () => "pr-2 text-zinc-400 dark:text-zinc-500",
              clearIndicator: () =>
                "pr-2 text-zinc-400 dark:text-zinc-500 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300",
              menu: () =>
                "mt-1 rounded-lg border border-stone-200 bg-white px-1.5 py-2.5 shadow-md dark:border-zinc-700 dark:bg-zinc-800",
              option: ({ isFocused, isSelected }) =>
                cn(
                  CUSTOM_OPTION_STYLES.base,
                  isSelected
                    ? CUSTOM_OPTION_STYLES.selected
                    : isFocused && CUSTOM_OPTION_STYLES.focused,
                ),
              noOptionsMessage: () =>
                "px-3 py-2 text-sm text-zinc-400 dark:text-zinc-500",
              loadingMessage: () =>
                "px-3 py-2 text-sm text-zinc-400 dark:text-zinc-500",
              menuPortal: () => "z-[9999]",
            }}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            loadOptions={loadOptions}
            defaultOptions={false}
            cacheOptions
            value={value ?? null}
            onChange={onChange}
            onBlur={onBlur}
            isDisabled={disabled}
            placeholder={placeholder}
            isClearable
            menuPortalTarget={document.body}
            noOptionsMessage={({ inputValue }) =>
              inputValue ? "No products found" : "Start typing to search…"
            }
            loadingMessage={() => "Searching…"}
            formatOptionLabel={(opt, { context }) =>
              context === "value" ? (
                <span className="text-sm">{opt.label}</span>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {opt.label}
                    </div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500">
                      {opt.brand}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                    {opt.stock} left
                  </span>
                </div>
              )
            }
          />
          {error && (
            <span className="text-xs text-red-500">{error.message}</span>
          )}
        </div>
      )}
    />
  );
}
