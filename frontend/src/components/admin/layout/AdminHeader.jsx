import { Bell, ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";

export default function AdminHeader({
  onMenuClick,
  darkMode = false,
  onToggleTheme,
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className="
        sticky
        top-0
        z-30
        h-16
        border-b
        border-slate-200
        bg-white/95
        backdrop-blur-xl
        dark:border-slate-800
        dark:bg-slate-950/95
      "
    >
      <div
        className="
          flex
          h-full
          items-center
          justify-between
          gap-3
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* ==========================================================
            LEFT
        ========================================================== */}

        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}

          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open admin navigation"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              lg:hidden
              dark:text-slate-400
              dark:hover:bg-slate-900
              dark:hover:text-white
            "
          >
            <Menu size={19} />
          </button>

          {/* Search */}

          <div
            className="
              relative
              hidden
              w-full
              max-w-md
              md:block
            "
          >
            <Search
              size={17}
              className="
                pointer-events-none
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="search"
              placeholder="Search products, orders, customers..."
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition-all
                placeholder:text-slate-400
                focus:border-emerald-400
                focus:bg-white
                focus:ring-2
                focus:ring-emerald-500/10
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-white
                dark:focus:border-emerald-700
                dark:focus:bg-slate-900
              "
            />
          </div>

          {/* Mobile search */}

          <button
            type="button"
            aria-label="Search"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              md:hidden
              dark:text-slate-400
              dark:hover:bg-slate-900
              dark:hover:text-white
            "
          >
            <Search size={18} />
          </button>
        </div>

        {/* ==========================================================
            RIGHT
        ========================================================== */}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Theme */}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-slate-900
              dark:hover:text-white
            "
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Notifications */}

          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-slate-900
              dark:hover:text-white
            "
          >
            <Bell size={18} />

            {/* Notification indicator */}

            <span
              className="
                absolute
                right-2
                top-1.5
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-500
                ring-2
                ring-white
                dark:ring-slate-950
              "
            />
          </button>

          {/* Divider */}

          <div
            className="
              mx-1
              hidden
              h-7
              w-px
              bg-slate-200
              sm:block
              dark:bg-slate-800
            "
          />

          {/* ========================================================
              PROFILE
          ======================================================== */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              className="
                flex
                items-center
                gap-2.5
                rounded-xl
                p-1.5
                transition-colors
                hover:bg-slate-50
                dark:hover:bg-slate-900
              "
              aria-expanded={profileOpen}
            >
              {/* Avatar */}

              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-100
                  text-xs
                  font-bold
                  text-emerald-700
                  dark:bg-emerald-950
                  dark:text-emerald-400
                "
              >
                PS
              </div>

              {/* Name */}

              <div className="hidden text-left lg:block">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Pritam Sinha
                </p>

                <p className="text-[10px] text-slate-400">Administrator</p>
              </div>

              <ChevronDown
                size={15}
                className="
                  hidden
                  text-slate-400
                  transition-transform
                  lg:block
                "
              />
            </button>

            {/* ======================================================
                PROFILE DROPDOWN
            ====================================================== */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-56
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-1.5
                  shadow-xl
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                {/* Profile header */}

                <div
                  className="
                    border-b
                    border-slate-100
                    px-3
                    py-2.5
                    dark:border-slate-800
                  "
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Pritam Sinha
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    Administrator
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    className="
                      flex
                      w-full
                      items-center
                      rounded-xl
                      px-3
                      py-2
                      text-left
                      text-sm
                      text-slate-600
                      transition-colors
                      hover:bg-slate-50
                      hover:text-slate-900
                      dark:text-slate-400
                      dark:hover:bg-slate-800
                      dark:hover:text-white
                    "
                  >
                    My profile
                  </button>

                  <button
                    type="button"
                    className="
                      flex
                      w-full
                      items-center
                      rounded-xl
                      px-3
                      py-2
                      text-left
                      text-sm
                      text-slate-600
                      transition-colors
                      hover:bg-slate-50
                      hover:text-slate-900
                      dark:text-slate-400
                      dark:hover:bg-slate-800
                      dark:hover:text-white
                    "
                  >
                    Account settings
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                  <button
                    type="button"
                    className="
                      flex
                      w-full
                      items-center
                      rounded-xl
                      px-3
                      py-2
                      text-left
                      text-sm
                      font-medium
                      text-red-500
                      transition-colors
                      hover:bg-red-50
                      dark:hover:bg-red-950/30
                    "
                  >
                    Sign out
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
