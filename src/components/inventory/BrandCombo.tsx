import Creatable from "react-select/creatable";
import type { SingleValue } from "react-select";
import { buildStyles, type SelectOption } from "@/components/ui/AppSelect";
import { useAppStore } from "@/store";

interface BrandComboProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  onAddNew?: (name: string) => void;
  placeholder?: string;
}

export function BrandCombo({
  value,
  onChange,
  options,
  onAddNew,
  placeholder,
}: BrandComboProps) {
  const theme = useAppStore((s) => s.theme);
  const isDark = theme === "dark";

  const selectOptions = options.map((o) => ({ value: o, label: o }));
  const selectedOption = value ? { value, label: value } : null;

  const handleChange = (option: SingleValue<SelectOption>) => {
    onChange(option?.value ?? "");
  };

  const handleCreate = (inputValue: string) => {
    onAddNew?.(inputValue);
    onChange(inputValue);
  };

  return (
    <Creatable<SelectOption, false>
      options={selectOptions}
      value={selectedOption}
      onChange={handleChange}
      onCreateOption={handleCreate}
      placeholder={placeholder}
      formatCreateLabel={(input) => `Add "${input}" as new brand`}
      styles={buildStyles(isDark)}
      menuPortalTarget={document.body}
      menuPosition="fixed"
    />
  );
}
