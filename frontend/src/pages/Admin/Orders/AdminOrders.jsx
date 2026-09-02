import {
  AlertCircle,
  Eye,
  LoaderCircle,
  PackageSearch,
  RefreshCw,
  Search,
  ShoppingBag,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { getAllOrders } from "../../../api/order.api";

const ORDERS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_OPTIONS = ["all", "pending", "paid", "failed", "refunded"];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getShortOrderId(orderId) {
  if (!orderId) {
    return "UNKNOWN";
  }

  return orderId.slice(-8).toUpperCase();
}

function getCustomerName(order) {
  return order?.user?.name || "Deleted customer";
}

function getCustomerEmail(order) {
  return order?.user?.email || "Email unavailable";
}

function getItemCount(order) {
  if (!Array.isArray(order?.items)) {
    return 0;
  }

  return order.items.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );
}

function extractOrders(response) {
  const orders = response?.data?.orders || response?.orders || [];

  return Array.isArray(orders) ? orders : [];
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to load orders.";
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [payment, setPayment] = useState("all");

  const [page, setPage] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | Load orders
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller = new AbortController();

    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllOrders({
          signal: controller.signal,
        });

        if (!active) {
          return;
        }

        setOrders(extractOrders(response));
      } catch (requestError) {
        if (requestError?.name === "AbortError") {
          return;
        }

        if (active) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey]);

  /*
  |--------------------------------------------------------------------------
  | Filter orders
  |--------------------------------------------------------------------------
  */

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const searchableText = [
        order._id,
        getShortOrderId(order._id),
        getCustomerName(order),
        getCustomerEmail(order),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesStatus = status === "all" || order.orderStatus === status;

      const matchesPayment =
        payment === "all" || order.paymentStatus === payment;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, status, payment]);

  /*
   * Return to page one whenever
   * filters change.
   */
  useEffect(() => {
    setPage(1);
  }, [search, status, payment]);

  const totalPages = Math.max(
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE),
    1,
  );

  const safePage = Math.min(page, totalPages);

  const visibleOrders = filteredOrders.slice(
    (safePage - 1) * ORDERS_PER_PAGE,

    safePage * ORDERS_PER_PAGE,
  );

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <AdminOrdersHeader count={filteredOrders.length} />

        <OrderFilters
          search={search}
          status={status}
          payment={payment}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPaymentChange={setPayment}
        />

        {loading ? (
          <OrdersLoading />
        ) : error ? (
          <OrdersError message={error} onRetry={handleRetry} />
        ) : visibleOrders.length > 0 ? (
          <>
            <OrdersDesktopTable orders={visibleOrders} />

            <OrdersMobileList orders={visibleOrders} />

            <Pagination
              page={safePage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              onPageChange={setPage}
            />
          </>
        ) : (
          <OrdersEmpty
            filtered={orders.length > 0}
            onClearFilters={() => {
              setSearch("");
              setStatus("all");
              setPayment("all");
            }}
          />
        )}
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Page header
|--------------------------------------------------------------------------
*/

function AdminOrdersHeader({ count }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          Sales
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[26px]">
          Orders
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage customer orders, payments and fulfilment.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <ShoppingBag size={15} />

        <span>
          {count} {count === 1 ? "order" : "orders"}
        </span>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

function OrderFilters({
  search,
  status,
  payment,
  onSearchChange,
  onStatusChange,
  onPaymentChange,
}) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
            placeholder="Search order ID, customer or email..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
          />
        </div>

        <FilterSelect
          label="Order status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={onStatusChange}
        />

        <FilterSelect
          label="Payment status"
          value={payment}
          options={PAYMENT_OPTIONS}
          onChange={onPaymentChange}
        />
      </div>
    </section>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label>
      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium capitalize text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 lg:w-44"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all"
              ? label === "Order status"
                ? "All order statuses"
                : "All payment statuses"
              : option}
          </option>
        ))}
      </select>
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Desktop table
|--------------------------------------------------------------------------
*/

function OrdersDesktopTable({ orders }) {
  return (
    <section className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-900/60">
              <TableHeading>Order</TableHeading>

              <TableHeading>Customer</TableHeading>

              <TableHeading>Items</TableHeading>

              <TableHeading>Total</TableHeading>

              <TableHeading>Payment</TableHeading>

              <TableHeading>Status</TableHeading>

              <TableHeading>Date</TableHeading>

              <TableHeading alignRight>Action</TableHeading>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.map((order) => (
              <OrderTableRow key={order._id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TableHeading({ children, alignRight = false }) {
  return (
    <th
      className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400 ${
        alignRight ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function OrderTableRow({ order }) {
  return (
    <tr className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
      <td className="px-4 py-4">
        <Link
          to={`/admin/orders/${order._id}`}
          className="font-mono text-sm font-bold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white"
        >
          #{getShortOrderId(order._id)}
        </Link>
      </td>

      <td className="px-4 py-4">
        <p className="max-w-44 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
          {getCustomerName(order)}
        </p>

        <p className="mt-1 max-w-44 truncate text-xs text-slate-400">
          {getCustomerEmail(order)}
        </p>
      </td>

      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
        {getItemCount(order)}
      </td>

      <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">
        {formatPrice(order.total)}
      </td>

      <td className="px-4 py-4">
        <PaymentStatus status={order.paymentStatus} />
      </td>

      <td className="px-4 py-4">
        <OrderStatus status={order.orderStatus} />
      </td>

      <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
        {formatDate(order.createdAt)}
      </td>

      <td className="px-4 py-4 text-right">
        <Link
          to={`/admin/orders/${order._id}`}
          aria-label={`View order ${getShortOrderId(order._id)}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300"
        >
          <Eye size={16} />
        </Link>
      </td>
    </tr>
  );
}

/*
|--------------------------------------------------------------------------
| Mobile order cards
|--------------------------------------------------------------------------
*/

function OrdersMobileList({ orders }) {
  return (
    <div className="mt-5 space-y-3 md:hidden">
      {orders.map((order) => (
        <article
          key={order._id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link
                to={`/admin/orders/${order._id}`}
                className="font-mono text-sm font-bold text-slate-900 hover:text-emerald-600 dark:text-white"
              >
                #{getShortOrderId(order._id)}
              </Link>

              <p className="mt-1 text-xs text-slate-400">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <OrderStatus status={order.orderStatus} />
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {getCustomerName(order)}
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {getCustomerEmail(order)}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
            <MobileDetail label="Items" value={getItemCount(order)} />

            <MobileDetail label="Total" value={formatPrice(order.total)} />

            <MobileDetail
              label="Payment"
              value={<PaymentStatus status={order.paymentStatus} />}
            />
          </div>

          <Link
            to={`/admin/orders/${order._id}`}
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200"
          >
            <Eye size={15} />
            View order
          </Link>
        </article>
      ))}
    </div>
  );
}

function MobileDetail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Status badges
|--------------------------------------------------------------------------
*/

function OrderStatus({ status }) {
  const normalizedStatus = status || "pending";

  const styles = {
    pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

    confirmed:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    processing:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",

    shipped: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",

    delivered:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

    cancelled: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        styles[normalizedStatus] || styles.pending
      }`}
    >
      {normalizedStatus}
    </span>
  );
}

function PaymentStatus({ status }) {
  const normalizedStatus = status || "pending";

  const styles = {
    paid: "text-emerald-600 dark:text-emerald-400",

    pending: "text-amber-600 dark:text-amber-400",

    failed: "text-red-600 dark:text-red-400",

    refunded: "text-blue-600 dark:text-blue-400",
  };

  return (
    <span
      className={`text-xs font-semibold capitalize ${
        styles[normalizedStatus] || "text-slate-500"
      }`}
    >
      {normalizedStatus}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

function Pagination({ page, totalPages, totalItems, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const firstItem = (page - 1) * ORDERS_PER_PAGE + 1;

  const lastItem = Math.min(page * ORDERS_PER_PAGE, totalItems);

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-400">
        Showing {firstItem}–{lastItem} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Previous
        </button>

        <span className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading, error and empty states
|--------------------------------------------------------------------------
*/

function OrdersLoading() {
  return (
    <div
      role="status"
      className="mt-5 flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="text-center">
        <LoaderCircle
          size={28}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Loading orders...
        </p>
      </div>
    </div>
  );
}

function OrdersError({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="mt-5 rounded-2xl border border-red-200 bg-white px-5 py-14 text-center dark:border-red-500/20 dark:bg-slate-900"
    >
      <AlertCircle size={34} className="mx-auto text-red-500" />

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        Unable to load orders
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        <RefreshCw size={15} />
        Try again
      </button>
    </div>
  );
}

function OrdersEmpty({ filtered, onClearFilters }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
      <PackageSearch
        size={35}
        className="mx-auto text-slate-300 dark:text-slate-700"
      />

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        {filtered ? "No matching orders" : "No orders yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {filtered
          ? "Try changing your search or filter selections."
          : "Customer orders will appear here after checkout."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
