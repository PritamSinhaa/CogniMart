import {
  ChevronDown,
  LoaderCircle,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

function createInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to complete logout.";
}

export default function AdminHeader({
  onMenuClick,
  darkMode = false,
  onToggleTheme,
}) {
  const navigate = useNavigate();

  const profileRef = useRef(null);

  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const [logoutError, setLogoutError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Close dropdown
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);
      setLogoutError("");

      await logout();
    } catch (error) {
      /*
       * AuthContext clears the local user
       * in its finally block, even when the
       * server request fails.
       */
      setLogoutError(getErrorMessage(error));
    } finally {
      setLoggingOut(false);
      setProfileOpen(false);

      navigate("/login", {
        replace: true,
      });
    }
  };

  const displayName = user?.name || "Administrator";

  const displayEmail = user?.email || "Admin account";

  const initials = createInitials(displayName) || "AD";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open admin navigation"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            <Menu size={19} />
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <ShieldCheck size={17} className="text-emerald-600" />

            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Admin portal
              </p>

              <p className="text-[10px] text-slate-400">CogniMart management</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block dark:bg-slate-800" />

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((current) => !current);

                setLogoutError("");
              }}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                {initials}
              </div>

              <div className="hidden max-w-36 text-left lg:block">
                <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                  {displayName}
                </p>

                <p className="text-[10px] capitalize text-slate-400">
                  {user?.role || "admin"}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`hidden text-slate-400 transition-transform lg:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {displayName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    Administrator
                  </span>
                </div>

                {logoutError && (
                  <p
                    role="alert"
                    className="mx-2 mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  >
                    {logoutError}
                  </p>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10"
                  >
                    {loggingOut ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <LogOut size={16} />
                    )}

                    {loggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
