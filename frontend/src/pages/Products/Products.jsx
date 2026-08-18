import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";

import ProductCard from "../../components/home/trendingProducts/ProductCard";
import ProductFilters from "./ProductFilters";
import ProductToolbar from "./ProductToolbar";
import MobileFilterDrawer from "./MobileFilterDrawer";

import { products } from "../../data/products";



export default function Products() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: "All Categories",
    price: "all",
    rating: 0,
    inStock: false,
  });

  const [sortBy, setSortBy] = useState("featured");

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      /* Category */
      if (
        filters.category !== "All Categories" &&
        product.category !== filters.category
      ) {
        return false;
      }

      /* Price */
      if (filters.price === "under-1000" && product.price >= 1000) {
        return false;
      }

      if (
        filters.price === "1000-5000" &&
        (product.price < 1000 || product.price > 5000)
      ) {
        return false;
      }

      if (
        filters.price === "5000-10000" &&
        (product.price < 5000 || product.price > 10000)
      ) {
        return false;
      }

      if (
        filters.price === "10000-25000" &&
        (product.price < 10000 || product.price > 25000)
      ) {
        return false;
      }

      if (filters.price === "above-25000" && product.price <= 25000) {
        return false;
      }

      /* Rating */
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      /*
       * Stock filtering will later use your backend's
       * actual inventory value.
       */
      if (filters.inStock && product.stock === 0) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => a.price - b.price);

      case "price-high":
        return result.sort((a, b) => b.price - a.price);

      case "rating":
        return result.sort((a, b) => b.rating - a.rating);

      case "newest":
        return result.sort((a, b) => b.id - a.id);

      default:
        return result;
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ================= HEADER ================= */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Explore
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              All Products
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Discover products selected for smarter shopping.
              Find exactly what you need with powerful filters and
              sorting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
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

        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* ================= DESKTOP SIDEBAR ================= */}

          <aside className="hidden lg:block">
            <ProductFilters
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
            />
          </aside>

          {/* ================= PRODUCT AREA ================= */}

          <main className="min-w-0">
            <ProductToolbar
              productCount={sortedProducts.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Product grid */}

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
                {sortedProducts.map((product, index) => (
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
                ))}
              </motion.div>
            ) : (
              /* Empty state */

              <div className="flex min-h-[400px] items-center justify-center">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
                    <SlidersHorizontal
                      size={25}
                      className="text-slate-400"
                    />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                    No products found
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Try changing your filters to find more
                    products.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      mt-5
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
            )}
          </main>
        </div>
      </div>

      {/* ================= MOBILE FILTER ================= */}

      <MobileFilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
      />
    </div>
  );
}