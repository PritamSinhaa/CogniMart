import {
  ChevronRight,
  Heart,
  LoaderCircle,
  LogOut,
  Package,
  User,
} from "lucide-react";

import { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const MENU_ITEMS = [
  {
    label: "Profile",
    icon: User,
    to: "/account/profile",
    end: true,
  },
  {
    label: "Orders",
    icon: Package,
    to: "/orders",
  },
  {
    label: "Wishlist",
    icon: Heart,
    to: "/wishlist",
  },
];

export default function AccountSidebar() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);
      setLogoutError("");

      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      /*
       * AuthContext clears the local user
       * even if the server logout request
       * fails. Send the user to login so
       * protected data is no longer shown.
       */
      setLogoutError(
        error?.data?.message || error?.message || "Logout request failed.",
      );

      navigate("/login", {
        replace: true,
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <nav aria-label="Account navigation" className="space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`
              }
            >
              <Icon size={17} />

              <span className="flex-1">{item.label}</span>

              <ChevronRight size={14} />
            </NavLink>
          );
        })}
      </nav>

      <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10"
      >
        {loggingOut ? (
          <LoaderCircle size={17} className="animate-spin" />
        ) : (
          <LogOut size={17} />
        )}

        {loggingOut ? "Logging out..." : "Logout"}
      </button>

      {logoutError && (
        <p
          role="alert"
          className="px-3 pb-2 pt-1 text-xs leading-5 text-red-500"
        >
          {logoutError}
        </p>
      )}
    </aside>
  );
}
