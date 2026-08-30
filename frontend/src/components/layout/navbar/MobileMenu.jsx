import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  Bot,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  Search,
} from "lucide-react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import UserAvatar from "../../common/UserAvatar";

import {
  useAuth,
} from "../../../context/AuthContext";

const navigationLinks = [
  {
    label: "Home",
    to: "/",
    end: true,
  },
  {
    label: "Products",
    to: "/products",
  },
  {
    label: "Categories",
    to: "/categories",
  },
  {
    label: "Deals",
    to: "/deals",
  },
];

export default function MobileMenu({
  open,
  onClose,
}) {
  const navigate = useNavigate();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  const [search, setSearch] =
    useState("");

  const [logoutError, setLogoutError] =
    useState("");

  const handleSearch = (
    event,
  ) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      return;
    }

    const searchParams =
      new URLSearchParams({
        search: query,
      });

    navigate(
      `/products?${searchParams.toString()}`,
    );

    setSearch("");
    onClose();
  };

  const handleLogout = async () => {
    try {
      setLogoutError("");

      await logout();

      onClose();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setLogoutError(
        error?.data?.message ||
          error?.message ||
          "Unable to log out.",
      );
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            height: 0,
            opacity: 0,
          }}
          animate={{
            height: "auto",
            opacity: 1,
          }}
          exit={{
            height: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
          className="
            overflow-hidden
            border-t
            border-slate-200
            bg-white
            lg:hidden
            dark:border-slate-800
            dark:bg-slate-950
          "
        >
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4">
            {/*
             * Search
             */}
            <form
              onSubmit={handleSearch}
              className="
                mb-4
                flex
                h-10
                items-center
                rounded-full
                border
                border-slate-200
                bg-slate-50
                px-3
                focus-within:border-emerald-500
                focus-within:ring-2
                focus-within:ring-emerald-500/10
                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              <Search
                size={16}
                className="mr-2 shrink-0 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search products..."
                aria-label="Search products"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-sm
                  text-slate-900
                  outline-none
                  placeholder:text-slate-400
                  dark:text-white
                "
              />

              {search.trim() && (
                <button
                  type="submit"
                  className="
                    ml-2
                    shrink-0
                    rounded-full
                    bg-emerald-600
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-white
                    hover:bg-emerald-700
                  "
                >
                  Search
                </button>
              )}
            </form>

            {/*
             * Main navigation
             */}
            <nav
              aria-label="Mobile navigation"
              className="space-y-1"
            >
              {navigationLinks.map(
                (link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    end={link.end}
                    onClick={onClose}
                    className={({
                      isActive,
                    }) =>
                      `
                        block
                        rounded-lg
                        px-3
                        py-3
                        text-sm
                        font-medium
                        transition-colors
                        ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                        }
                      `
                    }
                  >
                    {link.label}
                  </NavLink>
                ),
              )}

              <NavLink
                to="/ai-assistant"
                onClick={onClose}
                className={({
                  isActive,
                }) =>
                  `
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                    }
                  `
                }
              >
                <Bot size={17} />

                AI Assistant
              </NavLink>
            </nav>

            <div className="my-3 border-t border-slate-200 dark:border-slate-800" />

            {/*
             * Wishlist
             */}
            <NavLink
              to="/wishlist"
              onClick={onClose}
              className={({
                isActive,
              }) =>
                `
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  }
                `
              }
            >
              <Heart size={17} />

              Wishlist
            </NavLink>

            {/*
             * Authentication loading
             */}
            {loading && (
              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-3
                "
                role="status"
              >
                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />

                <div className="flex-1">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="mt-2 h-2.5 w-36 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            )}

            {/*
             * Logged-in user
             */}
            {!loading && user && (
              <div className="mt-2">
                <Link
                  to="/account/profile"
                  onClick={onClose}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-slate-700
                    transition-colors
                    hover:bg-slate-50
                    dark:text-slate-300
                    dark:hover:bg-slate-900
                  "
                >
                  <UserAvatar
                    user={user}
                    size="sm"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {user.name ||
                        "My account"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </Link>

                <NavLink
                  to="/orders"
                  onClick={onClose}
                  className={({
                    isActive,
                  }) =>
                    `
                      mt-1
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-3
                      text-sm
                      font-medium
                      transition-colors
                      ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                      }
                    `
                  }
                >
                  <Package
                    size={17}
                  />

                  My orders
                </NavLink>

                {user.role ===
                  "admin" && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="
                      mt-1
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-3
                      text-sm
                      font-medium
                      text-slate-700
                      transition-colors
                      hover:bg-slate-50
                      dark:text-slate-300
                      dark:hover:bg-slate-900
                    "
                  >
                    <LayoutDashboard
                      size={17}
                    />

                    Admin dashboard
                  </Link>
                )}

                {logoutError && (
                  <p
                    className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                    role="alert"
                  >
                    {logoutError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="
                    mt-1
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-red-600
                    transition-colors
                    hover:bg-red-50
                    dark:text-red-400
                    dark:hover:bg-red-500/10
                  "
                >
                  <LogOut size={17} />

                  Logout
                </button>
              </div>
            )}

            {/*
             * Guest login
             */}
            {!loading && !user && (
              <Link
                to="/login"
                onClick={onClose}
                className="
                  mt-2
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  bg-emerald-600
                  px-3
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-emerald-700
                "
              >
                <LogIn size={17} />

                Login to your account
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}