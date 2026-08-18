import AIIcon from "../shared/AIIcon";
import AIProductCard from "./AIProductCard";

export default function AIProductResults({
  products = [],
  title = "Recommended for you",
  description = "Based on what you're looking for, these products may be a good fit.",
  onAddToCart,
  onViewAll,
}) {
  if (!products.length) {
    return null;
  }

  return (
    <div className="mt-4 w-full">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-emerald-50
              dark:bg-emerald-950/50
            "
          >
            <AIIcon size={15} />
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>

        {description && (
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {/* Products */}
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
          <AIProductCard
            key={product._id || product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* View all */}
      {onViewAll && (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onViewAll}
            className="
              text-sm
              font-semibold
              text-emerald-600
              transition-colors
              hover:text-emerald-700
              dark:text-emerald-400
              dark:hover:text-emerald-300
            "
          >
            View all recommendations →
          </button>
        </div>
      )}
    </div>
  );
}
