import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/shared/Icon";

export type CardColor = "teal" | "blue" | "purple" | "orange";

export interface CardProps {
  title: string;
  value: string | number;
  suffix?: ReactNode;
  trend?: string | number;
  trendLabel?: string;
  icon?: IconName | ReactNode;
  color?: CardColor;
  className?: string;
  onClick?: () => void;
  sparklineVariant?: number;
}

export function Card({
  title,
  value,
  suffix,
  trend,
  trendLabel,
  icon,
  color = "teal",
  className = "",
  onClick,
  sparklineVariant = 0,
}: CardProps) {
  const colorMap: Record<
    CardColor,
    { iconBg: string; iconColor: string; stroke: string }
  > = {
    teal: {
      iconBg: "bg-[#eaf6f3]",
      iconColor: "text-[#0b756c]",
      stroke: "#0d9488",
    },
    blue: {
      iconBg: "bg-[#edf2fb]",
      iconColor: "text-[#4266a6]",
      stroke: "#5277c3",
    },
    purple: {
      iconBg: "bg-[#f1edf8]",
      iconColor: "text-[#7c5cb7]",
      stroke: "#8a70bc",
    },
    orange: {
      iconBg: "bg-[#fbf3e9]",
      iconColor: "text-[#8c632d]",
      stroke: "#ce9452",
    },
  };

  const currentTheme = colorMap[color];

  const sparklineLines = [
    "0,34 10,29 20,31 30,18 40,23 50,15 60,20 70,8 80,12 90,2",
    "0,32 10,32 20,22 30,26 40,13 50,18 60,10 70,13 80,5 90,9",
    "0,30 10,21 20,25 30,14 40,20 50,11 60,15 70,6 80,13 90,4",
    "0,28 10,31 20,21 30,24 40,17 50,20 60,9 70,13 80,5 90,8",
  ];
  const polyPoints = sparklineLines[sparklineVariant % sparklineLines.length];

  const isPositive =
    trend !== undefined &&
    (typeof trend === "number" ? trend > 0 : !String(trend).startsWith("-"));

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#e4e9ef] rounded-lg p-4 sm:p-4.5 flex flex-col justify-between overflow-hidden shadow-xs transition-shadow ${
        onClick ? "cursor-pointer hover:shadow-sm" : ""
      } ${className}`.trim()}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#607087] tracking-tight">{title}</span>
        {icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentTheme.iconBg} ${currentTheme.iconColor}`}
          >
            {typeof icon === "string" ? (
              <Icon name={icon as IconName} size={18} />
            ) : (
              icon
            )}
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-2.5 flex items-baseline gap-1 text-[#1d2f4b]">
        <span className="text-2xl sm:text-[30px] font-bold tracking-tight leading-none">
          {value}
        </span>
        {suffix && (
          <span className="text-sm font-medium text-[#5e6d81] ml-0.5">{suffix}</span>
        )}
      </div>

      {/* Bottom Trend & Sparkline */}
      <div className="mt-3.5 pt-1 flex items-end justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
          {trend !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                isPositive ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              <span>{isPositive ? "↗" : "↘"}</span>
              <span>{trend}</span>
            </span>
          )}
          {trendLabel && <span className="text-[#8c9ba5] text-[10px]">{trendLabel}</span>}
        </div>

        {/* Mini SVG Sparkline */}
        <div className="w-[72px] h-[32px] shrink-0 -mr-1">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 90 42"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id={`spark-${color}-${sparklineVariant}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop stopColor={currentTheme.stroke} stopOpacity=".18" />
                <stop offset="1" stopColor={currentTheme.stroke} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`0,42 ${polyPoints} 90,42`}
              fill={`url(#spark-${color}-${sparklineVariant})`}
            />
            <polyline
              points={polyPoints}
              fill="none"
              stroke={currentTheme.stroke}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Card;
