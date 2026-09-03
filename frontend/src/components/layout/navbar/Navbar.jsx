import { Menu, ShoppingCart, X } from "lucide-react";

import { useState } from "react";

import { Link } from "react-router-dom";

import { useCart } from "../../../context/CartContext";

import DesktopNav from "./DesktopNav";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavbarActions from "./NavbarActions";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cartCount } = useCart();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((currentValue) => !currentValue);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      {/* Desktop navbar */}

      <div className="hidden lg:block">
        {/* Top row */}

        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-6 px-6 xl:px-8">
          <Logo />

          <div className="min-w-0 flex-1">
            <SearchBar />
          </div>

          <NavbarActions />
        </div>

        {/* Bottom row */}

        <div className="border-t border-slate-100 dark:border-slate-800">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex h-11 w-full max-w-[1600px] items-center px-6 xl:px-8"
          >
            <DesktopNav />
          </nav>
        </div>
      </div>

      {/* Mobile navbar */}

      <nav
        aria-label="Mobile header"
        className="mx-auto flex h-16 w-full items-center gap-3 px-4 sm:px-6 lg:hidden"
      >
        <Logo />

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/cart"
            onClick={closeMobileMenu}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
          >
            <ShoppingCart size={20} />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}

      <div id="mobile-navigation">
        <MobileMenu open={mobileMenuOpen} onClose={closeMobileMenu} />
      </div>
    </header>
  );
}
