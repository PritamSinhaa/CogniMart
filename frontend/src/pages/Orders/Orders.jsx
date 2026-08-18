import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Package,
  Search,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";

const orders = [
  {
    id: "CGM-2026-00124",
    date: "18 Aug 2026",
    status: "Delivered",
    statusType: "success",
    total: 52989,
    items: 2,
    products: [
      {
        name: "Sony WH-1000XM5",
        variant: "Black",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Apple AirPods Pro",
        variant: "White",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    id: "CGM-2026-00118",
    date: "15 Aug 2026",
    status: "Shipped",
    statusType: "info",
    total: 14999,
    items: 1,
    products: [
      {
        name: "Nike Air Max",
        variant: "Black / White",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    id: "CGM-2026-00102",
    date: "10 Aug 2026",
    status: "Processing",
    statusType: "warning",
    total: 8499,
    items: 1,
    products: [
      {
        name: "Mechanical Keyboard",
        variant: "RGB / Black",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
];

const filters = [
  "All orders",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Orders() {
  const [activeFilter, setActiveFilter] =
    useState("All orders");

  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "All orders" ||
      order.status === activeFilter;

    const searchValue = search.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(searchValue) ||
      order.products.some((product) =>
        product.name.toLowerCase().includes(searchValue)
      );

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

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

          {/* Search */}

          <div className="relative w-full sm:w-64">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="
                h-10
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                pl-9
                pr-3
                text-sm
                text-slate-900
                outline-none
                transition-all
                placeholder:text-slate-400
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-white
              "
            />
          </div>
        </div>

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`
                  shrink-0
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition-colors
                  ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* =====================================================
            ORDER LIST
        ====================================================== */}

        <div className="mt-5 space-y-4">

          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                {/* Order Header */}

                <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

                    <div>
                      <p className="text-xs text-slate-400">
                        Order ID
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                        {order.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="text-slate-400"
                      />

                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {order.date}
                      </span>
                    </div>

                    <OrderStatus
                      status={order.status}
                      type={order.statusType}
                    />
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatPrice(order.total)}
                  </p>
                </div>

                {/* Products */}

                <div className="px-4 py-4">

                  <div className="flex flex-col gap-4">

                    {order.products.map((product) => (
                      <div
                        key={product.name}
                        className="flex items-center gap-3"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {product.variant}
                          </p>

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Qty: {product.quantity}
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>

                  {/* Bottom */}

                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                    <DeliveryMessage
                      status={order.status}
                    />

                    <Link
                      to={`/orders/${order.id}`}
                      className="
                        group
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-200
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-slate-700
                        transition-all
                        hover:border-emerald-500
                        hover:text-emerald-600
                        dark:border-slate-700
                        dark:text-slate-200
                        dark:hover:border-emerald-500
                        dark:hover:text-emerald-500
                      "
                    >
                      View order

                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyOrders />
          )}
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   ORDER STATUS
============================================================ */

function OrderStatus({ status, type }) {
  const styles = {
    success:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    info:
      "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    warning:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ${styles[type]}
      `}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ============================================================
   DELIVERY MESSAGE
============================================================ */

function DeliveryMessage({ status }) {
  if (status === "Delivered") {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600">
        <Package size={16} />

        <span className="font-medium">
          Delivered successfully
        </span>
      </div>
    );
  }

  if (status === "Shipped") {
    return (
      <div className="flex items-center gap-2 text-sm text-sky-600">
        <Truck size={16} />

        <span className="font-medium">
          Your order is on the way
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-amber-600">
      <Package size={16} />

      <span className="font-medium">
        Preparing your order
      </span>
    </div>
  );
}

/* ============================================================
   EMPTY ORDERS
============================================================ */

function EmptyOrders() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center dark:border-slate-800 dark:bg-slate-900">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Package size={25} />
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        No orders found
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        We couldn't find any orders matching your search or
        selected filter.
      </p>

      <Link
        to="/"
        className="
          mt-5
          inline-flex
          h-10
          items-center
          justify-center
          rounded-lg
          bg-emerald-600
          px-5
          text-sm
          font-semibold
          text-white
          transition-colors
          hover:bg-emerald-700
        "
      >
        Continue shopping
      </Link>
    </div>
  );
}