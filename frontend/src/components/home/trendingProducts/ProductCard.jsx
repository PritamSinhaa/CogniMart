import { motion } from "motion/react";
import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../../context/CartContext";

export default function ProductCard({
  product,
  index = 0,
}) {
  const { addToCart } = useCart();

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(product);
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Wishlist functionality will be added later.
    console.log("Wishlist:", product);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
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
        to={`/products/${product.id}`}
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

          {/* Discount Badge */}

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
        </div>
      </Link>

      {/* =========================
          WISHLIST BUTTON
      ========================== */}

      <button
        type="button"
        aria-label={`Add ${product.name} to wishlist`}
        onClick={handleWishlist}
        className="
          absolute
          right-3
          top-3
          z-10
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          bg-white/90
          text-slate-500
          shadow-sm
          backdrop-blur-sm
          transition-all
          duration-200
          hover:scale-105
          hover:text-red-500
          dark:border-slate-700
          dark:bg-slate-900/90
          dark:text-slate-400
          dark:hover:text-red-400
        "
      >
        <Heart size={16} />
      </button>

      {/* =========================
          PRODUCT CONTENT
      ========================== */}

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

        <Link
          to={`/products/${product.id}`}
          className="block"
        >
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

        {/* =========================
            RATING
        ========================== */}

        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
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

          <span className="text-xs text-slate-400">
            ({product.reviews})
          </span>
        </div>

        {/* =========================
            PRICE
        ========================== */}

        <div className="mt-3 flex items-end gap-2">
          <span
            className="
              text-lg
              font-bold
              text-slate-950
              dark:text-white
            "
          >
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.originalPrice && (
            <span
              className="
                text-xs
                text-slate-400
                line-through
              "
            >
              ₹
              {product.originalPrice.toLocaleString(
                "en-IN",
              )}
            </span>
          )}
        </div>

        {/* =========================
            ADD TO CART
        ========================== */}

        <button
          type="button"
          onClick={handleAddToCart}
          className="
            mt-4
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-950
            text-xs
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-emerald-600
            active:scale-[0.98]
            dark:bg-white
            dark:text-slate-950
            dark:hover:bg-emerald-500
            dark:hover:text-white
          "
        >
          <ShoppingCart size={15} />

          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}