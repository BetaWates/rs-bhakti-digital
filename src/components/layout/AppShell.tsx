import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import type { User } from "@/lib/types";

export interface AppShellProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}

export function AppShell({
  children,
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  onSearch,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafb] flex flex-col text-[#27354b] antialiased">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        currentUser={currentUser}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Workspace Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-[240px] transition-all duration-300">
        {/* Topbar */}
        <Topbar
          currentPage={currentPage}
          currentUser={currentUser}
          onSearch={onSearch}
          onToggleMobile={() => setMobileOpen((prev) => !prev)}
          onLogout={onLogout}
        />

        {/* Page Content Body */}
        <main className="flex-1 w-full max-w-[1640px] mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
