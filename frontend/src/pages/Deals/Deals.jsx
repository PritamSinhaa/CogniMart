import {
  AlertCircle,
  ArrowRight,
  BadgePercent,
  Flame,
  Tag,
  Zap,
} from "lucide-react";

import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { motion } from "motion/react";

import ProductCard from "../../components/home/trendingProducts/ProductCard";

import useProducts from "../../hooks/useProducts";

const ALL_DEALS = "All deals";

const PRODUCTS_REQUEST = {
  limit: 100,
  sort: "newest",
};

function compareDeals(firstProduct, secondProduct) {
  const discountDifference =
    Number(secondProduct.discount) - Number(firstProduct.discount);

  if (discountDifference !== 0) {
    return discountDifference;
  }

  const ratingDifference =
    Number(secondProduct.rating) - Number(firstProduct.rating);

  if (ratingDifference !== 0) {
    return ratingDifference;
  }

  return Number(secondProduct.reviews) - Number(firstProduct.reviews);
}

export default function Deals() {
  const [activeCategory, setActiveCategory] = useState(ALL_DEALS);

  const { products, loading, error } = useProducts(PRODUCTS_REQUEST);

  /*
  |--------------------------------------------------------------------------
  | Real discounted products
  |--------------------------------------------------------------------------
  */

  const deals = useMemo(() => {
    return products
      .filter((product) => {
        return product.isActive !== false && Number(product.discount) > 0;
      })
      .sort(compareDeals);
  }, [products]);

  /*
  |--------------------------------------------------------------------------
  | Categories derived from actual deals
  |--------------------------------------------------------------------------
  */

  const dealCategories = useMemo(() => {
    const categoryNames = deals
      .map((product) => product.category)
      .filter(Boolean);

    return [ALL_DEALS, ...new Set(categoryNames)];
  }, [deals]);

  /*
  |--------------------------------------------------------------------------
  | Active category filtering
  |--------------------------------------------------------------------------
  */

  const filteredDeals = useMemo(() => {
    if (activeCategory === ALL_DEALS) {
      return deals;
    }

    return deals.filter((product) => product.category === activeCategory);
  }, [activeCategory, deals]);

  const maximumDiscount = useMemo(() => {
    return deals.reduce(
      (highestDiscount, product) =>
        Math.max(highestDiscount, Number(product.discount) || 0),
      0,
    );
  }, [deals]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <DealsHero dealCount={deals.length} maximumDiscount={maximumDiscount} />

        {!loading && !error && deals.length > 0 && (
          <DealCategoryFilters
            categories={dealCategories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        )}

        <section id="deal-products" className="mt-8 scroll-mt-24">
          <DealsSectionHeader productCount={filteredDeals.length} />

          {loading && <DealsLoading />}

          {!loading && error && <DealsError message={error} />}

          {!loading && !error && filteredDeals.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {filteredDeals.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          {!loading && !error && filteredDeals.length === 0 && (
            <DealsEmpty
              hasAnyDeals={deals.length > 0}
              onClearFilter={() => setActiveCategory(ALL_DEALS)}
            />
          )}
        </section>

        {!loading && !error && deals.length > 0 && <BrowseProductsBanner />}
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Hero
|--------------------------------------------------------------------------
*/

function DealsHero({ dealCount, maximumDiscount }) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-12"
    >
      <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <Flame size={17} />
            Current discounts
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Deals worth <span className="text-emerald-400">grabbing.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore genuine discounts available across CogniMart products.
          </p>

          <a
            href="#deal-products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            Browse deals
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <HeroStatistic
            icon={Tag}
            value={dealCount}
            label={dealCount === 1 ? "Active deal" : "Active deals"}
          />

          <HeroStatistic
            icon={BadgePercent}
            value={maximumDiscount > 0 ? `${maximumDiscount}%` : "0%"}
            label="Highest discount"
          />
        </div>
      </div>
    </motion.section>
  );
}

function HeroStatistic({ icon: Icon, value, label }) {
  return (
    <div className="min-w-[130px] rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <Icon size={18} className="text-emerald-400" />

      <p className="mt-3 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Category filters
|--------------------------------------------------------------------------
*/

function DealCategoryFilters({ categories, activeCategory, onChange }) {
  return (
    <section className="mt-8" aria-label="Deal categories">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const selected = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              aria-pressed={selected}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "bg-emerald-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Product section
|--------------------------------------------------------------------------
*/

function DealsSectionHeader({ productCount }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-amber-500" fill="currentColor" />

          <p className="text-sm font-semibold text-emerald-600">
            Available offers
          </p>
        </div>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Discounted products
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {productCount} {productCount === 1 ? "product" : "products"} found
        </p>
      </div>

      <Link
        to="/products"
        className="hidden items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 sm:flex"
      >
        View all
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading, error and empty states
|--------------------------------------------------------------------------
*/

function DealsLoading() {
  return (
    <div
      className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
      role="status"
      aria-label="Loading deals"
    >
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <DealSkeleton key={index} />
      ))}
    </div>
  );
}

function DealSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-square animate-pulse bg-slate-200 dark:bg-slate-800" />

      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-6 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

function DealsError({ message }) {
  return (
    <div
      role="alert"
      className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
    >
      <AlertCircle size={20} className="mt-0.5 shrink-0" />

      <div>
        <p className="text-sm font-semibold">Unable to load deals</p>

        <p className="mt-1 text-sm opacity-80">{message}</p>
      </div>
    </div>
  );
}

function DealsEmpty({ hasAnyDeals, onClearFilter }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
      <Tag size={30} className="mx-auto text-slate-400" />

      <h3 className="mt-3 font-semibold text-slate-800 dark:text-white">
        {hasAnyDeals ? "No deals in this category" : "No active deals"}
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {hasAnyDeals
          ? "Try another deal category."
          : "Discounted products added by an administrator will appear here."}
      </p>

      {hasAnyDeals ? (
        <button
          type="button"
          onClick={onClearFilter}
          className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          View all deals
        </button>
      ) : (
        <Link
          to="/products"
          className="mt-5 inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Browse products
        </Link>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Bottom banner
|--------------------------------------------------------------------------
*/

function BrowseProductsBanner() {
  return (
    <section className="mt-12 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-500/10 dark:bg-emerald-500/5 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Looking for something else?
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Explore the complete product catalogue and use filters to find what
            you need.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Browse all products
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
