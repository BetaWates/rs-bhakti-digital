import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      type = "button",
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-2 active:scale-[0.99]";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-[#0b8278] text-white hover:bg-[#087e74] active:bg-[#06655d] border border-transparent shadow-xs disabled:bg-[#0b8278]/60",
      outline:
        "bg-white text-[#506079] hover:bg-[#f6f9fb] hover:text-[#172b4d] border border-[#dfe5ec] hover:border-[#c2cedb] shadow-xs active:bg-[#edf2f7]",
      ghost:
        "bg-transparent text-[#506079] hover:bg-[#f0f4f7] hover:text-[#172b4d] border border-transparent active:bg-[#e4ebf2]",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-transparent shadow-xs disabled:bg-rose-600/60",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-8 px-2.5 text-xs gap-1.5 rounded-md",
      md: "h-9 px-3.5 text-xs font-semibold gap-2 rounded-md",
      lg: "h-10.5 px-4.5 text-sm font-semibold gap-2.5 rounded-lg",
    };

    const widthStyle = fullWidth ? "w-full" : "";
    const disabledStyle = isDisabled
      ? "opacity-60 cursor-not-allowed pointer-events-none shadow-none"
      : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`.trim()}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Memuat...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
