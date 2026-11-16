import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
  type ReactNode,
} from "react";
import { Icon } from "@/components/shared/Icon";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  leftIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options = [],
      error,
      helperText,
      required,
      placeholder,
      value,
      onChange,
      name,
      className = "",
      containerClassName = "",
      id,
      disabled,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`.trim()}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-[#172b4d] flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#5e6d81]">
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`w-full h-9.5 rounded-md border text-xs text-[#27354b] bg-white transition-all appearance-none cursor-pointer
              ${leftIcon ? "pl-9" : "pl-3"}
              pr-9
              ${
                error
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                  : "border-[#dfe5ec] hover:border-[#c2cedb] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20"
              }
              ${disabled ? "bg-[#f8fafb] text-[#8c9ba5] cursor-not-allowed border-[#e6eaf0]" : ""}
              focus:outline-none
              ${className}
            `.trim()}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-gray-400">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 pointer-events-none text-[#66758b]">
            <Icon name="chevron" size={14} className="rotate-90 transform" />
          </div>
        </div>

        {error ? (
          <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-0.5">
            <Icon name="alertCircle" size={13} className="shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-[#64748b] mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
