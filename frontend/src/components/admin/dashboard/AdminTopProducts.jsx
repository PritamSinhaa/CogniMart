import { ArrowRight, PackageSearch, TrendingUp } from "lucide-react";

import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString("en-IN");
}

export default function AdminTopProducts({ products = [] }) {
  const navigate = useNavigate();

  const safeProducts = Array.isArray(products) ? products : [];

  const handleProductClick = (productId) => {
    /*
     * Historical orders can contain
     * products that were permanently
     * removed from the database.
     */
    if (!productId) {
      return;
    }

    navigate(`/admin/products/${productId}/edit`);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Header onViewAll={() => navigate("/admin/products")} />

      {safeProducts.length > 0 ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {safeProducts.map((product, index) => (
            <ProductRow
              key={product.id || `${product.name}-${index}`}
              product={product}
              rank={index + 1}
              onClick={handleProductClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function Header({ onViewAll }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <TrendingUp size={16} />
          </div>

          <h2 className="text-sm font-bold text-slate-950 dark:text-white">
            Top Selling Products
          </h2>
        </div>

        <p className="mt-1 text-[11px] text-slate-400">
          Ranked from paid and delivered orders
        </p>
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        View all
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Product row
|--------------------------------------------------------------------------
*/

function ProductRow({ product, rank, onClick }) {
  const productId = product.id || product._id;

  const canOpen = Boolean(productId);

  const unitsSold = Math.max(Number(product.unitsSold ?? product.sold) || 0, 0);

  const revenue = Math.max(Number(product.revenue) || 0, 0);

  const image = product.image || product.images?.[0] || FALLBACK_IMAGE;

  const category =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <button
      type="button"
      onClick={() => onClick(productId)}
      disabled={!canOpen}
      aria-label={
        canOpen
          ? `Edit ${product.name}`
          : `${product.name} is no longer available`
      }
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 disabled:cursor-default disabled:hover:bg-transparent sm:px-5 dark:hover:bg-slate-800/40 dark:disabled:hover:bg-transparent"
    >
      {/* Rank */}

      <span className="w-5 shrink-0 text-center text-xs font-bold text-slate-400">
        {rank}
      </span>

      {/* Product image */}

      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        <img
          src={image}
          alt={product.name || "Product"}
          loading="lazy"
          onError={handleImageError}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product information */}

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
          {product.name || "Unknown product"}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-400">
          {category || "Uncategorized"}

          {!canOpen && " · Product removed"}
        </p>
      </div>

      {/* Desktop sales */}

      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {formatNumber(unitsSold)} {unitsSold === 1 ? "unit" : "units"} sold
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {formatPrice(revenue)}
        </p>
      </div>

      {/* Mobile sales */}

      <div className="shrink-0 text-right sm:hidden">
        <p className="text-xs font-bold text-slate-900 dark:text-white">
          {formatPrice(revenue)}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {formatNumber(unitsSold)} sold
        </p>
      </div>
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Empty state
|--------------------------------------------------------------------------
*/

function EmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <PackageSearch size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
        No sales data yet
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
        Top-selling products will appear after orders are paid and delivered.
      </p>
    </div>
  );
}
