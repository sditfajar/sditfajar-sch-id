import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioChipOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioChipsProps {
  name: string;
  options: RadioChipOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
}

export function RadioChips({
  name,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled: groupDisabled = false,
  className,
  itemClassName,
}: RadioChipsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  return (
    <div
      role="radiogroup"
      className={cn("flex flex-wrap gap-2 w-full", className)}
    >
      {options.map((option) => {
        const isSelected = currentValue === option.value;
        const isDisabled = groupDisabled || option.disabled;
        const inputId = `${name}-${option.value}`;

        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={cn(
              "relative inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-medium rounded-xl transition-all duration-150 ease-out cursor-pointer select-none",
              "focus-within:ring-2 focus-within:ring-[#1D4ED8] focus-within:ring-offset-2",
              isSelected
                ? "bg-[#1D4ED8] text-white font-extrabold border-2 border-[#173fa8] shadow-[0_3px_0_#173fa8] active:translate-y-0.5 active:shadow-[0_1px_0_#173fa8]"
                : "bg-white text-[#0F172A] border-2 border-slate-200/90 shadow-[0_2px_0_#e2e8f0] hover:border-[#1D4ED8]/60 hover:bg-[#F2F3FF]/40 active:translate-y-0.5 active:shadow-[0_1px_0_#e2e8f0]",
              isDisabled && "opacity-50 cursor-not-allowed hover:shadow-none hover:border-slate-200",
              itemClassName
            )}
          >
            <input
              type="radio"
              id={inputId}
              name={name}
              value={option.value}
              checked={isSelected}
              disabled={isDisabled}
              onChange={() => handleChange(option.value)}
              className="sr-only"
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
