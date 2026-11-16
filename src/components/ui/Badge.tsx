import type { ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "info" | "danger" | "neutral";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({
  variant = "neutral",
  children,
  dot = false,
  className = "",
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
    success: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      dot: "bg-emerald-500",
    },
    warning: {
      badge: "bg-amber-50 text-amber-800 border-amber-200/80",
      dot: "bg-amber-500",
    },
    info: {
      badge: "bg-blue-50 text-blue-700 border-blue-200/80",
      dot: "bg-blue-500",
    },
    danger: {
      badge: "bg-rose-50 text-rose-700 border-rose-200/80",
      dot: "bg-rose-500",
    },
    neutral: {
      badge: "bg-slate-50 text-slate-700 border-slate-200/80",
      dot: "bg-slate-400",
    },
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full border ${current.badge} ${className}`.trim()}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
