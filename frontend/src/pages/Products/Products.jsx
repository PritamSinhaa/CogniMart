import { useMemo, useState } from "react";
import {
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import {
  useSearchParams,
} from "react-router-dom";

import ProductCard from "../../components/home/trendingProducts/ProductCard";
import ProductFilters from "./ProductFilters";
import ProductToolbar from "./ProductToolbar";
import MobileFilterDrawer from "./MobileFilterDrawer";

import { products } from "../../data/products";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /*
   * Search comes from the URL.
   *
   * Example:
   * /products?search=iphone
   */
  const searchQuery = searchParams.get("search") || "";

  const [filters, setFilters] = useState({
    category: "All Categories",
    price: "all",
    rating: 0,
    inStock: false,
  });

  const [sortBy, setSortBy] = useState("featured");

  /* =========================
     SEARCH
  ========================== */

  const updateSearch = (value) => {
    const trimmedValue = value.trim();

    const nextParams = new URLSearchParams(searchParams);

    if (trimmedValue) {
      nextParams.set("search", trimmedValue);
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams);
  };

  const clearSearch = () => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("search");

    setSearchParams(nextParams);
  };

  /* =========================
     FILTERS
  ========================== */

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "All Categories",
      price: "all",
      rating: 0,
      inStock: false,
    });
  };

  /* =========================
     FILTER PRODUCTS
  ========================== */

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      /* Search */

      if (query) {
        const searchableText = [
          product.name,
          product.category,
          product.description,
          ...(product.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      /* Category */

      if (
        filters.category !== "All Categories" &&
        product.category !== filters.category
      ) {
        return false;
      }

      /* Price */

      if (
        filters.price === "under-1000" &&
        product.price >= 1000
      ) {
        return false;
      }

      if (
        filters.price === "1000-5000" &&
        (product.price < 1000 ||
          product.price > 5000)
      ) {
        return false;
      }

      if (
        filters.price === "5000-10000" &&
        (product.price < 5000 ||
          product.price > 10000)
      ) {
        return false;
      }

      if (
        filters.price === "10000-25000" &&
        (product.price < 10000 ||
          product.price > 25000)
      ) {
        return false;
      }

      if (
        filters.price === "above-25000" &&
        product.price <= 25000
      ) {
        return false;
      }

      /* Rating */

      if (
        filters.rating > 0 &&
        product.rating < filters.rating
      ) {
        return false;
      }

      /* Stock */

      if (
        filters.inStock &&
        product.stock === 0
      ) {
        return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  /* =========================
     SORT
  ========================== */

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    switch (sortBy) {
      case "price-low":
        return result.sort(
          (a, b) => a.price - b.price,
        );

      case "price-high":
        return result.sort(
          (a, b) => b.price - a.price,
        );

      case "rating":
        return result.sort(
          (a, b) => b.rating - a.rating,
        );

      case "newest":
        return result.sort(
          (a, b) => b.id - a.id,
        );

      default:
        return result;
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* =========================
          PAGE HEADER
      ========================== */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Explore
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              All Products
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Discover products selected for smarter
              shopping. Find exactly what you need
              with powerful filters and sorting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================
          CONTENT
      ========================== */}

      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
        {/* =========================
            SEARCH
        ========================== */}

        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                updateSearch(event.target.value)
              }
              placeholder="Search products..."
              aria-label="Search products"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                pl-11
                pr-11
                text-sm
                text-slate-900
                outline-none
                transition-all
                placeholder:text-slate-400
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-white
                dark:focus:border-emerald-500
              "
            />

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="
                  absolute
                  right-3
                  top-1/2
                  flex
                  h-8
                  w-8
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition-colors
                  hover:bg-slate-100
                  hover:text-slate-700
                  dark:hover:bg-slate-800
                  dark:hover:text-slate-200
                "
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Search result information */}

          {searchQuery && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Showing results for{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                "{searchQuery}"
              </span>
            </p>
          )}
        </div>

        {/* Mobile filter button */}

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="
            mb-5
            flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            transition-all
            hover:border-emerald-300
            hover:text-emerald-600
            lg:hidden
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-slate-300
          "
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        {/* =========================
            PRODUCTS LAYOUT
        ========================== */}

        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Desktop sidebar */}

          <aside className="hidden lg:block">
            <ProductFilters
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
            />
          </aside>

          {/* Product area */}

          <main className="min-w-0">
            <ProductToolbar
              productCount={sortedProducts.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* =========================
                PRODUCT GRID
            ========================== */}

            {sortedProducts.length > 0 ? (
              <motion.div
                layout
                className="
                  mt-6
                  grid
                  grid-cols-2
                  gap-3
                  sm:gap-5
                  md:grid-cols-3
                  xl:grid-cols-4
                "
              >
                {sortedProducts.map(
                  (product, index) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.04,
                      }}
                    >
                      <ProductCard
                        product={product}
                        index={index}
                      />
                    </motion.div>
                  ),
                )}
              </motion.div>
            ) : (
              /* =========================
                 EMPTY STATE
              ========================== */

              <div className="flex min-h-[400px] items-center justify-center">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
                    <Search
                      size={25}
                      className="text-slate-400"
                    />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                    No products found
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {searchQuery
                      ? `We couldn't find any products matching "${searchQuery}".`
                      : "Try changing your filters to find more products."}
                  </p>

                  <div className="mt-5 flex justify-center gap-3">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-5
                          py-2.5
                          text-sm
                          font-semibold
                          text-slate-700
                          transition-colors
                          hover:border-emerald-300
                          hover:text-emerald-600
                          dark:border-slate-800
                          dark:bg-slate-900
                          dark:text-slate-300
                        "
                      >
                        Clear Search
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="
                        rounded-xl
                        bg-emerald-600
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition-colors
                        hover:bg-emerald-700
                      "
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =========================
          MOBILE FILTER DRAWER
      ========================== */}

      <MobileFilterDrawer
        open={isFilterOpen}
        onClose={() =>
          setIsFilterOpen(false)
        }
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
      />
    </div>
  );
}