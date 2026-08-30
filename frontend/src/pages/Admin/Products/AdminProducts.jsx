import {
  ChevronDown,
  Edit3,
  MoreHorizontal,
  PackageSearch,
  Plus,
  Power,
  PowerOff,
  Search,
} from "lucide-react";

import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import useAdminProducts from "../../../hooks/useAdminProducts";

const FALLBACK_IMAGE = "/product-placeholder.svg";

const STOCK_OPTIONS = ["All stock", "In stock", "Low stock", "Out of stock"];

const STATUS_OPTIONS = ["All statuses", "Active", "Inactive"];

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

function getStockLabel(stock) {
  if (stock <= 0) {
    return "Out of stock";
  }

  if (stock <= 10) {
    return "Low stock";
  }

  return "In stock";
}

function getStockColor(stock) {
  if (stock <= 0) {
    return "text-red-500";
  }

  if (stock <= 10) {
    return "text-amber-500";
  }

  return "text-emerald-600 dark:text-emerald-400";
}

export default function AdminProducts() {
  const navigate = useNavigate();

  const {
    products,
    pagination,
    loading,
    error,
    updatingId,
    activate,
    deactivate,
    refresh,
  } = useAdminProducts();

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All categories");

  const [stock, setStock] = useState("All stock");

  const [status, setStatus] = useState("All statuses");

  const [openMenuId, setOpenMenuId] = useState(null);

  const categories = useMemo(
    () => [
      "All categories",
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.sku,
        product.brand,
        product.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesCategory =
        category === "All categories" || product.category === category;

      let matchesStock = true;

      if (stock === "In stock") {
        matchesStock = product.stock > 10;
      }

      if (stock === "Low stock") {
        matchesStock = product.stock > 0 && product.stock <= 10;
      }

      if (stock === "Out of stock") {
        matchesStock = product.stock <= 0;
      }

      let matchesStatus = true;

      if (status === "Active") {
        matchesStatus = product.isActive;
      }

      if (status === "Inactive") {
        matchesStatus = !product.isActive;
      }

      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    });
  }, [products, search, category, stock, status]);

  const activeProducts = products.filter((product) => product.isActive).length;

  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 10,
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock <= 0,
  ).length;

  const handleEdit = (productId) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleStatusChange = async (product) => {
    setOpenMenuId(null);

    if (product.isActive) {
      const confirmed = window.confirm(
        `Deactivate "${product.name}"? It will no longer appear in the customer store.`,
      );

      if (!confirmed) {
        return;
      }

      try {
        await deactivate(product.id);
      } catch {
        // The hook displays the error.
      }

      return;
    }

    try {
      await activate(product.id);
    } catch {
      // The hook displays the error.
    }
  };

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[1600px]">
        <AdminProductsHeader
          onAddProduct={() => navigate("/admin/products/new")}
        />

        {error && <AdminProductsError message={error} onRetry={refresh} />}

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Products loaded" value={products.length} />

          <StatCard label="Active" value={activeProducts} />

          <StatCard label="Low stock" value={lowStockProducts} />

          <StatCard label="Out of stock" value={outOfStockProducts} />
        </div>

        <section className="mt-7 overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ProductTableFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            categories={categories}
            stock={stock}
            setStock={setStock}
            status={status}
            setStatus={setStatus}
          />

          <div className="border-y border-slate-100 px-5 py-3.5 sm:px-6 dark:border-slate-800">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {pagination?.totalProducts ?? products.length}
              </span>{" "}
              products
            </p>
          </div>

          {loading ? (
            <AdminProductsLoading />
          ) : filteredProducts.length > 0 ? (
            <>
              <DesktopProductTable
                products={filteredProducts}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                updatingId={updatingId}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
              />

              <MobileProductList
                products={filteredProducts}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                updatingId={updatingId}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
              />
            </>
          ) : (
            <AdminProductsEmpty />
          )}
        </section>
      </div>
    </div>
  );
}

function AdminProductsHeader({ onAddProduct }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          Catalog
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-[26px] dark:text-white">
          Products
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your product catalog and inventory.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddProduct}
        className="inline-flex h-11 w-fit shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
      >
        <Plus size={17} />
        Add product
      </button>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>

      <p className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function AdminProductsError({ message, onRetry }) {
  return (
    <div
      className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
      role="alert"
    >
      <span>{message}</span>

      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 font-semibold underline"
      >
        Try again
      </button>
    </div>
  );
}

function ProductTableFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  stock,
  setStock,
  status,
  setStatus,
}) {
  return (
    <div className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, SKU, brand or category..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <FilterSelect
          value={category}
          onChange={setCategory}
          options={categories}
          width="xl:w-48"
        />

        <FilterSelect
          value={stock}
          onChange={setStock}
          options={STOCK_OPTIONS}
          width="xl:w-44"
        />

        <FilterSelect
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          width="xl:w-44"
        />
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options, width }) {
  return (
    <div className={`relative w-full ${width}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function DesktopProductTable({
  products,
  openMenuId,
  setOpenMenuId,
  updatingId,
  onEdit,
  onStatusChange,
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <TableHeading>Product</TableHeading>

            <TableHeading>Category</TableHeading>

            <TableHeading>Price</TableHeading>

            <TableHeading>Stock</TableHeading>

            <TableHeading>Status</TableHeading>

            <TableHeading align="right">Action</TableHeading>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
            >
              <td className="px-6 py-4">
                <ProductIdentity product={product} />
              </td>

              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {product.category}
              </td>

              <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                {formatPrice(product.price)}
              </td>

              <td className="px-6 py-4">
                <StockInformation stock={product.stock} />
              </td>

              <td className="px-6 py-4">
                <ProductStatus product={product} />
              </td>

              <td className="relative px-6 py-4 text-right">
                <ProductActions
                  product={product}
                  open={openMenuId === product.id}
                  onToggle={() =>
                    setOpenMenuId(openMenuId === product.id ? null : product.id)
                  }
                  updating={updatingId === product.id}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileProductList({
  products,
  openMenuId,
  setOpenMenuId,
  updatingId,
  onEdit,
  onStatusChange,
}) {
  return (
    <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
      {products.map((product) => (
        <article
          key={product.id}
          className="relative flex items-center gap-3 p-4"
        >
          <button
            type="button"
            onClick={() => onEdit(product.id)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <ProductIdentity product={product} />
          </button>

          <ProductActions
            product={product}
            open={openMenuId === product.id}
            onToggle={() =>
              setOpenMenuId(openMenuId === product.id ? null : product.id)
            }
            updating={updatingId === product.id}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
          />
        </article>
      ))}
    </div>
  );
}

function ProductIdentity({ product }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {product.name}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-400">
          {product.sku || product.id}
        </p>
      </div>
    </div>
  );
}

function StockInformation({ stock }) {
  return (
    <>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        {stock} units
      </p>

      <p className={`mt-0.5 text-xs ${getStockColor(stock)}`}>
        {getStockLabel(stock)}
      </p>
    </>
  );
}

function ProductStatus({ product }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        product.isActive
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
          : "bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400"
      }`}
    >
      {product.isActive ? "Active" : "Inactive"}
    </span>
  );
}

function ProductActions({
  product,
  open,
  onToggle,
  updating,
  onEdit,
  onStatusChange,
}) {
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={onToggle}
        disabled={updating}
        aria-label={`Actions for ${product.name}`}
        aria-expanded={open}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <MoreHorizontal size={17} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => onEdit(product.id)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Edit3 size={15} />
            Edit product
          </button>

          <button
            type="button"
            onClick={() => onStatusChange(product)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              product.isActive
                ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            }`}
          >
            {product.isActive ? <PowerOff size={15} /> : <Power size={15} />}

            {product.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      )}
    </div>
  );
}

function TableHeading({ children, align = "left" }) {
  const alignmentClass = align === "right" ? "text-right" : "text-left";

  return (
    <th
      className={`
        px-6
        py-3.5
        text-[10px]
        font-semibold
        uppercase
        tracking-wider
        text-slate-400
        ${alignmentClass}
      `}
    >
      {children}
    </th>
  );
}

function AdminProductsLoading() {
  return (
    <div
      className="flex min-h-[360px] items-center justify-center"
      role="status"
    >
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />

        <p className="mt-4 text-sm text-slate-500">Loading products...</p>
      </div>
    </div>
  );
}

function AdminProductsEmpty() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <PackageSearch size={20} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
        No products found
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Try changing your search or filters.
      </p>
    </div>
  );
}
