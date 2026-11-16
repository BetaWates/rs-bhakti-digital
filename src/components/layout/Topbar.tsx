import { useState, useRef, useEffect, type FormEvent } from "react";
import { Icon } from "@/components/shared/Icon";
import { useTheme } from "@/contexts/ThemeContext";
import type { User } from "@/lib/types";

export interface TopbarProps {
  currentPage: string;
  currentUser?: User | null;
  onSearch?: (query: string) => void;
  onToggleMobile?: () => void;
  onLogout?: () => void;
}

export function Topbar({
  currentPage,
  currentUser,
  onSearch,
  onToggleMobile,
  onLogout,
}: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    onSearch?.(val);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(searchValue);
  };

  const displayName = currentUser?.name || "dr. Aditya Pratama";
  const displayRole = currentUser?.roleLabel || "Hospital Administrator";
  const displayEmail = currentUser?.email || "admin@rsbhaktidigital.id";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter((_, i) => i === 0 || i === 1)
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 lg:h-18 bg-white border-b border-[#e6eaf0] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Buka menu navigasi"
          className="lg:hidden p-2 text-[#5e6d81] hover:text-[#172b4d] hover:bg-[#f0f4f7] rounded-md transition-colors cursor-pointer"
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <span className="text-[#5e6d81] hidden sm:inline font-medium">Workspace</span>
          <Icon
            name="chevron"
            size={13}
            className="text-[#8c9ba5] hidden sm:inline rotate-0"
          />
          <span className="font-bold text-[#172b4d] tracking-tight">{currentPage}</span>
        </nav>
      </div>

      {/* Right: Search, Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:flex items-center w-52 lg:w-64"
        >
          <div className="absolute left-2.5 text-[#8c9ba5] pointer-events-none flex items-center">
            <Icon name="search" size={15} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari pasien, dokter, atau rekam..."
            aria-label="Cari apa saja"
            className="w-full h-8.5 pl-8 pr-11 text-xs rounded-md bg-[#f8fafb] border border-[#e2e8f0] text-[#27354b] placeholder-[#8c9ba5] focus:bg-white focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 focus:outline-none transition-all"
          />
          <kbd className="absolute right-2 text-[10px] text-[#8c9ba5] bg-white border border-[#e2e8f0] rounded px-1.5 py-0.5 pointer-events-none font-sans font-semibold">
            ⌘K
          </kbd>
        </form>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-expanded={notificationsOpen}
            aria-label="Notifikasi"
            className={`relative p-2 text-[#5e6d81] hover:text-[#1e3a8a] hover:bg-[#f0f4f7] rounded-lg transition-colors cursor-pointer ${
              notificationsOpen ? "bg-[#f0f4f7] text-[#1e3a8a]" : ""
            }`}
          >
            <Icon name="bell" size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0d9488] ring-2 ring-white" />
          </button>

          {/* Notifications Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#e4e9ef] py-2 z-50 animate-scale-up">
              <div className="px-4 py-2 border-b border-[#edf0f4] flex items-center justify-between">
                <span className="text-xs font-bold text-[#172b4d]">Notifikasi</span>
                <span className="text-[10px] font-semibold bg-[#eaf6f4] text-[#087d73] px-2 py-0.5 rounded-full">
                  2 baru
                </span>
              </div>

              <div className="divide-y divide-[#f1f5f9] max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-[#f8fafb] transition-colors flex gap-3 cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-[#eaf6f4] text-[#0d9488] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="calendar" size={14} />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-[#172b4d]">Jadwal poli pagi siap</p>
                    <p className="text-[#64748b] text-[11px] mt-0.5">
                      24 pasien terjadwal konsultasi hari ini.
                    </p>
                    <span className="text-[9.5px] text-[#8c9ba5] mt-1 block">5 menit yang lalu</span>
                  </div>
                </div>

                <div className="p-3 hover:bg-[#f8fafb] transition-colors flex gap-3 cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-[#edf2fb] text-[#4266a6] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="flask" size={14} />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-[#172b4d]">Hasil laboratorium keluar</p>
                    <p className="text-[#64748b] text-[11px] mt-0.5">
                      3 hasil tes darah siap untuk ditinjau dokter.
                    </p>
                    <span className="text-[9.5px] text-[#8c9ba5] mt-1 block">15 menit yang lalu</span>
                  </div>
                </div>
              </div>

              <div className="px-3 pt-2 pb-1 border-t border-[#edf0f4] text-center">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-semibold text-[#0d9488] hover:text-[#0b756c] transition-colors cursor-pointer"
                >
                  Tandai semua sudah dibaca
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
          title={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
          className="p-2 text-[#5e6d81] hover:text-[#172b4d] hover:bg-[#f0f4f7] rounded-lg transition-colors cursor-pointer flex items-center justify-center text-sm"
        >
          {theme === "dark" ? (
            <span role="img" aria-label="Mode Terang">☀️</span>
          ) : (
            <span role="img" aria-label="Mode Gelap">🌙</span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[#e6eaf0] mx-0.5 hidden sm:block" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotificationsOpen(false);
            }}
            aria-expanded={profileOpen}
            className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-lg hover:bg-[#f0f4f7] transition-colors text-left cursor-pointer group"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#e8edf2] text-[#355476] border-2 border-white flex items-center justify-center font-bold text-xs shadow-2xs group-hover:border-[#0d9488]/30 transition-colors">
              {initials}
            </div>

            <div className="hidden sm:block">
              <strong className="block text-xs font-semibold text-[#172b4d] leading-none truncate max-w-[130px]">
                {displayName}
              </strong>
              <small className="block text-[10px] text-[#5e6d81] mt-1 leading-none truncate max-w-[130px]">
                {displayRole}
              </small>
            </div>

            <Icon
              name="chevron"
              size={12}
              className={`text-[#8c9ba5] rotate-90 transition-transform hidden sm:block ${
                profileOpen ? "-rotate-90" : "rotate-90"
              }`}
            />
          </button>

          {/* Profile Popover */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#e4e9ef] p-2 z-50 animate-scale-up">
              <div className="px-3 py-2 border-b border-[#edf0f4]">
                <strong className="block text-xs font-bold text-[#172b4d] truncate">
                  {displayName}
                </strong>
                <span className="block text-[11px] text-[#64748b] truncate mt-0.5">
                  {displayEmail}
                </span>
                <span className="inline-block mt-2 px-2 py-0.5 text-[9.5px] font-semibold bg-[#eaf6f4] text-[#087d73] rounded-md">
                  {currentUser?.role ? currentUser.role.toUpperCase() : "DEMO"}
                </span>
              </div>

              <div className="py-1">
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <Icon name="logout" size={16} />
                    <span>Keluar dari SIMRS</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
