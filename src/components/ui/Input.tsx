import {
  forwardRef,
  useState,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Icon } from "@/components/shared/Icon";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  required?: boolean;
  className?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      required,
      placeholder,
      value,
      onChange,
      name,
      className = "",
      containerClassName = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`.trim()}>
        {label && (
          <label
            htmlFor={inputId}
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

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={effectiveType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`w-full h-9.5 rounded-md border text-xs text-[#27354b] placeholder-[#8c9ba5] bg-white transition-all
              ${leftIcon ? "pl-9" : "pl-3"}
              ${isPassword || rightIcon ? "pr-10" : "pr-3"}
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
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-2.5 p-1 rounded-md text-[#66758b] hover:text-[#172b4d] hover:bg-[#f0f4f7] transition-colors cursor-pointer"
            >
              <Icon name={showPassword ? "eyeOff" : "eye"} size={16} />
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3 flex items-center pointer-events-none text-[#5e6d81]">
              {rightIcon}
            </div>
          ) : null}
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

Input.displayName = "Input";

export default Input;
