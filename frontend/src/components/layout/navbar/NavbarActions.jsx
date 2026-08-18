import { Heart, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

const actions = [
  {
    label: "Wishlist",
    icon: Heart,
    href: "/wishlist",
  },
  {
    label: "Login",
    icon: User,
    href: "/login",
  },
];

export default function NavbarActions() {
  const { cartCount } = useCart();

  return (
    <div className="hidden items-center gap-4 lg:flex">
      {/* Wishlist */}
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

      {/* Cart */}
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
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </Link>

      {/* Login */}
      <Link
        to="/login"
        className="group relative flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
      >
        <User
          size={16}
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />

        Login
      </Link>
    </div>
  );
}
