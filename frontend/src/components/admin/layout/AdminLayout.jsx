import { Outlet } from "react-router-dom";
import { useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}

      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggle={() =>
          setSidebarCollapsed((current) => !current)
        }
        onClose={() => setMobileOpen(false)}
      />

      {/* Main application area */}

      <div
        className={`
          min-h-screen
          min-w-0
          transition-[padding]
          duration-300
          ${sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-[250px]"}
        `}
      >
        {/* Top header */}

        <AdminHeader
          onMenuClick={() => setMobileOpen(true)}
          darkMode={darkMode}
          onToggleTheme={handleToggleTheme}
        />

        {/* Page content */}

        <main
          className="
            min-h-[calc(100vh-4rem)]
            min-w-0
            bg-slate-50
            dark:bg-slate-950
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}