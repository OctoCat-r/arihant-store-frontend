import { useRef, useCallback } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import type { StylesConfig } from 'react-select'
import { useAppStore } from '@/store'
import { useProductSearchFetcher } from '@/hooks/queries/useSearchProductsQuery'
import type { ProductSearchResult } from '@/hooks/queries/useSearchProductsQuery'

export interface ProductOption {
  value: string
  label: string
  brand: string
  stock: number
  cost: number
  price: number
}

function toOption(p: ProductSearchResult): ProductOption {
  return { value: p.id, label: p.name, brand: p.brand, stock: p.stock, cost: p.cost, price: p.price }
}

function buildProductStyles(isDark: boolean, hasError: boolean): StylesConfig<ProductOption, false> {
  const bg = isDark ? '#27272a' : '#ffffff'
  const border = isDark ? '#3f3f46' : '#e7e5e4'
  const text = isDark ? '#f4f4f5' : '#18181b'
  const textMuted = isDark ? '#a1a1aa' : '#71717a'
  const bgHover = isDark ? '#3f3f46' : '#fafaf9'
  const bgSelected = isDark ? '#2C2118' : '#F5EFE7'

  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: bg,
      borderColor: hasError ? '#ef4444' : state.isFocused ? 'var(--accent)' : border,
      borderRadius: '0.5rem',
      boxShadow: hasError
        ? '0 0 0 2px rgba(239,68,68,0.2)'
        : state.isFocused
        ? '0 0 0 2px color-mix(in srgb, var(--accent) 20%, transparent)'
        : 'none',
      minHeight: '38px',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      '&:hover': { borderColor: state.isFocused ? 'var(--accent)' : border },
    }),
    valueContainer: (base) => ({ ...base, padding: '2px 10px' }),
    singleValue: (base) => ({ ...base, color: text }),
    placeholder: (base) => ({ ...base, color: textMuted, fontSize: '0.875rem' }),
    input: (base) => ({ ...base, color: text, fontSize: '0.875rem', margin: 0, padding: 0 }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({ ...base, padding: '0 8px', color: textMuted }),
    clearIndicator: (base) => ({ ...base, padding: '0 8px', color: textMuted, cursor: 'pointer' }),
    menu: (base) => ({ ...base, backgroundColor: bg, borderRadius: '0.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: `1px solid ${border}`, zIndex: 50 }),
    menuList: (base) => ({ ...base, padding: '4px' }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? bgSelected : state.isFocused ? bgHover : 'transparent',
      color: text,
      borderRadius: '0.375rem',
      cursor: 'pointer',
      padding: '8px 10px',
    }),
    noOptionsMessage: (base) => ({ ...base, color: textMuted, fontSize: '0.875rem' }),
    loadingMessage: (base) => ({ ...base, color: textMuted, fontSize: '0.875rem' }),
  }
}

interface AsyncProductSelectProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  rules?: RegisterOptions<T>
  placeholder?: string
  disabled?: boolean
}

export function AsyncProductSelect<T extends FieldValues>({
  control,
  name,
  rules,
  placeholder = 'Search product…',
  disabled,
}: AsyncProductSelectProps<T>) {
  const isDark = useAppStore((s) => s.theme === 'dark')
  const fetchProducts = useProductSearchFetcher()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadOptions = useCallback(
    (inputValue: string, callback: (opts: ProductOption[]) => void) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (inputValue.trim().length < 1) { callback([]); return }
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await fetchProducts(inputValue)
          callback(results.map(toOption))
        } catch {
          callback([])
        }
      }, 350)
    },
    [fetchProducts],
  )

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <div className="flex flex-col gap-1">
          <AsyncSelect<ProductOption>
            styles={buildProductStyles(isDark, !!error)}
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
              inputValue ? 'No products found' : 'Start typing to search…'
            }
            loadingMessage={() => 'Searching…'}
            formatOptionLabel={(opt) => (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-zinc-400">{opt.brand}</div>
                </div>
                <span className="shrink-0 text-xs text-zinc-400">{opt.stock} left</span>
              </div>
            )}
          />
          {error && <span className="text-xs text-red-500">{error.message}</span>}
        </div>
      )}
    />
  )
}
