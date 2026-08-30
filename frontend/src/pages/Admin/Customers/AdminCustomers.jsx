import { Eye, Filter, MoreHorizontal, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const customers = [
  {
    id: "CUS-1001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    orders: 12,
    spending: 68499,
    status: "Active",
    lastOrder: "18 Aug 2026",
  },
  {
    id: "CUS-1002",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 91234 56789",
    orders: 8,
    spending: 42990,
    status: "Active",
    lastOrder: "18 Aug 2026",
  },
  {
    id: "CUS-1003",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    phone: "+91 99887 77665",
    orders: 5,
    spending: 91750,
    status: "Active",
    lastOrder: "17 Aug 2026",
  },
  {
    id: "CUS-1004",
    name: "Neha Singh",
    email: "neha@example.com",
    phone: "+91 98761 22445",
    orders: 3,
    spending: 18499,
    status: "Active",
    lastOrder: "17 Aug 2026",
  },
  {
    id: "CUS-1005",
    name: "Vikram Rao",
    email: "vikram@example.com",
    phone: "+91 98123 77654",
    orders: 15,
    spending: 124890,
    status: "Active",
    lastOrder: "16 Aug 2026",
  },
  {
    id: "CUS-1006",
    name: "Ananya Kapoor",
    email: "ananya@example.com",
    phone: "+91 97654 33881",
    orders: 7,
    spending: 56999,
    status: "Active",
    lastOrder: "16 Aug 2026",
  },
  {
    id: "CUS-1007",
    name: "Karan Verma",
    email: "karan@example.com",
    phone: "+91 98989 11122",
    orders: 2,
    spending: 11999,
    status: "Blocked",
    lastOrder: "15 Aug 2026",
  },
  {
    id: "CUS-1008",
    name: "Sneha Joshi",
    email: "sneha@example.com",
    phone: "+91 90012 34567",
    orders: 10,
    spending: 75990,
    status: "Active",
    lastOrder: "15 Aug 2026",
  },
];

const statusOptions = ["All", "Active", "Blocked"];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusClasses(status) {
  if (status === "Active") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
  }

  return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
}

export default function AdminCustomers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.id.toLowerCase().includes(query) ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query);

      const matchesStatus = status === "All" || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  ).length;

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.spending,
    0,
  );

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
              Customers
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
              Customers
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage customer accounts, orders and spending.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users size={15} />

            <span>{filteredCustomers.length} customers</span>
          </div>
        </div>

        {/* ======================================================
            SUMMARY
        ====================================================== */}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
            <p className="text-xs text-slate-400">Total customers</p>

            <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
              {totalCustomers}
            </p>
          </div>

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
            <p className="text-xs text-slate-400">Active customers</p>

            <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {activeCustomers}
            </p>
          </div>

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
            <p className="text-xs text-slate-400">Customer spending</p>

            <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* ======================================================
            FILTER BAR
        ====================================================== */}

        <section
          className="
            mt-5
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
              sm:flex-row
              sm:items-center
            "
          >
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, phone or customer ID..."
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

            <div className="relative">
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

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
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
                  sm:w-40
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-slate-300
                "
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "All" ? "All customers" : option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ======================================================
            CUSTOMER TABLE
        ====================================================== */}

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
          {/* Desktop */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[950px]">
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
                    Customer
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Contact
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Orders
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Total spending
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Last order
                  </th>

                  <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
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
                    {/* Customer */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-50
                            text-xs
                            font-bold
                            text-emerald-700
                            dark:bg-emerald-950/50
                            dark:text-emerald-400
                          "
                        >
                          {getInitials(customer.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {customer.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {customer.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}

                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {customer.email}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {customer.phone}
                      </p>
                    </td>

                    {/* Orders */}

                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {customer.orders}
                      </span>
                    </td>

                    {/* Spending */}

                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{customer.spending.toLocaleString("en-IN")}
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
                          ${getStatusClasses(customer.status)}
                        `}
                      >
                        {customer.status}
                      </span>
                    </td>

                    {/* Last order */}

                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {customer.lastOrder}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="relative px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === customer.id ? null : customer.id,
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
                        aria-label="Customer actions"
                      >
                        <MoreHorizontal size={17} />
                      </button>

                      {openMenu === customer.id && (
                        <div
                          className="
                            absolute
                            right-5
                            top-12
                            z-20
                            w-44
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
                              navigate(`/admin/customers/${customer.id}`)
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
                            View customer
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ====================================================
              MOBILE
          ==================================================== */}

          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {filteredCustomers.map((customer) => (
              <article key={customer.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-50
                        text-xs
                        font-bold
                        text-emerald-700
                        dark:bg-emerald-950/50
                        dark:text-emerald-400
                      "
                    >
                      {getInitials(customer.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {customer.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      ${getStatusClasses(customer.status)}
                    `}
                  >
                    {customer.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400">Orders</p>

                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {customer.orders}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Total spending</p>

                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      ₹{customer.spending.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Phone</p>

                    <p className="mt-1 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                      {customer.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Last order</p>

                    <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {customer.lastOrder}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/admin/customers/${customer.id}`)}
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
                  View customer
                </button>
              </article>
            ))}
          </div>

          {/* Empty state */}

          {!filteredCustomers.length && (
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
                <Users size={20} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                No customers found
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or status filter.
              </p>
            </div>
          )}
        </section>

        <div className="mt-4 text-xs text-slate-400">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>
    </main>
  );
}
