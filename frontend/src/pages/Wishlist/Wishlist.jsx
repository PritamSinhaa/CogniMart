import { Heart, Search, ShoppingCart, Trash2 } from "lucide-react";

import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { motion } from "motion/react";

import { useWishlist } from "../../context/WishlistContext";

import { useCart } from "../../context/CartContext";

const FALLBACK_IMAGE = "/favicon.svg";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

export default function Wishlist() {
  const [search, setSearch] = useState("");

  const { wishlistItems, wishlistCount, removeFromWishlist, clearWishlist } =
    useWishlist();

  const { addToCart } = useCart();

  const filteredWishlist = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return wishlistItems;
    }

    return wishlistItems.filter((product) => {
      const searchableText = [product.name, product.category, product.brand]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [wishlistItems, search]);

  const handleClearWishlist = () => {
    const confirmed = window.confirm("Remove all products from your wishlist?");

    if (confirmed) {
      clearWishlist();
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      return;
    }

    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Saved for later
            </p>

            <div className="mt-1 flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                My Wishlist
              </h1>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10">
                {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Products you&apos;ve saved for your next purchase.
            </p>
          </div>

          {wishlistCount > 0 && (
            <div className="flex w-full gap-3 sm:w-auto">
              <div className="relative min-w-0 flex-1 sm:w-64">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search wishlist..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleClearWishlist}
                className="shrink-0 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-500 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {filteredWishlist.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {filteredWishlist.map((product, index) => (
              <WishlistCard
                key={product.id}
                product={product}
                index={index}
                onRemove={removeFromWishlist}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <EmptyWishlist
            searching={Boolean(search.trim())}
            onClearSearch={() => setSearch("")}
          />
        )}
      </div>
    </div>
  );
}

function WishlistCard({ product, index, onRemove, onAddToCart }) {
  const inStock = Number(product.stock) > 0;

  const originalPrice = Number(product.originalPrice) || 0;

  const price = Number(product.price) || 0;

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: Math.min(index * 0.05, 0.25),
      }}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link to={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={product.image || FALLBACK_IMAGE}
            alt={product.name}
            loading="lazy"
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm backdrop-blur transition-colors hover:bg-red-50 hover:text-red-500 dark:bg-slate-900/95 dark:text-slate-300 dark:hover:bg-red-500/10"
        >
          <Trash2 size={15} />
        </button>

        {product.discount > 0 && (
          <span className="absolute bottom-2 left-2 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs text-slate-400">{product.category}</p>

        <Link to={`/products/${product.id}`} className="mt-1 block">
          <h2 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white">
            {product.name}
          </h2>
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            ★ {Number(product.rating).toFixed(1)}
          </span>

          <span className="text-[11px] text-slate-400">
            ({Number(product.reviews).toLocaleString("en-IN")})
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-slate-950 dark:text-white">
            {formatPrice(price)}
          </span>

          {originalPrice > price && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <p
          className={`mt-2 text-xs font-medium ${
            inStock ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {inStock ? `${product.stock} available` : "Currently unavailable"}
        </p>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={!inStock}
          className={`mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-colors ${
            inStock
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
          }`}
        >
          <ShoppingCart size={14} />

          {inStock ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </motion.article>
  );
}

function EmptyWishlist({ searching, onClearSearch }) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
        <Heart size={25} />
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        {searching ? "No matching products" : "Your wishlist is empty"}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {searching
          ? "Try a different search term."
          : "Save products you love and return to them whenever you are ready."}
      </p>

      {searching ? (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Clear search
        </button>
      ) : (
        <Link
          to="/products"
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Explore products
        </Link>
      )}
    </div>
  );
}
