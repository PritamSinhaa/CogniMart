import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const initialWishlist = [
  {
    id: 1,
    name: "Sony WH-1000XM5",
    category: "Headphones",
    rating: 4.8,
    reviews: 1248,
    price: 29990,
    oldPrice: 34990,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Apple AirPods Pro",
    category: "Audio",
    rating: 4.7,
    reviews: 892,
    price: 24999,
    oldPrice: 26990,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Nike Air Max",
    category: "Footwear",
    rating: 4.6,
    reviews: 531,
    price: 14999,
    oldPrice: 17999,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    category: "Accessories",
    rating: 4.5,
    reviews: 326,
    price: 8499,
    oldPrice: 9999,
    inStock: false,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [search, setSearch] = useState("");

  const filteredWishlist = wishlist.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const removeItem = (id) => {
    setWishlist((current) =>
      current.filter((product) => product.id !== id)
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Header */}

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
                {wishlist.length} items
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Products you've saved for your next purchase.
            </p>
          </div>

          {/* Search */}

          {wishlist.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search wishlist..."
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  pl-9
                  pr-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition-all
                  placeholder:text-slate-400
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-500/10
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-white
                "
              />
            </div>
          )}
        </div>

        {/* Wishlist */}

        {filteredWishlist.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {filteredWishlist.map((product, index) => (
              <WishlistCard
                key={product.id}
                product={product}
                index={index}
                onRemove={removeItem}
              />
            ))}
          </div>
        ) : (
          <EmptyWishlist />
        )}
      </div>
    </main>
  );
}

/* ============================================================
   WISHLIST CARD
============================================================ */

function WishlistCard({ product, index, onRemove }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="
        group
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-shadow
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* Image */}

      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Remove */}

        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.name} from wishlist`}
          className="
            absolute
            right-2
            top-2
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-slate-500
            shadow-sm
            backdrop-blur
            transition-colors
            hover:bg-red-50
            hover:text-red-500
            dark:bg-slate-900/95
            dark:text-slate-300
            dark:hover:bg-red-500/10
          "
        >
          <Trash2 size={15} />
        </button>

        {/* Discount */}

        {product.oldPrice > product.price && (
          <span className="absolute bottom-2 left-2 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">
            {Math.round(
              ((product.oldPrice - product.price) /
                product.oldPrice) *
                100
            )}
            % OFF
          </span>
        )}
      </div>

      {/* Content */}

      <div className="p-3">
        <p className="text-xs text-slate-400">
          {product.category}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="mt-1 block"
        >
          <h2 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white">
            {product.name}
          </h2>
        </Link>

        {/* Rating */}

        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            ★ {product.rating}
          </span>

          <span className="text-[11px] text-slate-400">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-slate-950 dark:text-white">
            {formatPrice(product.price)}
          </span>

          <span className="text-xs text-slate-400 line-through">
            {formatPrice(product.oldPrice)}
          </span>
        </div>

        {/* Stock */}

        <div className="mt-2">
          {product.inStock ? (
            <span className="text-xs font-medium text-emerald-600">
              In stock
            </span>
          ) : (
            <span className="text-xs font-medium text-red-500">
              Currently unavailable
            </span>
          )}
        </div>

        {/* Cart */}

        <button
          type="button"
          disabled={!product.inStock}
          className={`
            mt-3
            flex
            h-9
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            text-xs
            font-semibold
            transition-colors
            ${
              product.inStock
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
            }
          `}
        >
          <ShoppingCart size={14} />

          {product.inStock ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </motion.article>
  );
}

/* ============================================================
   EMPTY WISHLIST
============================================================ */

function EmptyWishlist() {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
        <Heart size={25} />
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        Your wishlist is empty
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Save products you love here and come back to them
        whenever you're ready.
      </p>

      <Link
        to="/products"
        className="
          mt-5
          inline-flex
          h-10
          items-center
          justify-center
          rounded-lg
          bg-emerald-600
          px-5
          text-sm
          font-semibold
          text-white
          transition-colors
          hover:bg-emerald-700
        "
      >
        Explore products
      </Link>
    </div>
  );
}