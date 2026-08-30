import { useEffect, useMemo, useState } from "react";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { motion } from "motion/react";

import { useSearchParams } from "react-router-dom";

import ProductCard from "../../components/home/trendingProducts/ProductCard";
import ProductFilters from "./ProductFilters";
import ProductToolbar from "./ProductToolbar";
import MobileFilterDrawer from "./MobileFilterDrawer";

import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";

const INITIAL_FILTERS = {
  category: "All Categories",
  price: "all",
  rating: 0,
  inStock: false,
};

export default function Products() {
  /*
   * Backend products
   */
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();

  /*
   * Backend categories
   */
  const { categories, loading: categoriesLoading } = useCategories();

  const [searchParams, setSearchParams] = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState(() => ({
    ...INITIAL_FILTERS,
    category: searchParams.get("category") || "All Categories",
  }));

  const [sortBy, setSortBy] = useState("featured");

  /*
   * URL values
   *
   * Examples:
   * /products?search=iphone
   * /products?category=Electronics
   * /products?search=phone&category=Electronics
   */
  const searchQuery = searchParams.get("search") || "";

  const categoryQuery = searchParams.get("category") || "All Categories";

  /*
   * Keep category filter synchronized when the URL changes
   * through the browser, navbar or Categories page.
   */
  useEffect(() => {
    setFilters((currentFilters) => {
      if (currentFilters.category === categoryQuery) {
        return currentFilters;
      }

      return {
        ...currentFilters,
        category: categoryQuery,
      };
    });
  }, [categoryQuery]);

  /*
   * Search
   */
  const updateSearch = (value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      nextParams.set("search", value);
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams, {
      replace: true,
    });
  };

  const clearSearch = () => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("search");

    setSearchParams(nextParams, {
      replace: true,
    });
  };

  /*
   * Filters
   */
  const updateFilter = (key, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));

    /*
     * Store category in the URL so category links
     * remain shareable and refresh-safe.
     */
    if (key === "category") {
      const nextParams = new URLSearchParams(searchParams);

      if (value && value !== "All Categories") {
        nextParams.set("category", value);
      } else {
        nextParams.delete("category");
      }

      setSearchParams(nextParams, {
        replace: true,
      });
    }
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);

    const nextParams = new URLSearchParams(searchParams);

    /*
     * Clear category but preserve the current search.
     * Search has its own clear button.
     */
    nextParams.delete("category");

    setSearchParams(nextParams, {
      replace: true,
    });
  };

  /*
   * Client-side filtering
   *
   * This is suitable while the number of products is small.
   * Later, filtering and pagination should move to Express.
   */
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const normalizedCategory = filters.category.trim().toLowerCase();

    return products.filter((product) => {
      /*
       * Search
       */
      if (normalizedSearch) {
        const searchableText = [
          product.name,
          product.category,
          product.brand,
          product.description,
          ...(product.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedSearch)) {
          return false;
        }
      }

      /*
       * Category
       */
      if (
        filters.category !== "All Categories" &&
        product.category?.trim().toLowerCase() !== normalizedCategory
      ) {
        return false;
      }

      /*
       * Price
       */
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

      /*
       * Rating
       */
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      /*
       * Availability
       */
      if (filters.inStock && product.stock <= 0) {
        return false;
      }

      return true;
    });
  }, [products, filters, searchQuery]);

  /*
   * Client-side sorting
   */
  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    switch (sortBy) {
      case "price-low":
        return result.sort(
          (firstProduct, secondProduct) =>
            firstProduct.price - secondProduct.price,
        );

      case "price-high":
        return result.sort(
          (firstProduct, secondProduct) =>
            secondProduct.price - firstProduct.price,
        );

      case "rating":
        return result.sort(
          (firstProduct, secondProduct) =>
            secondProduct.rating - firstProduct.rating,
        );

      case "newest":
        return result.sort((firstProduct, secondProduct) => {
          const firstDate = new Date(firstProduct.createdAt).getTime();

          const secondDate = new Date(secondProduct.createdAt).getTime();

          const safeFirstDate = Number.isNaN(firstDate) ? 0 : firstDate;

          const safeSecondDate = Number.isNaN(secondDate) ? 0 : secondDate;

          return safeSecondDate - safeFirstDate;
        });

      case "featured":
      default:
        return result;
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ProductsHeader />

      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
        <ProductSearch
          searchQuery={searchQuery}
          updateSearch={updateSearch}
          clearSearch={clearSearch}
        />

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
          {/*
           * Desktop filters
           */}
          <aside className="hidden lg:block">
            <ProductFilters
              categories={categories}
              categoriesLoading={categoriesLoading}
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
            />
          </aside>

          {/*
           * MainLayout already has <main>, so use section here.
           */}
          <section className="min-w-0">
            {productsLoading && <ProductsLoadingState />}

            {!productsLoading && productsError && (
              <ProductsErrorState message={productsError} />
            )}

            {!productsLoading && !productsError && (
              <>
                <ProductToolbar
                  productCount={sortedProducts.length}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />

                {sortedProducts.length > 0 ? (
                  <ProductGrid products={sortedProducts} />
                ) : (
                  <ProductsEmptyState
                    searchQuery={searchQuery}
                    selectedCategory={filters.category}
                    clearSearch={clearSearch}
                    clearFilters={clearFilters}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {/*
       * Mobile filters
       */}
      <MobileFilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        categoriesLoading={categoriesLoading}
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
      />
    </div>
  );
}

function ProductsHeader() {
  return (
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
            Discover products selected for smarter shopping. Find exactly what
            you need with powerful filters and sorting.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ProductSearch({ searchQuery, updateSearch, clearSearch }) {
  return (
    <div className="mb-6">
      <div className="relative max-w-2xl">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => updateSearch(event.target.value)}
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

      {searchQuery && (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Showing results for{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            &quot;{searchQuery}&quot;
          </span>
        </p>
      )}
    </div>
  );
}

function ProductGrid({ products }) {
  return (
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
      {products.map((product, index) => (
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
            delay: Math.min(index * 0.04, 0.3),
          }}
        >
          <ProductCard product={product} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}

function ProductsLoadingState() {
  return (
    <div
      className="flex min-h-[420px] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div
          className="
            mx-auto
            h-8
            w-8
            animate-spin
            rounded-full
            border-2
            border-emerald-600
            border-t-transparent
          "
        />

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Loading products...
        </p>
      </div>
    </div>
  );
}

function ProductsErrorState({ message }) {
  return (
    <div
      className="flex min-h-[420px] items-center justify-center"
      role="alert"
    >
      <div className="max-w-md text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 dark:border-red-500/20 dark:bg-red-500/10">
          <h2 className="font-semibold text-red-800 dark:text-red-300">
            Unable to load products
          </h2>

          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductsEmptyState({
  searchQuery,
  selectedCategory,
  clearSearch,
  clearFilters,
}) {
  const hasCategory = selectedCategory !== "All Categories";

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
          <Search size={25} className="text-slate-400" />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
          No products found
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {searchQuery
            ? `We couldn't find products matching "${searchQuery}".`
            : hasCategory
              ? `There are currently no products in ${selectedCategory}.`
              : "Try changing your filters to find more products."}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
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
  );
}
