import { Check, Heart, LoaderCircle, ShoppingCart, Star } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { motion } from "motion/react";

import { useCart } from "../../../context/CartContext";

import { useWishlist } from "../../../context/WishlistContext";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

export default function ProductCard({ product, index = 0 }) {
  const [adding, setAdding] = useState(false);

  const [added, setAdded] = useState(false);

  const [cartError, setCartError] = useState("");

  const [wishlistError, setWishlistError] = useState("");

  const addedTimerRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
    updatingProductId: wishlistUpdatingProductId,
  } = useWishlist();

  /*
  |--------------------------------------------------------------------------
  | Clear timer on unmount
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  if (!product) {
    return null;
  }

  const productId = product._id || product.id;

  const {
    name = "Unnamed product",

    category = "Uncategorized",

    price = 0,
    originalPrice = 0,
    discount = 0,
    rating = 0,
    reviews = 0,
    image,
    images = [],
    stock = 0,
    isActive = true,
  } = product;

  const categoryName =
    typeof category === "object"
      ? category?.name || "Uncategorized"
      : category || "Uncategorized";

  const numericPrice = Math.max(Number(price) || 0, 0);

  const numericOriginalPrice = Math.max(
    Number(originalPrice) || numericPrice,
    0,
  );

  const numericDiscount = Math.min(Math.max(Number(discount) || 0, 0), 100);

  const numericRating = Math.min(Math.max(Number(rating) || 0, 0), 5);

  const numericReviews = Math.max(Number(reviews) || 0, 0);

  const numericStock = Math.max(Number(stock) || 0, 0);

  const productImage = image || images?.[0] || FALLBACK_IMAGE;

  const isOutOfStock = !isActive || numericStock <= 0;

  const wished = Boolean(productId) && isInWishlist(productId);

  const wishlistUpdating =
    String(wishlistUpdatingProductId) === String(productId);

  /*
  |--------------------------------------------------------------------------
  | Wishlist
  |--------------------------------------------------------------------------
  */

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId || wishlistUpdating) {
      return;
    }

    setWishlistError("");

    try {
      await toggleWishlist({
        ...product,
        id: productId,
        _id: productId,
      });
    } catch (error) {
      if (error?.status === 401) {
        navigate("/login", {
          state: {
            from: location.pathname,

            message: "Please log in to save products to your wishlist.",
          },
        });

        return;
      }

      setWishlistError(
        error?.data?.message ||
          error?.message ||
          "Unable to update your wishlist",
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Add to cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId || isOutOfStock || adding) {
      return;
    }

    if (addedTimerRef.current) {
      window.clearTimeout(addedTimerRef.current);
    }

    setAdding(true);
    setAdded(false);
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

      setAdded(true);

      addedTimerRef.current = window.setTimeout(() => {
        setAdded(false);
      }, 1200);
    } catch (error) {
      if (error?.status === 401) {
        navigate("/login", {
          state: {
            from: location.pathname,

            message: "Please log in to add products to your cart.",
          },
        });

        return;
      }

      setCartError(
        error?.data?.message || error?.message || "Unable to add this product",
      );
    } finally {
      setAdding(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Image fallback
  |--------------------------------------------------------------------------
  */

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.45,

        delay: Math.min(index * 0.05, 0.3),

        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
      }}
      className="group h-full"
    >
      <div
        className="
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-card
          shadow-sm
          transition-shadow
          duration-300
          hover:shadow-lg
        "
      >
        {/* Product image */}

        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link
            to={`/products/${productId}`}
            aria-label={`View ${name}`}
            className="block h-full w-full"
          >
            <img
              src={productImage}
              alt={name}
              loading="lazy"
              onError={handleImageError}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-105
              "
            />
          </Link>

          {/* Discount badge */}

          {numericDiscount > 0 && (
            <div
              className="
                absolute
                left-3
                top-3
                rounded-full
                bg-brand-600
                px-2.5
                py-1
                text-[11px]
                font-bold
                text-white
                shadow-sm
              "
            >
              -{numericDiscount}%
            </div>
          )}

          {/* Out-of-stock overlay */}

          {isOutOfStock && (
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black/45
              "
            >
              <span
                className="
                  rounded-full
                  bg-white/95
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-slate-900
                  shadow-md
                "
              >
                Out of stock
              </span>
            </div>
          )}

          {/* Wishlist button */}

          <button
            type="button"
            onClick={handleWishlist}
            disabled={!productId || wishlistUpdating}
            aria-label={
              wished
                ? `Remove ${name} from wishlist`
                : `Add ${name} to wishlist`
            }
            aria-pressed={wished}
            className={`
              absolute
              right-3
              top-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/70
              bg-white/90
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-200
              hover:scale-105
              hover:bg-white
              disabled:cursor-not-allowed
              disabled:opacity-60
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-brand-500
              focus-visible:ring-offset-2
              dark:border-white/10
              dark:bg-slate-900/90
              dark:hover:bg-slate-900
              ${wished ? "text-red-500" : "text-slate-700 dark:text-slate-200"}
            `}
          >
            {wishlistUpdating ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Heart
                size={17}
                strokeWidth={1.8}
                fill={wished ? "currentColor" : "none"}
              />
            )}
          </button>
        </div>

        {/* Product information */}

        <div className="flex flex-1 flex-col p-3.5 sm:p-4">
          <p
            className="
              mb-1.5
              text-[11px]
              font-medium
              uppercase
              tracking-wider
              text-muted-foreground
            "
          >
            {categoryName}
          </p>

          <Link
            to={`/products/${productId}`}
            className="
              line-clamp-2
              min-h-[2.75rem]
              text-sm
              font-semibold
              leading-5
              text-card-foreground
              transition-colors
              hover:text-brand-600
              dark:hover:text-brand-400
            "
          >
            {name}
          </Link>

          {/* Rating */}

          <div className="mt-2.5 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star size={14} fill="currentColor" className="text-amber-400" />

              <span className="text-xs font-semibold text-card-foreground">
                {numericRating.toFixed(1)}
              </span>
            </div>

            <span className="text-xs text-muted-foreground">
              ({numericReviews.toLocaleString("en-IN")})
            </span>
          </div>

          {/* Price */}

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-base font-bold text-card-foreground sm:text-lg">
              {formatPrice(numericPrice)}
            </span>

            {numericOriginalPrice > numericPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(numericOriginalPrice)}
              </span>
            )}
          </div>

          {/* Controls */}

          <div className="mt-auto pt-4">
            {!isOutOfStock && numericStock <= 5 && (
              <p className="mb-2 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                Only {numericStock} left
              </p>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!productId || isOutOfStock || adding}
              className="
                flex
                min-h-10
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-brand-600
                px-3
                py-2.5
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-brand-700
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand-500
                focus-visible:ring-offset-2
                dark:bg-brand-500
                dark:hover:bg-brand-400
                dark:focus-visible:ring-offset-slate-950
              "
            >
              {adding ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Adding...
                </>
              ) : added ? (
                <>
                  <Check size={15} />
                  Added
                </>
              ) : isOutOfStock ? (
                "Out of stock"
              ) : (
                <>
                  <ShoppingCart size={15} />
                  Add to Cart
                </>
              )}
            </button>

            {cartError && (
              <p
                role="alert"
                className="mt-2 text-xs font-medium text-red-600 dark:text-red-400"
              >
                {cartError}
              </p>
            )}

            {wishlistError && (
              <p
                role="alert"
                className="mt-2 text-xs font-medium text-red-600 dark:text-red-400"
              >
                {wishlistError}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
