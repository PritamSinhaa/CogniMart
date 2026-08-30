import {
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  Tag,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
      },
      {
        label: "Analytics",
        path: "/admin/analytics",
        icon: BarChart3,
      },
      {
        label: "AI Insights",
        path: "/admin/ai-insights",
        icon: Sparkles,
      },
    ],
  },

  {
    label: "Commerce",
    items: [
      {
        label: "Products",
        path: "/admin/products",
        icon: Package,
      },
      {
        label: "Categories",
        path: "/admin/categories",
        icon: FolderTree,
      },
      {
        label: "Inventory",
        path: "/admin/inventory",
        icon: Boxes,
      },
      {
        label: "Orders",
        path: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        label: "Customers",
        path: "/admin/customers",
        icon: Users,
      },
      {
        label: "Coupons",
        path: "/admin/coupons",
        icon: Tag,
      },
    ],
  },

  {
    label: "System",
    items: [
      {
        label: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar({
  collapsed = false,
  mobileOpen = false,
  onToggle,
  onClose,
}) {
  return (
    <>
      {/* ============================================================
          MOBILE OVERLAY
      ============================================================ */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-slate-950/40
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* ============================================================
          SIDEBAR
      ============================================================ */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          flex-col
          border-r
          border-slate-200
          bg-white
          transition-all
          duration-300
          dark:border-slate-800
          dark:bg-slate-950

          ${collapsed ? "w-[76px]" : "w-[250px]"}

          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ==========================================================
            BRAND
        ========================================================== */}

        <div
          className={`
            flex
            h-16
            shrink-0
            items-center
            border-b
            border-slate-200
            px-4
            dark:border-slate-800
            ${collapsed ? "justify-center" : "justify-between"}
          `}
        >
          <NavLink
            to="/admin"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            {/* Logo */}

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-600
                text-white
                shadow-sm
              "
            >
              <ShoppingCart size={17} strokeWidth={2.2} />
            </div>

            {/* Brand */}

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                  CogniMart
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
                  Admin
                </p>
              </div>
            )}
          </NavLink>

          {/* Mobile close */}

          {!collapsed && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition-colors
                hover:bg-slate-100
                hover:text-slate-700
                lg:hidden
                dark:hover:bg-slate-900
                dark:hover:text-slate-200
              "
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* ==========================================================
            NAVIGATION
        ========================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-5
          "
        >
          <div className="space-y-6">
            {navigation.map((section) => (
              <div key={section.label}>
                {/* Section title */}

                {!collapsed && (
                  <p
                    className="
                      mb-2
                      px-3
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    {section.label}
                  </p>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"}
                        onClick={onClose}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          `
                            group
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            transition-all
                            duration-150

                            ${
                              isActive
                                ? `
                                  bg-emerald-50
                                  text-emerald-700
                                  dark:bg-emerald-950/40
                                  dark:text-emerald-400
                                `
                                : `
                                  text-slate-600
                                  hover:bg-slate-50
                                  hover:text-slate-950
                                  dark:text-slate-400
                                  dark:hover:bg-slate-900
                                  dark:hover:text-white
                                `
                            }

                            ${collapsed ? "justify-center" : ""}
                          `
                        }
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.9}
                          className="shrink-0"
                        />

                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* ==========================================================
            BOTTOM AREA
        ========================================================== */}

        <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
          {/* Revenue mini insight */}

          {!collapsed && (
            <div
              className="
                mb-3
                rounded-xl
                border
                border-emerald-100
                bg-emerald-50
                p-3
                dark:border-emerald-900/50
                dark:bg-emerald-950/30
              "
            >
              <div className="flex items-center gap-2">
                <CircleDollarSign
                  size={15}
                  className="text-emerald-600 dark:text-emerald-400"
                />

                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Store health
                </span>
              </div>

              <p className="mt-1 text-[11px] leading-5 text-emerald-700/80 dark:text-emerald-400/70">
                Your store is performing well today.
              </p>
            </div>
          )}

          {/* Collapse */}

          <button
            type="button"
            onClick={onToggle}
            className="
              hidden
              h-9
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              lg:flex
              dark:text-slate-400
              dark:hover:bg-slate-900
              dark:hover:text-white
            "
          >
            {collapsed ? (
              <>
                <ChevronRight size={17} />

                <span className="sr-only">Expand sidebar</span>
              </>
            ) : (
              <>
                <ChevronLeft size={17} />

                <span className="text-xs font-medium">Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
