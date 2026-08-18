import { Check, ShoppingCart, Sparkles, Star, Trophy } from "lucide-react";

function formatPrice(price) {
  if (typeof price !== "number") {
    return price;
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

function Rating({ rating = 0, reviewCount }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        <Star size={13} className="fill-emerald-500 text-emerald-500" />

        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {rating}
        </span>
      </div>

      {reviewCount !== undefined && (
        <span className="text-[10px] text-slate-400">
          ({Number(reviewCount).toLocaleString("en-IN")})
        </span>
      )}
    </div>
  );
}

function ComparisonCard({ product, onAddToCart }) {
  const {
    name,
    image,
    price,
    originalPrice,
    rating,
    reviewCount,
    bestFor,
    aiVerdict,
    recommended = false,
  } = product;

  return (
    <article
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        bg-white
        shadow-sm
        dark:bg-slate-900
        ${
          recommended
            ? `
              border-emerald-500
              shadow-emerald-100
              dark:border-emerald-500
              dark:shadow-none
            `
            : `
              border-slate-200
              dark:border-slate-800
            `
        }
      `}
    >
      {/* ============================================================
          AI RECOMMENDED BADGE
      ============================================================ */}

      {recommended && (
        <div
          className="
            flex
            items-center
            justify-center
            gap-1.5
            bg-emerald-600
            px-3
            py-2
            text-[10px]
            font-bold
            text-white
          "
        >
          <Trophy size={12} />
          AI RECOMMENDED
        </div>
      )}

      {/* ============================================================
          IMAGE
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
          "
        />
      </div>

      {/* ============================================================
          CONTENT
      ============================================================ */}

      <div className="p-4">
        <h3
          className="
            min-h-10
            text-sm
            font-bold
            leading-5
            text-slate-900
            dark:text-white
          "
        >
          {name}
        </h3>

        {/* Rating */}

        <div className="mt-2">
          <Rating rating={rating} reviewCount={reviewCount} />
        </div>

        {/* Price */}

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span
            className="
              text-lg
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

        {/* Best for */}

        {bestFor && (
          <div className="mt-4">
            <p
              className="
                text-[9px]
                font-bold
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
              {bestFor}
            </p>
          </div>
        )}

        {/* AI verdict */}

        {aiVerdict && (
          <div
            className="
              mt-4
              rounded-xl
              bg-emerald-50
              p-3
              dark:bg-emerald-950/30
            "
          >
            <div className="flex items-start gap-2">
              <Sparkles
                size={13}
                className="
                  mt-0.5
                  shrink-0
                  text-emerald-600
                  dark:text-emerald-400
                "
              />

              <div>
                <p
                  className="
                    text-[9px]
                    font-bold
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
                    leading-4
                    text-emerald-800
                    dark:text-emerald-300
                  "
                >
                  {aiVerdict}
                </p>
              </div>
            </div>
          </div>
        )}

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
            px-3
            py-2.5
            text-xs
            font-semibold
            text-white
            transition-colors
            hover:bg-emerald-700
            active:bg-emerald-800
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

export default function AIProductComparison({
  products = [],
  title = "AI Product Comparison",
  description = "Here's how these options compare based on your request.",
  onAddToCart,
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
        <Sparkles size={22} className="mx-auto text-emerald-500" />

        <p
          className="
            mt-3
            text-sm
            font-semibold
            text-slate-800
            dark:text-slate-200
          "
        >
          Nothing to compare
        </p>

        <p
          className="
            mt-1
            text-xs
            text-slate-400
          "
        >
          Ask CogniMart AI to compare two or more products.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* ============================================================
          HEADER
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
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {description}
          </p>
        )}
      </div>

      {/* ============================================================
          QUICK COMPARISON
      ============================================================ */}

      <div
        className="
          mb-4
          flex
          items-center
          gap-2
          overflow-x-auto
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          py-2.5
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <span
          className="
            shrink-0
            text-[9px]
            font-bold
            uppercase
            tracking-wider
            text-slate-400
          "
        >
          Compared
        </span>

        <span
          className="
            shrink-0
            rounded-full
            bg-emerald-50
            px-2.5
            py-1
            text-[10px]
            font-semibold
            text-emerald-700
            dark:bg-emerald-950/50
            dark:text-emerald-400
          "
        >
          {products.length} products
        </span>
      </div>

      {/* ============================================================
          PRODUCT GRID
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
          <ComparisonCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* ============================================================
          AI NOTE
      ============================================================ */}

      <div
        className="
          mt-4
          flex
          items-start
          gap-2
          rounded-xl
          border
          border-emerald-100
          bg-emerald-50/60
          px-3
          py-3
          dark:border-emerald-900/50
          dark:bg-emerald-950/20
        "
      >
        <Check
          size={13}
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
          The AI recommendation is based on the product information available to
          CogniMart and your current request. Consider your own preferences
          before making a purchase.
        </p>
      </div>
    </section>
  );
}
