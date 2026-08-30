import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import UserAvatar from "../../common/UserAvatar";

import {
  useCart,
} from "../../../context/CartContext";

import {
  useAuth,
} from "../../../context/AuthContext";

export default function NavbarActions() {
  const navigate = useNavigate();

  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const { cartCount } =
    useCart();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  useEffect(() => {
    function handleOutsideClick(
      event,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target,
        )
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(
      event,
    ) {
      if (
        event.key === "Escape"
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  const handleLogout = async () => {
    try {
      setMenuOpen(false);

      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error,
      );
    }
  };

  return (
    <div className="hidden items-center gap-4 lg:flex">
      <Link
        to="/wishlist"
        className="group relative flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
      >
        <Heart
          size={16}
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />

        Wishlist
      </Link>

      <Link
        to="/cart"
        aria-label={`Shopping cart with ${cartCount} items`}
        className="group relative flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
      >
        <ShoppingCart
          size={16}
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />

        Cart

        {cartCount > 0 && (
          <span className="absolute -right-2.5 -top-2 flex min-h-3.5 min-w-3.5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[8px] font-bold text-white">
            {cartCount > 99
              ? "99+"
              : cartCount}
          </span>
        )}
      </Link>

      {loading ? (
        <div
          className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"
          aria-label="Checking account"
        />
      ) : user ? (
        <div
          ref={menuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current,
              )
            }
            aria-label="Open account menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="
              flex
              items-center
              gap-2
              rounded-full
              p-0.5
              pr-2
              transition-colors
              hover:bg-slate-100
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500
              dark:hover:bg-slate-800
            "
          >
            <UserAvatar
              user={user}
              size="md"
            />

            <ChevronDown
              size={14}
              className={`
                text-slate-400
                transition-transform
                ${menuOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="
                absolute
                right-0
                top-full
                z-50
                mt-2
                w-64
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                p-2
                shadow-xl
                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    user={user}
                    size="md"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <AccountMenuLink
                  to="/account/profile"
                  icon={User}
                  label="My profile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                />

                <AccountMenuLink
                  to="/orders"
                  icon={Package}
                  label="My orders"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                />

                {user.role ===
                  "admin" && (
                  <AccountMenuLink
                    to="/admin"
                    icon={
                      LayoutDashboard
                    }
                    label="Admin dashboard"
                    onClick={() =>
                      setMenuOpen(
                        false,
                      )
                    }
                  />
                )}
              </div>

              <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <LogOut
                    size={16}
                  />

                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className="group flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
        >
          <User size={16} />

          Login
        </Link>
      )}
    </div>
  );
}

function AccountMenuLink({
  to,
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      role="menuitem"
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
    >
      <Icon size={16} />

      {label}
    </Link>
  );
}