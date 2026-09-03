import { AlertCircle, ArrowRight, Flame } from "lucide-react";

import { useMemo } from "react";

import { Link } from "react-router-dom";

import ProductCard from "./ProductCard";

import Container from "../../ui/Container";
import Section from "../../ui/Section";
import SectionHeader from "../../ui/SectionHeader";

import useProducts from "../../../hooks/useProducts";

const TRENDING_PRODUCT_LIMIT = 6;

/*
 * Until real sales analytics are implemented,
 * trending products are inferred using:
 *
 * 1. Rating
 * 2. Review count
 * 3. Discount
 * 4. Creation date
 */
function compareTrendingProducts(firstProduct, secondProduct) {
  const ratingDifference =
    Number(secondProduct.rating) - Number(firstProduct.rating);

  if (ratingDifference !== 0) {
    return ratingDifference;
  }

  const reviewDifference =
    Number(secondProduct.reviews) - Number(firstProduct.reviews);

  if (reviewDifference !== 0) {
    return reviewDifference;
  }

  const discountDifference =
    Number(secondProduct.discount) - Number(firstProduct.discount);

  if (discountDifference !== 0) {
    return discountDifference;
  }

  const firstCreatedAt = new Date(firstProduct.createdAt || 0).getTime();

  const secondCreatedAt = new Date(secondProduct.createdAt || 0).getTime();

  const safeFirstDate = Number.isNaN(firstCreatedAt) ? 0 : firstCreatedAt;

  const safeSecondDate = Number.isNaN(secondCreatedAt) ? 0 : secondCreatedAt;

  return safeSecondDate - safeFirstDate;
}

export default function TrendingProducts() {
  const { products, loading, error } = useProducts({
    limit: 100,
    sort: "newest",
  });

  const trendingProducts = useMemo(() => {
    return [...products]
      .filter((product) => product.isActive !== false)
      .sort(compareTrendingProducts)
      .slice(0, TRENDING_PRODUCT_LIMIT);
  }, [products]);

  return (
    <Section id="trending" className="bg-muted/40">
      <Container>
        <SectionHeader
          eyebrow={
            <span className="inline-flex items-center gap-2">
              <Flame size={16} className="text-orange-500" />

              <span>Trending now</span>
            </span>
          }
          title="Trending Products"
          description="Discover highly rated products shoppers are exploring."
          action={
            <Link
              to="/products"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 sm:flex dark:text-brand-400 dark:hover:text-brand-300"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          }
        />

        {loading && <TrendingProductsLoading />}

        {!loading && error && <TrendingProductsError message={error} />}

        {!loading && !error && trendingProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {trendingProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {!loading && !error && trendingProducts.length === 0 && (
          <TrendingProductsEmpty />
        )}

        {!loading && !error && trendingProducts.length > 0 && (
          <Link
            to="/products"
            className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-brand-300 hover:text-brand-600 sm:hidden dark:hover:border-brand-700 dark:hover:text-brand-400"
          >
            View all products
            <ArrowRight size={15} />
          </Link>
        )}
      </Container>
    </Section>
  );
}

function TrendingProductsLoading() {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      role="status"
      aria-label="Loading trending products"
    >
      {Array.from({
        length: TRENDING_PRODUCT_LIMIT,
      }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-slate-200 dark:bg-slate-800" />

      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

function TrendingProductsError({ message }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
    >
      <AlertCircle size={20} className="mt-0.5 shrink-0" />

      <div>
        <p className="text-sm font-semibold">Unable to load products</p>

        <p className="mt-1 text-sm opacity-80">{message}</p>
      </div>
    </div>
  );
}

function TrendingProductsEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-background px-5 py-12 text-center dark:border-slate-700">
      <p className="text-sm font-semibold text-foreground">
        No products are available
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Products added by an administrator will appear here.
      </p>
    </div>
  );
}
