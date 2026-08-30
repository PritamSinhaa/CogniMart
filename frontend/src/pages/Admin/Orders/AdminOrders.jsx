import {
  ChevronDown,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const orders = [
  {
    id: "CM-10482",
    customer: "Rahul Sharma",
    email: "rahul@example.com",
    items: 3,
    amount: 12499,
    payment: "Paid",
    status: "Delivered",
    date: "18 Aug 2026",
  },
  {
    id: "CM-10481",
    customer: "Priya Patel",
    email: "priya@example.com",
    items: 2,
    amount: 8499,
    payment: "Paid",
    status: "Shipped",
    date: "18 Aug 2026",
  },
  {
    id: "CM-10480",
    customer: "Arjun Mehta",
    email: "arjun@example.com",
    items: 1,
    amount: 34999,
    payment: "Paid",
    status: "Processing",
    date: "17 Aug 2026",
  },
  {
    id: "CM-10479",
    customer: "Neha Singh",
    email: "neha@example.com",
    items: 4,
    amount: 18499,
    payment: "Pending",
    status: "Pending",
    date: "17 Aug 2026",
  },
  {
    id: "CM-10478",
    customer: "Vikram Rao",
    email: "vikram@example.com",
    items: 2,
    amount: 7299,
    payment: "Paid",
    status: "Delivered",
    date: "16 Aug 2026",
  },
  {
    id: "CM-10477",
    customer: "Ananya Kapoor",
    email: "ananya@example.com",
    items: 1,
    amount: 56999,
    payment: "Paid",
    status: "Shipped",
    date: "16 Aug 2026",
  },
  {
    id: "CM-10476",
    customer: "Karan Verma",
    email: "karan@example.com",
    items: 3,
    amount: 11999,
    payment: "Failed",
    status: "Cancelled",
    date: "15 Aug 2026",
  },
  {
    id: "CM-10475",
    customer: "Sneha Joshi",
    email: "sneha@example.com",
    items: 2,
    amount: 15999,
    payment: "Paid",
    status: "Processing",
    date: "15 Aug 2026",
  },
];

const statusOptions = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const paymentOptions = [
  "All",
  "Paid",
  "Pending",
  "Failed",
];

function getStatusClasses(status) {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";

    case "Shipped":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

    case "Processing":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";

    case "Pending":
      return "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

    case "Cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";

    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

function getPaymentClasses(payment) {
  switch (payment) {
    case "Paid":
      return "text-emerald-600 dark:text-emerald-400";

    case "Pending":
      return "text-amber-600 dark:text-amber-400";

    case "Failed":
      return "text-red-600 dark:text-red-400";

    default:
      return "text-slate-500";
  }
}

export default function AdminOrders() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [payment, setPayment] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || order.status === status;

      const matchesPayment =
        payment === "All" || order.payment === payment;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [search, status, payment]);

  return (
    <main
      className="
        min-h-full
        bg-slate-50
        px-4
        py-5
        sm:px-6
        sm:py-6
        lg:px-8
        lg:py-7
        xl:px-10
        dark:bg-slate-950
      "
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* ========================================================
            PAGE HEADER
        ======================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-emerald-600
                dark:text-emerald-400
              "
            >
              Sales
            </p>

            <h1
              className="
                mt-1
                text-2xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-[26px]
                dark:text-white
              "
            >
              Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage customer orders, payments and fulfillment.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-slate-400
            "
          >
            <ShoppingBag size={15} />
            <span>
              {filteredOrders.length} orders
            </span>
          </div>
        </div>

        {/* ========================================================
            FILTER BAR
        ======================================================== */}

        <section
          className="
            mt-6
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
              lg:items-center
            "
          >
            {/* Search */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by order ID, customer or email..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-10
                  pr-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-emerald-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-emerald-500/10
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                  dark:focus:bg-slate-950
                "
              />
            </div>

            {/* Status */}

            <div className="relative">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="
                  h-11
                  w-full
                  appearance-none
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  pl-10
                  pr-9
                  text-sm
                  font-medium
                  text-slate-700
                  outline-none
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/10
                  sm:w-44
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-slate-300
                "
              >
                {statusOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option === "All"
                      ? "All statuses"
                      : option}
                  </option>
                ))}
              </select>

              <Filter
                size={15}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <ChevronDown
                size={15}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />
            </div>

            {/* Payment */}

            <div className="relative">
              <select
                value={payment}
                onChange={(event) =>
                  setPayment(event.target.value)
                }
                className="
                  h-11
                  w-full
                  appearance-none
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  pr-9
                  text-sm
                  font-medium
                  text-slate-700
                  outline-none
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/10
                  sm:w-40
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-slate-300
                "
              >
                {paymentOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option === "All"
                      ? "All payments"
                      : option}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            ORDERS TABLE
        ======================================================== */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          {/* Desktop table */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr
                  className="
                    border-b
                    border-slate-200
                    bg-slate-50/80
                    dark:border-slate-800
                    dark:bg-slate-950/50
                  "
                >
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Order
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Customer
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Payment
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </th>

                  <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="
                      border-b
                      border-slate-100
                      transition-colors
                      last:border-0
                      hover:bg-slate-50/70
                      dark:border-slate-800/80
                      dark:hover:bg-slate-800/30
                    "
                  >
                    {/* Order */}

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order.id}`,
                          )
                        }
                        className="
                          text-sm
                          font-bold
                          text-slate-900
                          hover:text-emerald-600
                          dark:text-white
                          dark:hover:text-emerald-400
                        "
                      >
                        {order.id}
                      </button>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {order.items}{" "}
                        {order.items === 1
                          ? "item"
                          : "items"}
                      </p>
                    </td>

                    {/* Customer */}

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {order.customer}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {order.email}
                      </p>
                    </td>

                    {/* Amount */}

                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹
                        {order.amount.toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </td>

                    {/* Payment */}

                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-bold ${getPaymentClasses(
                          order.payment,
                        )}`}
                      >
                        {order.payment}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-2.5
                          py-1
                          text-[11px]
                          font-bold
                          ${getStatusClasses(
                            order.status,
                          )}
                        `}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Date */}

                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {order.date}
                      </span>
                    </td>

                    {/* Action */}

                    <td className="relative px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === order.id
                              ? null
                              : order.id,
                          )
                        }
                        className="
                          inline-flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          hover:bg-slate-100
                          hover:text-slate-700
                          dark:hover:bg-slate-800
                          dark:hover:text-white
                        "
                        aria-label="Order actions"
                      >
                        <MoreHorizontal size={17} />
                      </button>

                      {openMenu === order.id && (
                        <div
                          className="
                            absolute
                            right-5
                            top-12
                            z-20
                            w-40
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            py-1
                            text-left
                            shadow-xl
                            dark:border-slate-700
                            dark:bg-slate-900
                          "
                        >
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/orders/${order.id}`,
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              gap-2
                              px-3
                              py-2.5
                              text-xs
                              font-semibold
                              text-slate-700
                              hover:bg-slate-50
                              dark:text-slate-300
                              dark:hover:bg-slate-800
                            "
                          >
                            <Eye size={14} />
                            View order
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ======================================================
              MOBILE ORDER CARDS
          ====================================================== */}

          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {filteredOrders.map((order) => (
              <article
                key={order.id}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/orders/${order.id}`,
                        )
                      }
                      className="text-sm font-bold text-slate-900 dark:text-white"
                    >
                      {order.id}
                    </button>

                    <p className="mt-1 text-xs text-slate-400">
                      {order.date}
                    </p>
                  </div>

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      ${getStatusClasses(
                        order.status,
                      )}
                    `}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {order.customer}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {order.email}
                  </p>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      Total
                    </p>

                    <p className="mt-0.5 text-base font-bold text-slate-950 dark:text-white">
                      ₹
                      {order.amount.toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      Payment
                    </p>

                    <p
                      className={`mt-0.5 text-xs font-bold ${getPaymentClasses(
                        order.payment,
                      )}`}
                    >
                      {order.payment}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/orders/${order.id}`,
                    )
                  }
                  className="
                    mt-4
                    flex
                    h-10
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    text-xs
                    font-semibold
                    text-slate-700
                    transition-colors
                    hover:bg-slate-50
                    dark:border-slate-700
                    dark:text-slate-300
                    dark:hover:bg-slate-800
                  "
                >
                  <Eye size={14} />
                  View order
                </button>
              </article>
            ))}
          </div>

          {/* Empty state */}

          {!filteredOrders.length && (
            <div className="px-6 py-16 text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-400
                  dark:bg-slate-800
                "
              >
                <ShoppingBag size={20} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                No orders found
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </section>

        {/* ========================================================
            FOOTER INFO
        ======================================================== */}

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {filteredOrders.length} of{" "}
            {orders.length} orders
          </span>
        </div>
      </div>
    </main>
  );
}