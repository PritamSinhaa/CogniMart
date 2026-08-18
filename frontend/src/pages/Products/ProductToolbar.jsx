import { ArrowDownUp, LayoutGrid } from "lucide-react";

export default function ProductToolbar({
  productCount,
  sortBy,
  setSortBy,
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* Product count */}

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {productCount}
        </span>{" "}
        {productCount === 1 ? "product" : "products"}
      </p>

      {/* Controls */}

      <div className="flex items-center gap-2">
        {/* View button */}

        <button
          type="button"
          aria-label="Grid view"
          className="
            flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            text-sm
            text-slate-600
            transition-colors
            hover:border-emerald-300
            hover:text-emerald-600
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-slate-300
          "
        >
          <LayoutGrid size={15} />

          <span className="hidden sm:inline">
            Grid
          </span>
        </button>

        {/* Sort */}

        <div className="relative">
          <ArrowDownUp
            size={15}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              z-10
              -translate-y-1/2
              text-slate-400
            "
          />

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            aria-label="Sort products"
            className="
              h-10
              cursor-pointer
              appearance-none
              rounded-xl
              border
              border-slate-200
              bg-white
              pl-9
              pr-9
              text-sm
              text-slate-600
              outline-none
              transition-colors
              hover:border-emerald-300
              focus:border-emerald-500
              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-300
            "
          >
            <option value="featured">
              Featured
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>

            <option value="newest">
              Newest
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}