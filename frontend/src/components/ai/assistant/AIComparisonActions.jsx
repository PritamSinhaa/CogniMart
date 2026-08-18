import {
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

export default function AIComparisonActions({
  products = [],
  onAddToCart,
  onViewProduct,
}) {
  return (
    <div
      className="
        grid
        gap-3
        border-t
        border-slate-200
        p-4
        dark:border-slate-800
      "
      style={{
        gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))`,
      }}
    >
      {products.map((product) => (
        <div
          key={product._id || product.id}
          className="min-w-0"
        >
          <button
            type="button"
            onClick={() => onViewProduct?.(product)}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-xs
              font-semibold
              text-slate-700
              transition-colors
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-700
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:border-emerald-900
              dark:hover:bg-emerald-950/30
              dark:hover:text-emerald-400
            "
          >
            View
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="
              mt-2
              flex
              w-full
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
              active:scale-[0.98]
            "
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      ))}
    </div>
  );
}