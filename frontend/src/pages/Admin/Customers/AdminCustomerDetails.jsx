import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const customerData = {
  "CUS-1001": {
    id: "CUS-1001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    status: "Active",
    joined: "12 Jan 2025",
    location: "New Delhi, India",
    orders: 12,
    spending: 68499,
    averageOrder: 5708,
    ordersHistory: [
      {
        id: "CM-10482",
        date: "18 Aug 2026",
        items: 3,
        amount: 38206,
        status: "Delivered",
        payment: "Paid",
      },
      {
        id: "CM-10391",
        date: "09 Aug 2026",
        items: 2,
        amount: 7499,
        status: "Delivered",
        payment: "Paid",
      },
      {
        id: "CM-10274",
        date: "28 Jul 2026",
        items: 1,
        amount: 12999,
        status: "Delivered",
        payment: "Paid",
      },
      {
        id: "CM-10182",
        date: "12 Jul 2026",
        items: 4,
        amount: 18495,
        status: "Delivered",
        payment: "Paid",
      },
    ],
  },

  "CUS-1002": {
    id: "CUS-1002",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 91234 56789",
    status: "Active",
    joined: "04 Mar 2025",
    location: "Ahmedabad, India",
    orders: 8,
    spending: 42990,
    averageOrder: 5374,
    ordersHistory: [
      {
        id: "CM-10481",
        date: "18 Aug 2026",
        items: 2,
        amount: 25637,
        status: "Shipped",
        payment: "Paid",
      },
      {
        id: "CM-10312",
        date: "02 Aug 2026",
        items: 1,
        amount: 8499,
        status: "Delivered",
        payment: "Paid",
      },
      {
        id: "CM-10198",
        date: "18 Jul 2026",
        items: 2,
        amount: 8854,
        status: "Delivered",
        payment: "Paid",
      },
    ],
  },
};

const fallbackCustomer = {
  id: "CUS-1000",
  name: "Arjun Mehta",
  email: "arjun@example.com",
  phone: "+91 99887 77665",
  status: "Active",
  joined: "21 Feb 2025",
  location: "Bengaluru, India",
  orders: 5,
  spending: 91750,
  averageOrder: 18350,
  ordersHistory: [
    {
      id: "CM-10480",
      date: "17 Aug 2026",
      items: 1,
      amount: 40118,
      status: "Processing",
      payment: "Paid",
    },
    {
      id: "CM-10291",
      date: "31 Jul 2026",
      items: 2,
      amount: 22150,
      status: "Delivered",
      payment: "Paid",
    },
    {
      id: "CM-10173",
      date: "10 Jul 2026",
      items: 1,
      amount: 29482,
      status: "Delivered",
      payment: "Paid",
    },
  ],
};

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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

export default function AdminCustomerDetails() {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const customer = customerData[customerId] || {
    ...fallbackCustomer,
    id: customerId || fallbackCustomer.id,
  };

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
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/customers")}
            aria-label="Back to customers"
            className="
              mt-0.5
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-500
              shadow-sm
              transition
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-600
              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-400
              dark:hover:border-emerald-900
              dark:hover:bg-emerald-950/30
            "
          >
            <ArrowLeft size={17} />
          </button>

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
              Customer
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
              Customer details
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View customer information and order history.
            </p>
          </div>
        </div>

        {/* ======================================================
            CUSTOMER PROFILE
        ====================================================== */}

        <section
          className="
            mt-6
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            sm:p-6
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="flex min-w-0 items-center gap-4">
              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-emerald-50
                  text-lg
                  font-bold
                  text-emerald-700
                  ring-1
                  ring-emerald-100
                  dark:bg-emerald-950/50
                  dark:text-emerald-400
                  dark:ring-emerald-900
                "
              >
                {getInitials(customer.name)}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-bold text-slate-950 dark:text-white">
                    {customer.name}
                  </h2>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-emerald-50
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-emerald-700
                      dark:bg-emerald-950/40
                      dark:text-emerald-400
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {customer.status}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">{customer.id}</p>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} />
                    {customer.email}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={13} />
                    {customer.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="
                  inline-flex
                  h-10
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  text-xs
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  sm:flex-none
                  dark:border-slate-700
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >
                <Mail size={14} />
                Contact
              </button>

              <button
                type="button"
                className="
                  inline-flex
                  h-10
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-emerald-600
                  px-4
                  text-xs
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-emerald-700
                  sm:flex-none
                "
              >
                Edit customer
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={ShoppingBag}
            label="Total orders"
            value={customer.orders}
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Total spending"
            value={`₹${customer.spending.toLocaleString("en-IN")}`}
            accent
          />

          <SummaryCard
            icon={ShoppingBag}
            label="Average order value"
            value={`₹${customer.averageOrder.toLocaleString("en-IN")}`}
          />

          <SummaryCard
            icon={CalendarDays}
            label="Customer since"
            value={customer.joined}
          />
        </div>

        {/* ======================================================
            CONTENT GRID
        ====================================================== */}

        <div
          className="
            mt-5
            grid
            gap-5
            xl:grid-cols-[minmax(0,1fr)_330px]
          "
        >
          {/* ====================================================
              ORDER HISTORY
          ==================================================== */}

          <section
            className="
              min-w-0
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
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-5
                py-4
                dark:border-slate-800
              "
            >
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Order history
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Recent orders from this customer.
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {customer.orders} total
              </span>
            </div>

            {/* Desktop table */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr
                    className="
                      border-b
                      border-slate-100
                      bg-slate-50/70
                      dark:border-slate-800
                      dark:bg-slate-950/40
                    "
                  >
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Order
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Items
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customer.ordersHistory.map((order) => (
                    <tr
                      key={order.id}
                      className="
                        border-b
                        border-slate-100
                        last:border-0
                        hover:bg-slate-50/70
                        dark:border-slate-800
                        dark:hover:bg-slate-800/30
                      "
                    >
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {order.id}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {order.payment}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {order.date}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {order.items}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            ${getStatusClasses(order.status)}
                          `}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="
                            inline-flex
                            h-8
                            items-center
                            gap-1.5
                            rounded-lg
                            px-2.5
                            text-xs
                            font-semibold
                            text-slate-500
                            transition
                            hover:bg-slate-100
                            hover:text-emerald-600
                            dark:text-slate-400
                            dark:hover:bg-slate-800
                            dark:hover:text-emerald-400
                          "
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}

            <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
              {customer.ordersHistory.map((order) => (
                <article key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {order.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.date}
                      </p>
                    </div>

                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        ${getStatusClasses(order.status)}
                      `}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-slate-400">Items</p>

                      <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {order.items}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400">Amount</p>

                      <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="
                      mt-4
                      flex
                      h-9
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
                      transition
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
          </section>

          {/* ====================================================
              RIGHT SIDEBAR
          ==================================================== */}

          <div className="space-y-5">
            {/* Contact information */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Contact information
              </h2>

              <div className="mt-4 space-y-4">
                <InfoRow icon={Mail} label="Email" value={customer.email} />

                <InfoRow icon={Phone} label="Phone" value={customer.phone} />

                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value={customer.location}
                />

                <InfoRow
                  icon={CalendarDays}
                  label="Customer since"
                  value={customer.joined}
                />
              </div>
            </section>

            {/* Account */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Account
                </h2>

                <User size={17} className="text-slate-400" />
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Account status</span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {customer.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Customer ID</span>

                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {customer.id}
                  </span>
                </div>
              </div>
            </section>

            {/* Quick actions */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Quick actions
                </h2>

                <MoreHorizontal size={17} className="text-slate-400" />
              </div>

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  className="
                    flex
                    h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    text-xs
                    font-semibold
                    text-slate-700
                    transition
                    hover:border-emerald-200
                    hover:bg-emerald-50
                    hover:text-emerald-700
                    dark:border-slate-700
                    dark:text-slate-300
                    dark:hover:border-emerald-900
                    dark:hover:bg-emerald-950/30
                    dark:hover:text-emerald-400
                  "
                >
                  <Mail size={14} />
                  Send message
                </button>

                <button
                  type="button"
                  className="
                    flex
                    h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-red-200
                    text-xs
                    font-semibold
                    text-red-600
                    transition
                    hover:bg-red-50
                    dark:border-red-900/50
                    dark:text-red-400
                    dark:hover:bg-red-950/30
                  "
                >
                  Block customer
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div
      className="
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
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{label}</p>

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            bg-slate-50
            text-slate-400
            dark:bg-slate-800
          "
        >
          <Icon size={15} />
        </div>
      </div>

      <p
        className={`
          mt-3
          text-lg
          font-bold
          ${
            accent
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-950 dark:text-white"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-slate-50
          text-slate-400
          dark:bg-slate-800
        "
      >
        <Icon size={14} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-slate-400">{label}</p>

        <p className="mt-0.5 break-words text-xs font-semibold text-slate-700 dark:text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}
