import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react";

function formatPrice(price) {
  if (typeof price !== "number") {
    return price;
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

function ProductCard({ product, onAddToCart, onToggleWishlist }) {
  const {
    name,
    image,
    price,
    originalPrice,
    rating,
    reviewCount,
    discount,
    reason,
    isWishlisted = false,
  } = product;

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* ============================================================
          PRODUCT IMAGE
      ============================================================ */}

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
          src={image}
          alt={name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />

        {/* Discount */}

        {discount > 0 && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-emerald-600
              px-2
              py-1
              text-[10px]
              font-bold
              text-white
            "
          >
            {discount}% OFF
          </span>
        )}

        {/* Wishlist */}

        <button
          type="button"
          onClick={() => onToggleWishlist?.(product, !isWishlisted)}
          aria-label={
            isWishlisted
              ? `Remove ${name} from wishlist`
              : `Add ${name} to wishlist`
          }
          className="
            absolute
            right-3
            top-3
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-white/70
            bg-white/90
            text-slate-600
            shadow-sm
            backdrop-blur-sm
            transition-colors
            hover:text-emerald-600
            dark:bg-slate-900/90
            dark:text-slate-300
            dark:hover:text-emerald-400
          "
        >
          <Heart
            size={15}
            className={isWishlisted ? "fill-emerald-500 text-emerald-500" : ""}
          />
        </button>
      </div>

      {/* ============================================================
          PRODUCT CONTENT
      ============================================================ */}

      <div className="p-3.5 sm:p-4">
        <h3
          className="
            line-clamp-2
            min-h-10
            text-sm
            font-semibold
            leading-5
            text-slate-900
            dark:text-white
          "
        >
          {name}
        </h3>

        {/* Rating */}

        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star
              size={13}
              className="
                fill-emerald-500
                text-emerald-500
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
              {rating}
            </span>
          </div>

          {reviewCount !== undefined && (
            <span
              className="
                text-[10px]
                text-slate-400
              "
            >
              ({reviewCount.toLocaleString("en-IN")})
            </span>
          )}
        </div>

        {/* Price */}

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span
            className="
              text-base
              font-bold
              text-slate-950
              dark:text-white
            "
          >
            {formatPrice(price)}
          </span>

          {originalPrice && (
            <span
              className="
                text-[11px]
                text-slate-400
                line-through
              "
            >
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* AI reason */}

        {reason && (
          <div
            className="
              mt-3
              rounded-xl
              bg-emerald-50
              p-2.5
              dark:bg-emerald-950/30
            "
          >
            <div className="flex items-start gap-1.5">
              <Sparkles
                size={12}
                className="
                  mt-0.5
                  shrink-0
                  text-emerald-600
                  dark:text-emerald-400
                "
              />

              <p
                className="
                  text-[10px]
                  leading-4
                  text-emerald-800
                  dark:text-emerald-300
                "
              >
                {reason}
              </p>
            </div>
          </div>
        )}

        {/* Add to cart */}

        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="
            mt-3
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-emerald-600
            px-3
            py-2.5
            text-xs
            font-semibold
            text-white
            transition-colors
            hover:bg-emerald-700
            active:bg-emerald-800
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:hover:bg-emerald-500
          "
        >
          <ShoppingCart size={14} />
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default function AIProductResults({
  products = [],
  title = "Recommended for you",
  description,
  onAddToCart,
  onToggleWishlist,
}) {
  if (!products.length) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-white
          p-8
          text-center
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <Sparkles
          size={22}
          className="
            mx-auto
            text-emerald-500
          "
        />

        <p
          className="
            mt-3
            text-sm
            font-semibold
            text-slate-800
            dark:text-slate-200
          "
        >
          No products found
        </p>

        <p
          className="
            mt-1
            text-xs
            text-slate-400
          "
        >
          Try describing what you're looking for in a little more detail.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* ============================================================
          SECTION HEADER
      ============================================================ */}

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Sparkles
            size={16}
            className="
              text-emerald-600
              dark:text-emerald-400
            "
          />

          <h3
            className="
              text-sm
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {title}
          </h3>
        </div>

        {description && (
          <p
            className="
              mt-1
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            {description}
          </p>
        )}
      </div>

      {/* ============================================================
          PRODUCTS
      ============================================================ */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}
