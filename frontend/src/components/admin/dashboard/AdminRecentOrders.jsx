import { ArrowRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const orders = [
  {
    id: "#CM-10482",
    customer: "Rahul Sharma",
    email: "rahul@example.com",
    amount: "₹8,499",
    payment: "Paid",
    status: "Processing",
    date: "Today, 10:42 AM",
  },
  {
    id: "#CM-10481",
    customer: "Priya Patel",
    email: "priya@example.com",
    amount: "₹3,299",
    payment: "Paid",
    status: "Shipped",
    date: "Today, 09:18 AM",
  },
  {
    id: "#CM-10480",
    customer: "Arjun Mehta",
    email: "arjun@example.com",
    amount: "₹12,999",
    payment: "Paid",
    status: "Delivered",
    date: "Yesterday, 06:24 PM",
  },
  {
    id: "#CM-10479",
    customer: "Sneha Kapoor",
    email: "sneha@example.com",
    amount: "₹2,499",
    payment: "Pending",
    status: "Pending",
    date: "Yesterday, 04:51 PM",
  },
  {
    id: "#CM-10478",
    customer: "Vikram Singh",
    email: "vikram@example.com",
    amount: "₹6,799",
    payment: "Paid",
    status: "Delivered",
    date: "Yesterday, 02:15 PM",
  },
];

const statusStyles = {
  Processing: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",

  Shipped:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",

  Delivered:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",

  Pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};

const paymentStyles = {
  Paid: "text-emerald-600 dark:text-emerald-400",

  Pending: "text-amber-600 dark:text-amber-400",

  Failed: "text-red-500 dark:text-red-400",
};

export default function AdminRecentOrders() {
  const navigate = useNavigate();

  const handleViewOrder = (order) => {
    console.log("View order:", order.id);

    // Later connect this to the admin order details route.
  };

  return (
    <section
      className="
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
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-b
          border-slate-100
          px-4
          py-4
          sm:px-5
          dark:border-slate-800
        "
      >
        <div>
          <h2 className="text-sm font-bold text-slate-950 dark:text-white">
            Recent Orders
          </h2>

          <p className="mt-0.5 text-[11px] text-slate-400">
            Latest customer orders
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="
            inline-flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-emerald-600
            transition-colors
            hover:text-emerald-700
            dark:text-emerald-400
            dark:hover:text-emerald-300
          "
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ============================================================
          DESKTOP TABLE
      ============================================================ */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr
              className="
                border-b
                border-slate-100
                text-left
                dark:border-slate-800
              "
            >
              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Order
              </th>

              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Customer
              </th>

              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Amount
              </th>

              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Payment
              </th>

              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Date
              </th>

              <th className="px-5 py-3" />
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="
                  border-b
                  border-slate-100
                  last:border-0
                  transition-colors
                  hover:bg-slate-50/70
                  dark:border-slate-800
                  dark:hover:bg-slate-800/40
                "
              >
                {/* Order */}

                <td className="px-5 py-4">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {order.id}
                  </span>
                </td>

                {/* Customer */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-50
                        text-[10px]
                        font-bold
                        text-emerald-700
                        dark:bg-emerald-950/50
                        dark:text-emerald-400
                      "
                    >
                      {order.customer
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {order.customer}
                      </p>

                      <p className="truncate text-[10px] text-slate-400">
                        {order.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Amount */}

                <td className="px-5 py-4">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {order.amount}
                  </span>
                </td>

                {/* Payment */}

                <td className="px-5 py-4">
                  <span
                    className={`
                      text-xs
                      font-semibold
                      ${paymentStyles[order.payment] || "text-slate-500"}
                    `}
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
                      text-[10px]
                      font-semibold
                      ${statusStyles[order.status]}
                    `}
                  >
                    {order.status}
                  </span>
                </td>

                {/* Date */}

                <td className="whitespace-nowrap px-5 py-4 text-[10px] text-slate-400">
                  {order.date}
                </td>

                {/* Action */}

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleViewOrder(order)}
                    aria-label={`View ${order.id}`}
                    className="
                      inline-flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      text-slate-400
                      transition-colors
                      hover:bg-slate-100
                      hover:text-slate-700
                      dark:hover:bg-slate-800
                      dark:hover:text-white
                    "
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============================================================
          MOBILE CARDS
      ============================================================ */}

      <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {orders.map((order) => (
          <article key={order.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {order.id}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">{order.date}</p>
              </div>

              <button
                type="button"
                onClick={() => handleViewOrder(order)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                "
              >
                <Eye size={15} />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2.5">
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-50
                  text-[10px]
                  font-bold
                  text-emerald-700
                  dark:bg-emerald-950/50
                  dark:text-emerald-400
                "
              >
                {order.customer
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {order.customer}
                </p>

                <p className="truncate text-[10px] text-slate-400">
                  {order.email}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-slate-400">Amount</p>

                <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                  {order.amount}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">Payment</p>

                <p
                  className={`
                    mt-0.5
                    text-xs
                    font-semibold
                    ${paymentStyles[order.payment] || "text-slate-500"}
                  `}
                >
                  {order.payment}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">Status</p>

                <span
                  className={`
                    mt-1
                    inline-flex
                    rounded-full
                    px-2
                    py-1
                    text-[10px]
                    font-semibold
                    ${statusStyles[order.status]}
                  `}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
