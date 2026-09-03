import { ArrowRight, Eye, ShoppingBag } from "lucide-react";

import { Link } from "react-router-dom";

const STATUS_STYLES = {
  pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  confirmed: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

  processing:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",

  shipped: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",

  delivered:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const PAYMENT_STYLES = {
  paid: "text-emerald-600 dark:text-emerald-400",

  pending: "text-amber-600 dark:text-amber-400",

  failed: "text-red-500 dark:text-red-400",

  refunded: "text-blue-600 dark:text-blue-400",
};

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

function createInitials(name = "") {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "CU";
}

export default function AdminRecentOrders({ orders = [] }) {
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <RecentOrdersHeader />

      {safeOrders.length > 0 ? (
        <>
          <DesktopOrderTable orders={safeOrders} />

          <MobileOrderList orders={safeOrders} />
        </>
      ) : (
        <RecentOrdersEmpty />
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function RecentOrdersHeader() {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 dark:border-slate-800">
      <div>
        <h2 className="text-sm font-bold text-slate-950 dark:text-white">
          Recent Orders
        </h2>

        <p className="mt-0.5 text-[11px] text-slate-400">
          Latest customer orders
        </p>
      </div>

      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        View all
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Desktop table
|--------------------------------------------------------------------------
*/

function DesktopOrderTable({ orders }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b border-slate-100 text-left dark:border-slate-800">
            <TableHeading>Order</TableHeading>

            <TableHeading>Customer</TableHeading>

            <TableHeading>Amount</TableHeading>

            <TableHeading>Payment</TableHeading>

            <TableHeading>Status</TableHeading>

            <TableHeading>Date</TableHeading>

            <th scope="col" className="px-5 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <DesktopOrderRow key={order._id} order={order} />
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
      className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400"
    >
      {children}
    </th>
  );
}

function DesktopOrderRow({ order }) {
  const customerName = getCustomerName(order);

  const customerEmail = getCustomerEmail(order);

  return (
    <tr className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40">
      <td className="px-5 py-4">
        <Link
          to={`/admin/orders/${order._id}`}
          className="text-xs font-semibold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white"
        >
          #{getShortOrderId(order._id)}
        </Link>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            {createInitials(customerName)}
          </div>

          <div className="min-w-0">
            <p className="max-w-40 truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {customerName}
            </p>

            <p className="max-w-40 truncate text-[10px] text-slate-400">
              {customerEmail}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {formatPrice(order.total)}
        </span>
      </td>

      <td className="px-5 py-4">
        <PaymentStatus status={order.paymentStatus} />
      </td>

      <td className="px-5 py-4">
        <OrderStatus status={order.orderStatus} />
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-[10px] text-slate-400">
        {formatDate(order.createdAt)}
      </td>

      <td className="px-5 py-4 text-right">
        <Link
          to={`/admin/orders/${order._id}`}
          aria-label={`View order ${getShortOrderId(order._id)}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Eye size={15} />
        </Link>
      </td>
    </tr>
  );
}

/*
|--------------------------------------------------------------------------
| Mobile cards
|--------------------------------------------------------------------------
*/

function MobileOrderList({ orders }) {
  return (
    <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
      {orders.map((order) => (
        <MobileOrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}

function MobileOrderCard({ order }) {
  return (
    <Link
      to={`/admin/orders/${order._id}`}
      className="block p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-950 dark:text-white">
            #{getShortOrderId(order._id)}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
            {getCustomerName(order)}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <p className="text-sm font-bold text-slate-950 dark:text-white">
          {formatPrice(order.total)}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <OrderStatus status={order.orderStatus} />

        <PaymentStatus status={order.paymentStatus} />
      </div>
    </Link>
  );
}

/*
|--------------------------------------------------------------------------
| Status components
|--------------------------------------------------------------------------
*/

function OrderStatus({ status = "pending" }) {
  const normalizedStatus = String(status).toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
        STATUS_STYLES[normalizedStatus] ||
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {normalizedStatus}
    </span>
  );
}

function PaymentStatus({ status = "pending" }) {
  const normalizedStatus = String(status).toLowerCase();

  return (
    <span
      className={`text-xs font-semibold capitalize ${
        PAYMENT_STYLES[normalizedStatus] || "text-slate-500 dark:text-slate-400"
      }`}
    >
      {normalizedStatus}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Empty
|--------------------------------------------------------------------------
*/

function RecentOrdersEmpty() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <ShoppingBag size={21} />
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">
        No orders yet
      </p>

      <p className="mt-1 text-xs text-slate-400">
        New customer orders will appear here.
      </p>
    </div>
  );
}
