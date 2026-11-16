import { type ReactNode } from "react";
import { Icon, type IconName } from "@/components/shared/Icon";

export interface TabItem {
  key: string;
  label: string;
  count?: number | string;
  icon?: IconName;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter tabs"
      className={`inline-flex items-center gap-1 p-1 bg-[#f0f4f8] rounded-lg border border-[#e2e8f0] ${className}`.trim()}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] ${
              isActive
                ? "bg-white text-[#172b4d] font-semibold shadow-xs border border-[#dfe5ec]"
                : "text-[#5e6d81] hover:text-[#172b4d] hover:bg-white/60 border border-transparent"
            }`}
          >
            {tab.icon && (
              <Icon
                name={tab.icon}
                size={14}
                className={isActive ? "text-[#0d9488]" : "text-[#8c9ba5]"}
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                  isActive
                    ? "bg-[#0b8278]/10 text-[#087d73]"
                    : "bg-[#e2e8f0] text-[#5e6d81]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
