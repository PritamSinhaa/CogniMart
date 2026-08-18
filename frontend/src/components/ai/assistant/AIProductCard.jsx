import { Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const {
    _id,
    id,
    name,
    title,
    image,
    images,
    price,
    originalPrice,
    rating,
    reviewCount,
    discount,
    reason,
  } = product;

  const productId = _id || id;
  const productName = name || title;
  const productImage = image || images?.[0];

  const handleViewProduct = () => {
    if (!productId) return;

    navigate(`/products/${productId}`);
  };

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-emerald-200
        hover:shadow-lg
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-emerald-900
      "
    >
      {/* Image */}
      <button
        type="button"
        onClick={handleViewProduct}
        className="
          relative
          block
          aspect-square
          w-full
          overflow-hidden
          bg-slate-100
          dark:bg-slate-800
        "
      >
        {productImage ? (
          <img
            src={productImage}
            alt={productName}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}

        {/* Discount */}
        {discount && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-emerald-600
              px-2.5
              py-1
              text-[11px]
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
          onClick={(event) => {
            event.stopPropagation();
          }}
          aria-label="Add to wishlist"
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
            bg-white/90
            text-slate-500
            shadow-sm
            backdrop-blur
            transition-colors
            hover:text-red-500
            dark:bg-slate-950/80
            dark:text-slate-400
          "
        >
          <Heart size={16} />
        </button>
      </button>

      {/* Content */}
      <div className="p-4">
        {/* AI reason */}
        {reason && (
          <div
            className="
              mb-3
              flex
              items-start
              gap-2
              rounded-xl
              bg-emerald-50
              px-3
              py-2
              text-xs
              leading-5
              text-emerald-700
              dark:bg-emerald-950/40
              dark:text-emerald-400
            "
          >
            <span className="mt-0.5 shrink-0">✦</span>

            <span>{reason}</span>
          </div>
        )}

        {/* Product name */}
        <button
          type="button"
          onClick={handleViewProduct}
          className="
            line-clamp-2
            text-left
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
          {productName}
        </button>

        {/* Rating */}
        {rating !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" />

            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {rating}
            </span>

            {reviewCount !== undefined && (
              <span className="text-xs text-slate-400">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-slate-950 dark:text-white">
            ₹{Number(price || 0).toLocaleString("en-IN")}
          </span>

          {originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              ₹{Number(originalPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-emerald-600
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition-all
            hover:bg-emerald-700
            active:scale-[0.98]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-emerald-500
            focus-visible:ring-offset-2
          "
        >
          <ShoppingCart size={16} />
          Add to cart
        </button>
      </div>
    </article>
  );
}
