import { Star } from "lucide-react";

const categories = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
  "Sports",
  "Gaming",
  "Wearables",
  "Accessories",
];

const priceRanges = [
  {
    label: "All Prices",
    value: "all",
  },
  {
    label: "Under ₹1,000",
    value: "under-1000",
  },
  {
    label: "₹1,000 – ₹5,000",
    value: "1000-5000",
  },
  {
    label: "₹5,000 – ₹10,000",
    value: "5000-10000",
  },
  {
    label: "₹10,000 – ₹25,000",
    value: "10000-25000",
  },
  {
    label: "Above ₹25,000",
    value: "above-25000",
  },
];

const ratings = [4, 3, 2];

export default function ProductFilters({
  filters,
  updateFilter,
  clearFilters,
}) {
  return (
    <div className="sticky top-24">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Filters
        </h2>

        <button
          type="button"
          onClick={clearFilters}
          className="
            text-xs
            font-medium
            text-emerald-600
            transition-colors
            hover:text-emerald-700
            dark:text-emerald-400
          "
        >
          Clear all
        </button>
      </div>

      {/* Category */}

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Category
        </h3>

        <div className="mt-4 space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="
                flex
                cursor-pointer
                items-center
                gap-3
                text-sm
                text-slate-600
                dark:text-slate-400
              "
            >
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={() =>
                  updateFilter("category", category)
                }
                className="
                  h-4
                  w-4
                  cursor-pointer
                  accent-emerald-600
                "
              />

              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="my-6 h-px bg-slate-200 dark:bg-slate-800" />

      {/* Price */}

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Price
        </h3>

        <div className="mt-4 space-y-3">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="
                flex
                cursor-pointer
                items-center
                gap-3
                text-sm
                text-slate-600
                dark:text-slate-400
              "
            >
              <input
                type="radio"
                name="price"
                value={range.value}
                checked={filters.price === range.value}
                onChange={() =>
                  updateFilter("price", range.value)
                }
                className="
                  h-4
                  w-4
                  cursor-pointer
                  accent-emerald-600
                "
              />

              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="my-6 h-px bg-slate-200 dark:bg-slate-800" />

      {/* Rating */}

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Customer Rating
        </h3>

        <div className="mt-4 space-y-3">
          {ratings.map((rating) => (
            <label
              key={rating}
              className="
                flex
                cursor-pointer
                items-center
                gap-2
                text-sm
              "
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={() =>
                  updateFilter("rating", rating)
                }
                className="
                  h-4
                  w-4
                  cursor-pointer
                  accent-emerald-600
                "
              />

              <span className="flex items-center">
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <Star
                      key={index}
                      size={13}
                      className={
                        index < rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }
                    />
                  ),
                )}
              </span>

              <span className="text-slate-500 dark:text-slate-400">
                & up
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="my-6 h-px bg-slate-200 dark:bg-slate-800" />

      {/* Availability */}

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Availability
        </h3>

        <label
          className="
            mt-4
            flex
            cursor-pointer
            items-center
            gap-3
            text-sm
            text-slate-600
            dark:text-slate-400
          "
        >
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(event) =>
              updateFilter(
                "inStock",
                event.target.checked,
              )
            }
            className="
              h-4
              w-4
              cursor-pointer
              rounded
              accent-emerald-600
            "
          />

          In stock only
        </label>
      </div>
    </div>
  );
}