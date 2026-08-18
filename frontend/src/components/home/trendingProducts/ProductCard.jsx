import { useState } from "react";
import { motion } from "motion/react";
import { Check, Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();

  const [isAdded, setIsAdded] = useState(false);

  /* =========================
     WISHLIST
  ========================== */

  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("🔥 PRODUCT CARD HEART CLICK");

    console.log("🔥 PRODUCT:", product);

    console.log("🔥 PRODUCT ID:", product.id);

    console.log("🔥 BEFORE TOGGLE:", isWishlisted);

    toggleWishlist(product);

    console.log("🔥 toggleWishlist() CALLED");
  };

  /* =========================
     ADD TO CART
  ========================== */

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("🛒 ADD TO CART:", product.id);

    addToCart(product);

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  /* =========================
     PRODUCT URL
  ========================== */

  const productUrl = `/products/${product.id}`;

  /* =========================
     STOCK
  ========================== */

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

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
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        transition-shadow
        duration-300
        hover:shadow-xl
        hover:shadow-slate-900/5
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:shadow-black/20
      "
    >
      {/* =========================
          PRODUCT IMAGE
      ========================== */}

      <Link
        to={productUrl}
        aria-label={`View ${product.name}`}
        className="block"
      >
        <div
          className="
            relative
            aspect-square
            overflow-hidden
            bg-slate-100
            dark:bg-slate-800
          "
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="
              h-full
              w-full
              object-contain
              p-5
              transition-transform
              duration-500
              ease-out
              group-hover:scale-105
            "
          />

          {/* Discount */}

          {product.discount && (
            <span
              className="
                absolute
                left-3
                top-3
                rounded-full
                bg-red-500
                px-2.5
                py-1
                text-[10px]
                font-bold
                text-white
              "
            >
              {product.discount}% OFF
            </span>
          )}

          {/* Out of Stock */}

          {isOutOfStock && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black/35
                backdrop-blur-[1px]
              "
            >
              <span
                className="
                  rounded-full
                  bg-white/95
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  text-slate-900
                "
              >
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* =================================================
          TEMPORARY DEBUG WISHLIST BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          console.log("❤️❤️❤️ HEART CLICKED ❤️❤️❤️");
          console.log("PRODUCT:", product);
          console.log("PRODUCT ID:", product?.id);

          toggleWishlist(product);
        }}
        className="
    absolute
    right-3
    top-3
    z-[9999]
    flex
    h-12
    w-12
    cursor-pointer
    items-center
    justify-center
    rounded-full
    bg-red-500
    text-white
    shadow-xl
  "
      >
        <Heart size={22} />
      </button>

      {/* =================================================
          PRODUCT CONTENT
      ================================================= */}

      <div className="p-4">
        {/* Category */}

        <p
          className="
            text-[11px]
            font-medium
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          {product.category}
        </p>

        {/* Product Name */}

        <Link to={productUrl} className="block">
          <h3
            className="
              mt-1
              min-h-[40px]
              line-clamp-2
              text-sm
              font-semibold
              leading-5
              text-slate-900
              transition-colors
              hover:text-emerald-600
              dark:text-white
              dark:hover:text-emerald-400
            "
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}

        <div
          className="
            mt-2
            flex
            items-center
            gap-1.5
          "
        >
          <div
            className="
              flex
              items-center
              gap-0.5
            "
          >
            <Star
              size={13}
              className="
                fill-amber-400
                text-amber-400
              "
            />

            <span
              className="
                text-xs
                font-semibold
                text-slate-700
                dark:text-slate-300
              "
            >
              {product.rating}
            </span>
          </div>

          <span
            className="
              text-xs
              text-slate-400
            "
          >
            ({product.reviews})
          </span>
        </div>

        {/* Price */}

        <div
          className="
            mt-3
            flex
            items-end
            gap-2
          "
        >
          <span
            className="
              text-lg
              font-bold
              text-slate-950
              dark:text-white
            "
          >
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          {product.originalPrice && (
            <span
              className="
                text-xs
                text-slate-400
                line-through
              "
            >
              ₹{Number(product.originalPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add To Cart */}

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`
            mt-4
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            text-xs
            font-semibold
            transition-all
            duration-200
            active:scale-[0.98]

            ${
              isOutOfStock
                ? `
                  cursor-not-allowed
                  bg-slate-200
                  text-slate-400
                  dark:bg-slate-800
                  dark:text-slate-600
                `
                : isAdded
                  ? `
                    bg-emerald-600
                    text-white
                    dark:bg-emerald-500
                  `
                  : `
                    bg-slate-950
                    text-white
                    hover:bg-emerald-600
                    dark:bg-white
                    dark:text-slate-950
                    dark:hover:bg-emerald-500
                    dark:hover:text-white
                  `
            }
          `}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : isAdded ? (
            <>
              <Check size={15} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={15} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
