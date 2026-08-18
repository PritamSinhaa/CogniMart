import {
  Check,
  ShoppingCart,
  Star,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIProductComparison({ products = [], onAddToCart }) {
  const navigate = useNavigate();

  if (!products.length) {
    return null;
  }

  const handleViewProduct = (product) => {
    if (!product?.id) return;

    navigate(`/products/${product.id}`);
  };

  const formatPrice = (price) => {
    if (typeof price !== "number") {
      return "—";
    }

    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <section
      className="
        mt-3
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* ============================================================ */}
      {/* Header                                                       */}
      {/* ============================================================ */}

      <div
        className="
          border-b
          border-slate-200
          p-4
          sm:p-5
          dark:border-slate-800
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600
              dark:bg-emerald-950/50
              dark:text-emerald-400
            "
          >
            <Sparkles size={18} />
          </div>

          <div className="min-w-0">
            <h3
              className="
                text-sm
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              AI Product Comparison
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              Compare these products based on price, rating, value, and what
              they are best for.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Mobile cards                                                  */}
      {/* ============================================================ */}

      <div className="block md:hidden">
        <div
          className="
            flex
            snap-x
            snap-mandatory
            gap-4
            overflow-x-auto
            p-4
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {products.map((product) => (
            <article
              key={product.id}
              className="
                relative
                w-[82vw]
                max-w-[310px]
                shrink-0
                snap-start
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                dark:border-slate-700
                dark:bg-slate-950
              "
            >
              {/* Recommended badge */}

              {product.recommended && (
                <div
                  className="
                    absolute
                    left-3
                    top-3
                    z-10
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-emerald-600
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  <Sparkles size={11} />
                  AI Pick
                </div>
              )}

              {/* Image */}

              <button
                type="button"
                onClick={() => handleViewProduct(product)}
                className="
                  block
                  w-full
                  overflow-hidden
                  rounded-xl
                  bg-slate-100
                  dark:bg-slate-900
                "
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    aspect-square
                    w-full
                    object-contain
                    p-5
                    transition-transform
                    duration-300
                    hover:scale-105
                  "
                />
              </button>

              {/* Product name */}

              <h4
                className="
                  mt-4
                  line-clamp-2
                  min-h-10
                  text-sm
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {product.name}
              </h4>

              {/* Rating */}

              <div className="mt-2 flex items-center gap-2">
                <div
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-md
                    bg-emerald-50
                    px-1.5
                    py-1
                    text-xs
                    font-semibold
                    text-emerald-700
                    dark:bg-emerald-950/50
                    dark:text-emerald-400
                  "
                >
                  <Star size={11} className="fill-current" />

                  {product.rating}
                </div>

                <span className="text-[11px] text-slate-400">
                  {product.reviewCount?.toLocaleString("en-IN")} reviews
                </span>
              </div>

              {/* Price */}

              <div className="mt-3 flex items-end gap-2">
                <span
                  className="
                    text-lg
                    font-bold
                    text-slate-950
                    dark:text-white
                  "
                >
                  {formatPrice(product.price)}
                </span>

                {product.originalPrice && (
                  <span
                    className="
                      text-xs
                      text-slate-400
                      line-through
                    "
                  >
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Best for */}

              {product.bestFor && (
                <div className="mt-3">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Best for
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    {product.bestFor}
                  </p>
                </div>
              )}

              {/* AI verdict */}

              {product.aiVerdict && (
                <div
                  className="
                    mt-3
                    rounded-xl
                    bg-emerald-50
                    p-3
                    dark:bg-emerald-950/30
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  >
                    AI verdict
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-slate-800
                      dark:text-slate-200
                    "
                  >
                    {product.aiVerdict}
                  </p>
                </div>
              )}

              {/* Actions */}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleViewProduct(product)}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    py-2.5
                    text-xs
                    font-semibold
                    text-slate-700
                    transition-colors
                    hover:border-emerald-300
                    hover:text-emerald-700
                    dark:border-slate-700
                    dark:text-slate-300
                  "
                >
                  <ExternalLink size={13} />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => onAddToCart?.(product)}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-xl
                    bg-emerald-600
                    px-3
                    py-2.5
                    text-xs
                    font-semibold
                    text-white
                    transition-colors
                    hover:bg-emerald-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500/30
                  "
                >
                  <ShoppingCart size={13} />
                  Add
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile scroll hint */}

        {products.length > 1 && (
          <p
            className="
              px-4
              pb-4
              text-center
              text-[10px]
              text-slate-400
            "
          >
            Swipe to compare more products
          </p>
        )}
      </div>

      {/* ============================================================ */}
      {/* Desktop comparison table                                     */}
      {/* ============================================================ */}

      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th
                  className="
                    w-36
                    border-b
                    border-r
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:text-slate-400
                  "
                >
                  Comparison
                </th>

                {products.map((product) => (
                  <th
                    key={product.id}
                    className="
                      relative
                      min-w-[190px]
                      border-b
                      border-slate-200
                      p-4
                      text-left
                      align-top
                      dark:border-slate-800
                    "
                  >
                    {product.recommended && (
                      <span
                        className="
                          absolute
                          right-3
                          top-3
                          rounded-full
                          bg-emerald-600
                          px-2
                          py-1
                          text-[9px]
                          font-bold
                          text-white
                        "
                      >
                        AI Pick
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleViewProduct(product)}
                      className="
                        overflow-hidden
                        rounded-xl
                        bg-slate-100
                        dark:bg-slate-950
                      "
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="
                          h-28
                          w-28
                          object-contain
                          p-2
                          transition-transform
                          hover:scale-105
                        "
                      />
                    </button>

                    <p
                      className="
                        mt-3
                        line-clamp-2
                        text-xs
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {product.name}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Price */}

              <tr>
                <td
                  className="
                    border-b
                    border-r
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-xs
                    font-semibold
                    text-slate-500
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:text-slate-400
                  "
                >
                  Price
                </td>

                {products.map((product) => (
                  <td
                    key={product.id}
                    className="
                      border-b
                      border-slate-200
                      p-4
                      dark:border-slate-800
                    "
                  >
                    <p className="text-sm font-bold text-slate-950 dark:text-white">
                      {formatPrice(product.price)}
                    </p>

                    {product.originalPrice && (
                      <p className="mt-0.5 text-[10px] text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating */}

              <tr>
                <td
                  className="
                    border-b
                    border-r
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-xs
                    font-semibold
                    text-slate-500
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:text-slate-400
                  "
                >
                  Rating
                </td>

                {products.map((product) => (
                  <td
                    key={product.id}
                    className="
                      border-b
                      border-slate-200
                      p-4
                      dark:border-slate-800
                    "
                  >
                    <div className="flex items-center gap-1">
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />

                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {product.rating}
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {product.reviewCount?.toLocaleString("en-IN")} reviews
                    </p>
                  </td>
                ))}
              </tr>

              {/* Best For */}

              <tr>
                <td
                  className="
                    border-b
                    border-r
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-xs
                    font-semibold
                    text-slate-500
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:text-slate-400
                  "
                >
                  Best for
                </td>

                {products.map((product) => (
                  <td
                    key={product.id}
                    className="
                      border-b
                      border-slate-200
                      p-4
                      text-xs
                      font-semibold
                      text-slate-700
                      dark:border-slate-800
                      dark:text-slate-300
                    "
                  >
                    {product.bestFor || "—"}
                  </td>
                ))}
              </tr>

              {/* AI Verdict */}

              <tr>
                <td
                  className="
                    border-b
                    border-r
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-xs
                    font-semibold
                    text-slate-500
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:text-slate-400
                  "
                >
                  AI verdict
                </td>

                {products.map((product) => (
                  <td
                    key={product.id}
                    className="
                      border-b
                      border-slate-200
                      p-4
                      dark:border-slate-800
                    "
                  >
                    <div className="flex items-start gap-2">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />

                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {product.aiVerdict || "Good option"}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Actions */}

              <tr>
                <td
                  className="
                    border-r
                    border-slate-200
                    bg-slate-50
                    p-4
                    dark:border-slate-800
                    dark:bg-slate-950
                  "
                />

                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewProduct(product)}
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-1.5
                          rounded-xl
                          border
                          border-slate-200
                          px-3
                          py-2.5
                          text-xs
                          font-semibold
                          text-slate-700
                          transition-colors
                          hover:border-emerald-300
                          hover:text-emerald-700
                          dark:border-slate-700
                          dark:text-slate-300
                        "
                      >
                        <ExternalLink size={13} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => onAddToCart?.(product)}
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-1.5
                          rounded-xl
                          bg-emerald-600
                          px-3
                          py-2.5
                          text-xs
                          font-semibold
                          text-white
                          transition-colors
                          hover:bg-emerald-700
                          focus:outline-none
                          focus:ring-2
                          focus:ring-emerald-500/30
                        "
                      >
                        <ShoppingCart size={13} />
                        Add
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
