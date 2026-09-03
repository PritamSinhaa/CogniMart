import {
  AlertCircle,
  AlertTriangle,
  Boxes,
  Edit3,
  LoaderCircle,
  PackageCheck,
  PackageX,
  RefreshCw,
  Search,
} from "lucide-react";

import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";

import useAdminProducts from "@/hooks/useAdminProducts";

const LOW_STOCK_LIMIT = 5;

const FALLBACK_IMAGE = "/images/product-placeholder.png";

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All stock",
  },
  {
    value: "in_stock",
    label: "In stock",
  },
  {
    value: "low_stock",
    label: "Low stock",
  },
  {
    value: "out_of_stock",
    label: "Out of stock",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];

const STOCK_STYLES = {
  in_stock:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  low_stock:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  out_of_stock: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",

  inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const STOCK_LABELS = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
  inactive: "Inactive",
};

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

function getShortProductId(productId) {
  if (!productId) {
    return "UNKNOWN";
  }

  return productId.slice(-8).toUpperCase();
}

function getStockStatus(product) {
  if (product.isActive === false) {
    return "inactive";
  }

  const stock = Number(product.stock) || 0;

  if (stock <= 0) {
    return "out_of_stock";
  }

  if (stock <= LOW_STOCK_LIMIT) {
    return "low_stock";
  }

  return "in_stock";
}

export default function AdminInventory() {
  const { products, loading, error, refresh } = useAdminProducts();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  /*
  |--------------------------------------------------------------------------
  | Inventory statistics
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const activeProducts = products.filter(
      (product) => product.isActive !== false,
    );

    const totalUnits = activeProducts.reduce(
      (total, product) => total + (Number(product.stock) || 0),
      0,
    );

    const lowStock = activeProducts.filter(
      (product) => getStockStatus(product) === "low_stock",
    ).length;

    const outOfStock = activeProducts.filter(
      (product) => getStockStatus(product) === "out_of_stock",
    ).length;

    return {
      totalProducts: products.length,
      activeProducts: activeProducts.length,
      totalUnits,
      lowStock,
      outOfStock,
    };
  }, [products]);

  /*
  |--------------------------------------------------------------------------
  | Search and filtering
  |--------------------------------------------------------------------------
  */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const productStatus = getStockStatus(product);

      const searchableText = [
        product.id,
        product.sku,
        product.name,
        product.category,
        product.brand,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesStatus = status === "all" || productStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, status]);

  if (loading) {
    return <InventoryLoading />;
  }

  if (error) {
    return <InventoryError message={error} onRetry={refresh} />;
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <AdminPageHeader
          title="Inventory management"
          description="Monitor real product stock levels and identify products that need attention."
        >
          <button
            type="button"
            onClick={refresh}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <RefreshCw size={14} />
            Refresh inventory
          </button>
        </AdminPageHeader>

        <InventoryStatistics statistics={statistics} />

        <InventoryFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        <InventoryTable products={filteredProducts} />
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

function InventoryStatistics({ statistics }) {
  return (
    <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <InventoryStat
        icon={Boxes}
        label="Total products"
        value={formatNumber(statistics.totalProducts)}
        description={`${formatNumber(
          statistics.activeProducts,
        )} active products`}
      />

      <InventoryStat
        icon={PackageCheck}
        label="Inventory units"
        value={formatNumber(statistics.totalUnits)}
        description="Units across active products"
        tone="success"
      />

      <InventoryStat
        icon={AlertTriangle}
        label="Low stock"
        value={formatNumber(statistics.lowStock)}
        description={`Products with 1–${LOW_STOCK_LIMIT} units`}
        tone="warning"
      />

      <InventoryStat
        icon={PackageX}
        label="Out of stock"
        value={formatNumber(statistics.outOfStock)}
        description="Active products with zero units"
        tone="danger"
      />
    </section>
  );
}

function InventoryStat({
  icon: Icon,
  label,
  value,
  description,
  tone = "default",
}) {
  const styles = {
    default: {
      icon: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
      value: "text-slate-950 dark:text-white",
    },

    success: {
      icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      value: "text-emerald-600 dark:text-emerald-400",
    },

    warning: {
      icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      value: "text-amber-600 dark:text-amber-400",
    },

    danger: {
      icon: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      value: "text-red-600 dark:text-red-400",
    },
  };

  const currentStyle = styles[tone] || styles.default;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{label}</p>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${currentStyle.icon}`}
        >
          <Icon size={15} />
        </div>
      </div>

      <p className={`mt-3 text-xl font-bold ${currentStyle.value}`}>{value}</p>

      <p className="mt-1 text-[11px] text-slate-400">{description}</p>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

function InventoryFilters({ search, status, onSearchChange, onStatusChange }) {
  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products, categories, brands, SKUs or IDs..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filter by stock status"
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Inventory table
|--------------------------------------------------------------------------
*/

function InventoryTable({ products }) {
  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Stock overview
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Inventory comes directly from the product database.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
      </div>

      {products.length > 0 ? (
        <>
          <DesktopInventoryTable products={products} />

          <MobileInventoryList products={products} />
        </>
      ) : (
        <InventoryEmpty />
      )}
    </section>
  );
}

function DesktopInventoryTable({ products }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/50">
            <TableHeading>Product</TableHeading>

            <TableHeading>Category</TableHeading>

            <TableHeading>Price</TableHeading>

            <TableHeading>Stock</TableHeading>

            <TableHeading>Status</TableHeading>

            <th
              scope="col"
              className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <DesktopInventoryRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeading({ children }) {
  return (
    <th
      scope="col"
      className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400"
    >
      {children}
    </th>
  );
}

function DesktopInventoryRow({ product }) {
  const stockStatus = getStockStatus(product);

  return (
    <tr className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800/80 dark:hover:bg-slate-800/30">
      <td className="px-5 py-4">
        <ProductIdentity product={product} />
      </td>

      <td className="px-5 py-4">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {product.category || "Uncategorized"}
        </span>
      </td>

      <td className="px-5 py-4">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {formatPrice(product.price)}
        </span>
      </td>

      <td className="px-5 py-4">
        <StockQuantity product={product} />
      </td>

      <td className="px-5 py-4">
        <StockStatusBadge status={stockStatus} />
      </td>

      <td className="px-5 py-4 text-right">
        <EditStockLink product={product} />
      </td>
    </tr>
  );
}

/*
|--------------------------------------------------------------------------
| Mobile inventory
|--------------------------------------------------------------------------
*/

function MobileInventoryList({ products }) {
  return (
    <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
      {products.map((product) => {
        const stockStatus = getStockStatus(product);

        return (
          <article key={product.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <ProductIdentity product={product} />

              <StockStatusBadge status={stockStatus} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <MobileValue
                label="Category"
                value={product.category || "Uncategorized"}
              />

              <MobileValue label="Stock" value={formatNumber(product.stock)} />

              <MobileValue label="Price" value={formatPrice(product.price)} />
            </div>

            <EditStockLink product={product} mobile />
          </article>
        );
      })}
    </div>
  );
}

function MobileValue({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400">{label}</p>

      <p className="mt-1 truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Shared row components
|--------------------------------------------------------------------------
*/

function ProductIdentity({ product }) {
  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        <p className="max-w-56 truncate text-sm font-semibold text-slate-900 dark:text-white">
          {product.name}
        </p>

        <p className="mt-1 text-[10px] text-slate-400">
          {product.sku || `#${getShortProductId(product.id)}`}
        </p>
      </div>
    </div>
  );
}

function StockQuantity({ product }) {
  const status = getStockStatus(product);

  const textStyle =
    status === "out_of_stock"
      ? "text-red-600 dark:text-red-400"
      : status === "low_stock"
        ? "text-amber-600 dark:text-amber-400"
        : status === "inactive"
          ? "text-slate-400"
          : "text-slate-900 dark:text-white";

  return (
    <span className={`text-sm font-bold ${textStyle}`}>
      {formatNumber(product.stock)}
    </span>
  );
}

function StockStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
        STOCK_STYLES[status] || STOCK_STYLES.inactive
      }`}
    >
      {STOCK_LABELS[status] || "Unknown"}
    </span>
  );
}

function EditStockLink({ product, mobile = false }) {
  return (
    <Link
      to={`/admin/products/${product.id}/edit`}
      className={
        mobile
          ? "mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
          : "inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
      }
    >
      <Edit3 size={13} />
      Update stock
    </Link>
  );
}

/*
|--------------------------------------------------------------------------
| Empty, loading and error
|--------------------------------------------------------------------------
*/

function InventoryEmpty() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Boxes size={20} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
        No inventory found
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Try changing your search term or stock filter.
      </p>
    </div>
  );
}

function InventoryLoading() {
  return (
    <main
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950"
      role="status"
    >
      <div className="text-center">
        <LoaderCircle
          size={30}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Loading inventory...
        </p>
      </div>
    </main>
  );
}

function InventoryError({ message, onRetry }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <AlertCircle size={34} className="mx-auto text-red-500" />

        <h1 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
          Unable to load inventory
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    </main>
  );
}
