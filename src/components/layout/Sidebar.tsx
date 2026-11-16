import { Icon } from "@/components/shared/Icon";
import logoUrl from "@/assets/logo.png";
import { NAV_ITEMS, HOSPITAL_INFO } from "@/lib/constants";
import type { User } from "@/lib/types";

export interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser?: User | null;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  currentPage,
  onNavigate,
  currentUser,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const userRole = currentUser?.role || "admin";

  // Filter nav items by currentUser role
  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Backdrop Scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-[240px] bg-white border-r border-[#e6eaf0] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        aria-label="Navigasi Utama"
      >
        {/* Top Header / Logo */}
        <div className="pt-6 px-4 pb-3 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => onNavigate("Portal Modul")}
            title="Kembali ke Portal Modul (Gateway)"
          >
            <img
              src={logoUrl}
              alt="RS Bhakti Digital Logo"
              className="h-9 w-auto object-contain"
            />
          </div>

          {/* Close button on mobile */}
          {mobileOpen && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              aria-label="Tutup menu navigasi"
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </div>

        {/* Hospital Switcher Button */}
        <div className="px-3.5 mt-2 mb-4">
          <button
            type="button"
            className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-[#e4e9ef] hover:bg-[#f8fafb] text-left transition-colors cursor-pointer group"
          >
            <span className="w-8 h-8 rounded-md bg-[#f0f4f9] text-[#4266a6] flex items-center justify-center shrink-0 group-hover:bg-[#e4ebf5] transition-colors">
              <Icon name="hospital" size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <strong className="block text-[11px] font-semibold text-[#172b4d] truncate">
                {HOSPITAL_INFO.name}
              </strong>
              <small className="block text-[9.5px] text-[#5e6d81] truncate">
                {HOSPITAL_INFO.branch}
              </small>
            </div>
            <Icon name="chevron" size={13} className="text-[#8c9ba5] rotate-90 shrink-0" />
          </button>
        </div>

        {/* Navigation Category Label */}
        <div className="px-4 mb-2 flex items-center justify-between text-[10px] font-bold text-[#8c9ba5] tracking-wider uppercase">
          <span>WORKSPACE</span>
          {currentUser && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
              {currentUser.role}
            </span>
          )}
        </div>

        {/* Main Nav Items */}
        <nav className="flex-1 overflow-y-auto px-2.5 space-y-0.5 scrollbar-thin">
          {visibleNavItems.map((item) => {
            const isActive = currentPage === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onNavigate(item.label);
                  if (mobileOpen && onCloseMobile) onCloseMobile();
                }}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all text-left cursor-pointer group ${
                  isActive
                    ? "bg-[#eaf6f4] text-[#087d73] font-semibold shadow-2xs"
                    : "text-[#5f6d81] hover:bg-[#f5f8fa] hover:text-[#1e3a8a]"
                }`}
              >
                <span
                  className={`shrink-0 transition-colors ${
                    isActive ? "text-[#0d9488]" : "text-[#5e6d81] group-hover:text-[#1e3a8a]"
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                </span>
                <span className="truncate flex-1">{item.label}</span>
                {item.count && (
                  <span
                    className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      isActive
                        ? "bg-white text-[#087d73] border-[#0d9488]/30"
                        : "bg-white text-[#5e6d81] border-[#e6eaf0]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#edf0f4] mt-auto flex flex-col gap-1 bg-[#fcfdfe]">
          {/* Settings Nav Item */}
          <button
            type="button"
            onClick={() => {
              onNavigate("Settings");
              if (mobileOpen && onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left cursor-pointer ${
              currentPage === "Settings"
                ? "bg-[#eaf6f4] text-[#087d73] font-semibold"
                : "text-[#5f6d81] hover:bg-[#f5f8fa] hover:text-[#1e3a8a]"
            }`}
          >
            <Icon name="settings" size={17} />
            <span className="truncate">Settings</span>
          </button>

          {/* System Status Indicator */}
          <div className="mt-2 pt-2.5 pb-1 border-t border-[#edf0f4] flex items-center gap-2 px-2 text-[10px] text-[#5e6d81]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium truncate">All systems operational</span>
          </div>

          {/* Copyright & Tagline */}
          <div className="px-2 pt-1 pb-1 text-[9px] text-[#8c9ba5] leading-tight">
            <span className="font-semibold block text-[#64748b]">© 2025 RS Bhakti Digital</span>
            <span className="truncate block">Care connected. Lives improved.</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
