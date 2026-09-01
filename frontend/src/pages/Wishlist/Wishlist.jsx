import {
  Heart,
  LoaderCircle,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { useMemo, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { motion } from "motion/react";

import { useWishlist } from "../../context/WishlistContext";

import { useCart } from "../../context/CartContext";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

function getErrorMessage(error, fallback) {
  return error?.data?.message || error?.message || fallback;
}

export default function Wishlist() {
  const [search, setSearch] = useState("");

  const [addingProductId, setAddingProductId] = useState(null);

  const [cartError, setCartError] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  const {
    wishlistItems,
    wishlistCount,
    loading,
    error,
    updatingProductId,
    removeFromWishlist,
    clearWishlist,
    refreshWishlist,
    clearWishlistError,
  } = useWishlist();

  const { addToCart } = useCart();

  /*
  |--------------------------------------------------------------------------
  | Filter products
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Clear wishlist
  |--------------------------------------------------------------------------
  */

  const handleClearWishlist = async () => {
    const confirmed = window.confirm("Remove all products from your wishlist?");

    if (!confirmed) {
      return;
    }

    clearWishlistError();

    try {
      await clearWishlist();
    } catch {
      /*
       * WishlistContext stores and
       * displays the request error.
       */
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Remove one product
  |--------------------------------------------------------------------------
  */

  const handleRemove = async (productId) => {
    clearWishlistError();

    try {
      await removeFromWishlist(productId);
    } catch {
      /*
       * WishlistContext stores and
       * displays the request error.
       */
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Add product to Cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = async (product) => {
    const productId = product?._id || product?.id;

    if (!productId || !product.isActive || product.stock <= 0) {
      return;
    }

    setAddingProductId(String(productId));

    setCartError("");

    try {
      await addToCart(
        {
          ...product,
          id: productId,
          _id: productId,
        },
        1,
      );
    } catch (requestError) {
      if (requestError?.status === 401) {
        navigate("/login", {
          state: {
            from: location.pathname,

            message: "Please log in to add products to your cart.",
          },
        });

        return;
      }

      setCartError(
        getErrorMessage(
          requestError,
          "Unable to add this product to your cart.",
        ),
      );
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <WishlistHeader
          search={search}
          setSearch={setSearch}
          wishlistCount={wishlistCount}
          loading={loading}
          onClear={handleClearWishlist}
        />

        {error && (
          <ErrorMessage
            message={error}
            onDismiss={clearWishlistError}
            onRetry={() => {
              clearWishlistError();

              void refreshWishlist().catch(() => {});
            }}
          />
        )}

        {cartError && (
          <ErrorMessage
            message={cartError}
            onDismiss={() => setCartError("")}
          />
        )}

        {loading && wishlistItems.length === 0 ? (
          <WishlistLoading />
        ) : filteredWishlist.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {filteredWishlist.map((product, index) => {
              const productId = product._id || product.id;

              return (
                <WishlistCard
                  key={productId}
                  product={product}
                  index={index}
                  removing={String(updatingProductId) === String(productId)}
                  adding={String(addingProductId) === String(productId)}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        ) : (
          <EmptyWishlist
            searching={Boolean(search.trim())}
            onClearSearch={() => setSearch("")}
          />
        )}
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function WishlistHeader({
  search,
  setSearch,
  wishlistCount,
  loading,
  onClear,
}) {
  return (
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
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
            onClick={onClear}
            disabled={loading}
            className="shrink-0 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
          >
            {loading ? "Clearing..." : "Clear"}
          </button>
        </div>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Wishlist product card
|--------------------------------------------------------------------------
*/

function WishlistCard({
  product,
  index,
  removing,
  adding,
  onRemove,
  onAddToCart,
}) {
  const productId = product._id || product.id;

  const stock = Math.max(Number(product.stock) || 0, 0);

  const isActive = product.isActive !== false;

  const inStock = isActive && stock > 0;

  const originalPrice = Math.max(Number(product.originalPrice) || 0, 0);

  const price = Math.max(Number(product.price) || 0, 0);

  const rating = Math.min(Math.max(Number(product.rating) || 0, 0), 5);

  const reviews = Math.max(Number(product.reviews) || 0, 0);

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
        <Link to={`/products/${productId}`} className="block h-full w-full">
          <img
            src={product.image || FALLBACK_IMAGE}
            alt={product.name}
            loading="lazy"
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {!inStock && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-900 shadow-sm">
              Unavailable
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            void onRemove(productId);
          }}
          disabled={removing}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm backdrop-blur transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900/95 dark:text-slate-300 dark:hover:bg-red-500/10"
        >
          {removing ? (
            <LoaderCircle size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
        </button>

        {Number(product.discount) > 0 && (
          <span className="absolute bottom-2 left-2 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="truncate text-xs text-slate-400">
          {product.category || "Uncategorized"}
        </p>

        <Link to={`/products/${productId}`} className="mt-1 block">
          <h2 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white">
            {product.name}
          </h2>
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            ★ {rating.toFixed(1)}
          </span>

          <span className="text-[11px] text-slate-400">
            ({reviews.toLocaleString("en-IN")})
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
          {inStock ? `${stock} available` : "Currently unavailable"}
        </p>

        <button
          type="button"
          onClick={() => {
            void onAddToCart(product);
          }}
          disabled={!inStock || adding || removing}
          className={`mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-colors ${
            inStock
              ? "bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
          }`}
        >
          {adding ? (
            <>
              <LoaderCircle size={14} className="animate-spin" />
              Adding...
            </>
          ) : inStock ? (
            <>
              <ShoppingCart size={14} />
              Add to cart
            </>
          ) : (
            "Out of stock"
          )}
        </button>
      </div>
    </motion.article>
  );
}

/*
|--------------------------------------------------------------------------
| Request error
|--------------------------------------------------------------------------
*/

function ErrorMessage({ message, onDismiss, onRetry }) {
  return (
    <div
      role="alert"
      className="mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/20 dark:bg-red-500/10"
    >
      <p className="text-sm font-medium text-red-600 dark:text-red-400">
        {message}
      </p>

      <div className="flex gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Try again
          </button>
        )}

        <button
          type="button"
          onClick={onDismiss}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function WishlistLoading() {
  return (
    <div
      role="status"
      className="mt-6 flex min-h-[360px] items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="text-center">
        <LoaderCircle
          size={30}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading your wishlist...
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty wishlist
|--------------------------------------------------------------------------
*/

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
