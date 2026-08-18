import { Heart, ShoppingCart, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useState } from "react";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

export default function ProductCard({
  product,
  index = 0,
}) {
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) {
    return null;
  }

  const {
    id,
    name,
    category,
    price,
    originalPrice,
    discount,
    rating = 0,
    reviews = 0,
    image,
    stock = true,
  } = product;

  const wished = isInWishlist(id);

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    toggleWishlist(product);
  };

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!stock || isAdding) {
      return;
    }

    setIsAdding(true);

    addToCart(product);

    setTimeout(() => {
      setIsAdding(false);
    }, 800);
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
        delay: index * 0.05,
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
        {/* =================================================
            PRODUCT IMAGE
        ================================================= */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link
            to={`/products/${id}`}
            aria-label={`View ${name}`}
            className="block h-full w-full"
          >
            <img
              src={image}
              alt={name}
              loading="lazy"
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

          {/* Discount */}
          {discount > 0 && (
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
              -{discount}%
            </div>
          )}

          {/* Out of stock */}
          {!stock && (
            <div
              className="
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

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              wished
                ? `Remove ${name} from wishlist`
                : `Add ${name} to wishlist`
            }
            aria-pressed={wished}
            className="
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
              text-slate-700
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-200
              hover:scale-105
              hover:bg-white
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-brand-500
              focus-visible:ring-offset-2
              dark:border-white/10
              dark:bg-slate-900/90
              dark:text-slate-200
              dark:hover:bg-slate-900
            "
          >
            <Heart
              size={17}
              strokeWidth={1.8}
              fill={wished ? "currentColor" : "none"}
              className={
                wished
                  ? "text-red-500"
                  : "text-current"
              }
            />
          </button>
        </div>

        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}
        <div className="flex flex-1 flex-col p-3.5 sm:p-4">
          {/* Category */}
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
            {category}
          </p>

          {/* Product name */}
          <Link
            to={`/products/${id}`}
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
          <div
            className="
              mt-2.5
              flex
              items-center
              gap-1.5
            "
          >
            <div className="flex items-center gap-0.5">
              <Star
                size={14}
                fill="currentColor"
                className="text-amber-400"
              />

              <span className="text-xs font-semibold text-card-foreground">
                {rating.toFixed(1)}
              </span>
            </div>

            <span className="text-xs text-muted-foreground">
              ({reviews.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base font-bold text-card-foreground sm:text-lg">
              ₹{price.toLocaleString("en-IN")}
            </span>

            {originalPrice && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* =================================================
              ADD TO CART
          ================================================= */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!stock || isAdding}
            className="
              mt-4
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
            {isAdding ? (
              <>
                <Check size={15} />
                Added
              </>
            ) : !stock ? (
              "Out of stock"
            ) : (
              <>
                <ShoppingCart size={15} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}