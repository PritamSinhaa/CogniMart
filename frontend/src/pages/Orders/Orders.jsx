import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  LoaderCircle,
  Package,
  RotateCcw,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { getMyOrders } from "../../api/order.api";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

const FILTERS = [
  {
    label: "All orders",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Shipped",
    value: "shipped",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

function formatDate(date) {
  if (!date) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function extractOrders(response) {
  const orders = response?.data?.orders || response?.orders || [];

  return Array.isArray(orders) ? orders : [];
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to load your orders";
}

function getShortOrderId(orderId) {
  if (!orderId) {
    return "UNKNOWN";
  }

  return orderId.slice(-8).toUpperCase();
}

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const [activeFilter, setActiveFilter] = useState("all");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load orders
  |--------------------------------------------------------------------------
  */

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyOrders();

      setOrders(extractOrders(response));
    } catch (requestError) {
      setOrders([]);

      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getMyOrders();

        if (!active) {
          return;
        }

        setOrders(extractOrders(response));
      } catch (requestError) {
        if (!active) {
          return;
        }

        setOrders([]);

        setError(getErrorMessage(requestError));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      active = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Filtering and search
  |--------------------------------------------------------------------------
  */

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesFilter =
        activeFilter === "all" || order.orderStatus === activeFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const matchesOrderId =
        order._id?.toLowerCase().includes(normalizedSearch) ||
        getShortOrderId(order._id).toLowerCase().includes(normalizedSearch);

      const matchesProduct = order.items?.some((item) =>
        item.name?.toLowerCase().includes(normalizedSearch),
      );

      return matchesOrderId || matchesProduct;
    });
  }, [orders, activeFilter, search]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Your purchases
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Track and manage all your CogniMart orders.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              placeholder="Search orders..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Filters */}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Content */}

        <div className="mt-5">
          {loading ? (
            <OrdersLoading />
          ) : error ? (
            <OrdersError message={error} onRetry={loadOrders} />
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <OrderCard key={order._id} order={order} index={index} />
              ))}
            </div>
          ) : (
            <EmptyOrders
              hasOrders={orders.length > 0}
              onReset={() => {
                setSearch("");
                setActiveFilter("all");
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Order card
|--------------------------------------------------------------------------
*/

function OrderCard({ order, index }) {
  const itemCount =
    order.items?.reduce(
      (total, item) => total + (Number(item.quantity) || 0),
      0,
    ) || 0;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: Math.min(index * 0.05, 0.3),
      }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Order header */}

      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div>
            <p className="text-xs text-slate-400">Order number</p>

            <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
              #{getShortOrderId(order._id)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-slate-400" />

            <span className="text-sm text-slate-500 dark:text-slate-400">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <OrderStatus status={order.orderStatus} />
        </div>

        <div className="sm:text-right">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {formatPrice(order.total)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Products */}

      <div className="px-4 py-4">
        <div className="space-y-4">
          {order.items?.map((item, itemIndex) => (
            <OrderProduct
              key={`${order._id}-${
                item.product?._id || item.product || itemIndex
              }`}
              item={item}
            />
          ))}
        </div>

        {/* Footer */}

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <DeliveryMessage status={order.orderStatus} />

          <Link
            to={`/orders/${order._id}`}
            className="group inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-500"
          >
            View order
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/*
|--------------------------------------------------------------------------
| Product
|--------------------------------------------------------------------------
*/

function OrderProduct({ item }) {
  const productImage = item.product?.images?.[0] || FALLBACK_IMAGE;

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <div className="flex items-center gap-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
        <img
          src={productImage}
          alt={item.name}
          loading="lazy"
          onError={handleImageError}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        {item.product?._id ? (
          <Link
            to={`/products/${item.product._id}`}
            className="line-clamp-1 text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white"
          >
            {item.name}
          </Link>
        ) : (
          <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
            {item.name}
          </p>
        )}

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {formatPrice(item.price)} × {item.quantity}
        </p>
      </div>

      <p className="shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {formatPrice(item.subtotal)}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

function OrderStatus({ status }) {
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        styles[status] || styles.pending
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {status || "pending"}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Delivery message
|--------------------------------------------------------------------------
*/

function DeliveryMessage({ status }) {
  const messages = {
    pending: {
      icon: Package,
      message: "Waiting for confirmation",
      className: "text-amber-600 dark:text-amber-400",
    },

    confirmed: {
      icon: Package,
      message: "Order has been confirmed",
      className: "text-blue-600 dark:text-blue-400",
    },

    processing: {
      icon: Package,
      message: "Preparing your order",
      className: "text-violet-600 dark:text-violet-400",
    },

    shipped: {
      icon: Truck,
      message: "Your order is on the way",
      className: "text-sky-600 dark:text-sky-400",
    },

    delivered: {
      icon: Package,
      message: "Delivered successfully",
      className: "text-emerald-600 dark:text-emerald-400",
    },

    cancelled: {
      icon: XCircle,
      message: "This order was cancelled",
      className: "text-red-600 dark:text-red-400",
    },
  };

  const statusInformation = messages[status] || messages.pending;

  const Icon = statusInformation.icon;

  return (
    <div
      className={`flex items-center gap-2 text-sm ${statusInformation.className}`}
    >
      <Icon size={16} />

      <span className="font-medium">{statusInformation.message}</span>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading state
|--------------------------------------------------------------------------
*/

function OrdersLoading() {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="text-center">
        <LoaderCircle
          size={28}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading your orders...
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Error state
|--------------------------------------------------------------------------
*/

function OrdersError({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-white px-5 py-12 text-center dark:border-red-500/20 dark:bg-slate-900">
      <AlertCircle size={32} className="mx-auto text-red-500" />

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        Unable to load orders
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        <RotateCcw size={15} />
        Try again
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty state
|--------------------------------------------------------------------------
*/

function EmptyOrders({ hasOrders, onReset }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Package size={25} />
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        {hasOrders ? "No matching orders" : "You have no orders yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {hasOrders
          ? "Try changing your search or selected filter."
          : "After you place an order, it will appear here."}
      </p>

      {hasOrders ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Clear filters
        </button>
      ) : (
        <Link
          to="/products"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Start shopping
        </Link>
      )}
    </div>
  );
}
