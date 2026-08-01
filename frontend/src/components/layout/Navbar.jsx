import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bot,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Deals", to: "/deals" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="border-b border-border bg-muted/50">
        <p className="py-1 text-center text-xs font-medium text-foreground">
          ✦ AI-Powered Shopping Experience — Smarter, Faster & Personalized
          for You!
        </p>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShoppingBag className="h-5 w-5" />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Cogni<span className="text-primary">Mart</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navLinkClass}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink to="/ai-assistant" className={navLinkClass}>
            AI Assistant
          </NavLink>
        </nav>

        <form
          onSubmit={handleSearch}
          className="hidden flex-1 md:mx-4 md:flex"
        >
          <label className="relative w-full">
            <span className="sr-only">Search products</span>

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for products, brands and more..."
              className="h-10 w-full rounded-full border border-input bg-card pl-10 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
            </button>
          </label>
        </form>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              0
            </span>
          </Link>

          <Link
            to="/ai-assistant"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <Bot className="h-5 w-5 text-primary" />
            AI Assistant
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <UserRound className="h-5 w-5" />
            Login
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
          className="ml-auto rounded-lg p-2 hover:bg-muted lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-card p-4 lg:hidden">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-semibold">Menu</span>

            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg p-2 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
            >
              Login
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;