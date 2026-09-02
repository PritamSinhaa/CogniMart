import {
  AlertCircle,
  BadgeIndianRupee,
  Eye,
  LoaderCircle,
  Package,
  RefreshCw,
  Search,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { getAllOrders } from "../../../api/order.api";

import { getUsers } from "../../../api/users.api";

const CUSTOMERS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All statuses",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];

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
    return "No orders";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function getShortUserId(userId) {
  if (!userId) {
    return "UNKNOWN";
  }

  return userId.slice(-8).toUpperCase();
}

function createInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function extractUsers(response) {
  const users = Array.isArray(response?.data)
    ? response.data
    : response?.data?.users || response?.users || [];

  return Array.isArray(users) ? users : [];
}

function extractOrders(response) {
  const orders = response?.data?.orders || response?.orders || [];

  return Array.isArray(orders) ? orders : [];
}

function getOrderUserId(order) {
  if (typeof order?.user === "object") {
    return order.user?._id;
  }

  return order?.user;
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to load customers.";
}

/*
 * Join users with their orders.
 *
 * Revenue includes delivered orders
 * only so cancelled or incomplete
 * orders are not counted as spending.
 */
function createCustomerRecords(users, orders) {
  return users
    .filter((user) => user.role === "customer")
    .map((user) => {
      const customerOrders = orders.filter(
        (order) => String(getOrderUserId(order)) === String(user._id),
      );

      const deliveredOrders = customerOrders.filter(
        (order) => order.orderStatus === "delivered",
      );

      const spending = deliveredOrders.reduce(
        (total, order) => total + (Number(order.total) || 0),
        0,
      );

      const lastOrderAt = customerOrders.reduce((latest, order) => {
        const orderTime = new Date(order.createdAt).getTime();

        if (Number.isNaN(orderTime)) {
          return latest;
        }

        return Math.max(latest, orderTime);
      }, 0);

      return {
        ...user,

        orderCount: customerOrders.length,

        deliveredOrderCount: deliveredOrders.length,

        spending,

        lastOrderAt:
          lastOrderAt > 0 ? new Date(lastOrderAt).toISOString() : null,
      };
    });
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | Load users and orders
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let active = true;

    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersResponse, ordersResponse] = await Promise.all([
          getUsers(),
          getAllOrders(),
        ]);

        if (!active) {
          return;
        }

        const users = extractUsers(usersResponse);

        const orders = extractOrders(ordersResponse);

        setCustomers(createCustomerRecords(users, orders));
      } catch (requestError) {
        if (active) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  /*
  |--------------------------------------------------------------------------
  | Search and filters
  |--------------------------------------------------------------------------
  */

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const searchableText = [
        customer._id,
        getShortUserId(customer._id),
        customer.name,
        customer.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesStatus =
        status === "all" ||
        (status === "active" && customer.isActive !== false) ||
        (status === "inactive" && customer.isActive === false);

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, status]);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const summary = useMemo(
    () => ({
      total: customers.length,

      active: customers.filter((customer) => customer.isActive !== false)
        .length,

      inactive: customers.filter((customer) => customer.isActive === false)
        .length,

      orders: customers.reduce(
        (total, customer) => total + customer.orderCount,
        0,
      ),

      revenue: customers.reduce(
        (total, customer) => total + customer.spending,
        0,
      ),
    }),
    [customers],
  );

  const totalPages = Math.max(
    Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE),
    1,
  );

  const safePage = Math.min(page, totalPages);

  const visibleCustomers = filteredCustomers.slice(
    (safePage - 1) * CUSTOMERS_PER_PAGE,

    safePage * CUSTOMERS_PER_PAGE,
  );

  if (loading) {
    return <CustomersLoading />;
  }

  if (error) {
    return (
      <CustomersError
        message={error}
        onRetry={() => setReloadKey((current) => current + 1)}
      />
    );
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <CustomersHeader count={filteredCustomers.length} />

        <CustomerSummary summary={summary} />

        <CustomerFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        {visibleCustomers.length > 0 ? (
          <>
            <CustomerDesktopTable customers={visibleCustomers} />

            <CustomerMobileList customers={visibleCustomers} />

            <Pagination
              page={safePage}
              totalPages={totalPages}
              totalItems={filteredCustomers.length}
              onPageChange={setPage}
            />
          </>
        ) : (
          <CustomersEmpty
            filtered={customers.length > 0}
            onClearFilters={() => {
              setSearch("");
              setStatus("all");
            }}
          />
        )}
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function CustomersHeader({ count }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          Accounts
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[26px]">
          Customers
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage customer accounts and view their order activity.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Users size={15} />

        <span>
          {count} {count === 1 ? "customer" : "customers"}
        </span>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Summary
|--------------------------------------------------------------------------
*/

function CustomerSummary({ summary }) {
  const cards = [
    {
      label: "Total customers",
      value: summary.total,
      icon: Users,
      color: "text-slate-700 dark:text-slate-200",
    },
    {
      label: "Active customers",
      value: summary.active,
      icon: UserCheck,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Customer orders",
      value: summary.orders,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Delivered revenue",
      value: formatPrice(summary.revenue),
      icon: BadgeIndianRupee,
      color: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">{card.label}</p>

                <p className={`mt-1 text-xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>

              <Icon size={18} className={card.color} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

function CustomerFilters({ search, status, onSearchChange, onStatusChange }) {
  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, email or customer ID..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filter customers by status"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 sm:w-44"
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
| Desktop table
|--------------------------------------------------------------------------
*/

function CustomerDesktopTable({ customers }) {
  return (
    <section className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
              <TableHeading>Customer</TableHeading>

              <TableHeading>Status</TableHeading>

              <TableHeading>Orders</TableHeading>

              <TableHeading>Delivered spending</TableHeading>

              <TableHeading>Last order</TableHeading>

              <TableHeading>Joined</TableHeading>

              <TableHeading alignRight>Action</TableHeading>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {customers.map((customer) => (
              <CustomerTableRow key={customer._id} customer={customer} />
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
      className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400 ${
        alignRight ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function CustomerTableRow({ customer }) {
  return (
    <tr className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <CustomerAvatar name={customer.name} />

          <div className="min-w-0">
            <Link
              to={`/admin/customers/${customer._id}`}
              className="block max-w-52 truncate text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white"
            >
              {customer.name}
            </Link>

            <p className="mt-1 max-w-52 truncate text-xs text-slate-400">
              {customer.email}
            </p>

            <p className="mt-1 font-mono text-[10px] text-slate-400">
              #{getShortUserId(customer._id)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <CustomerStatus active={customer.isActive !== false} />
      </td>

      <td className="px-4 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {customer.orderCount}
      </td>

      <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">
        {formatPrice(customer.spending)}
      </td>

      <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
        {formatDate(customer.lastOrderAt)}
      </td>

      <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
        {formatDate(customer.createdAt)}
      </td>

      <td className="px-4 py-4 text-right">
        <Link
          to={`/admin/customers/${customer._id}`}
          aria-label={`View ${customer.name}`}
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
| Mobile cards
|--------------------------------------------------------------------------
*/

function CustomerMobileList({ customers }) {
  return (
    <div className="mt-5 space-y-3 md:hidden">
      {customers.map((customer) => (
        <article
          key={customer._id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start gap-3">
            <CustomerAvatar name={customer.name} />

            <div className="min-w-0 flex-1">
              <Link
                to={`/admin/customers/${customer._id}`}
                className="block truncate text-sm font-bold text-slate-900 hover:text-emerald-600 dark:text-white"
              >
                {customer.name}
              </Link>

              <p className="mt-1 truncate text-xs text-slate-400">
                {customer.email}
              </p>
            </div>

            <CustomerStatus active={customer.isActive !== false} />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
            <MobileDetail label="Orders" value={customer.orderCount} />

            <MobileDetail
              label="Spending"
              value={formatPrice(customer.spending)}
            />

            <MobileDetail
              label="Last order"
              value={formatDate(customer.lastOrderAt)}
            />
          </div>

          <Link
            to={`/admin/customers/${customer._id}`}
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200"
          >
            <Eye size={15} />
            View customer
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

      <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Shared customer UI
|--------------------------------------------------------------------------
*/

function CustomerAvatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
      {createInitials(name) || "CM"}
    </div>
  );
}

function CustomerStatus({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
      }`}
    >
      {active ? <UserCheck size={12} /> : <UserX size={12} />}

      {active ? "Active" : "Inactive"}
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

  const firstItem = (page - 1) * CUSTOMERS_PER_PAGE + 1;

  const lastItem = Math.min(page * CUSTOMERS_PER_PAGE, totalItems);

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
          className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
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
          className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading, error and empty
|--------------------------------------------------------------------------
*/

function CustomersLoading() {
  return (
    <main
      role="status"
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950"
    >
      <div className="text-center">
        <LoaderCircle
          size={29}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Loading customers...
        </p>
      </div>
    </main>
  );
}

function CustomersError({ message, onRetry }) {
  return (
    <main
      role="alert"
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950"
    >
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center dark:border-red-500/20 dark:bg-slate-900">
        <AlertCircle size={35} className="mx-auto text-red-500" />

        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Unable to load customers
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    </main>
  );
}

function CustomersEmpty({ filtered, onClearFilters }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
      <Users size={35} className="mx-auto text-slate-300 dark:text-slate-700" />

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        {filtered ? "No matching customers" : "No customers yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {filtered
          ? "Try changing your search or status filter."
          : "Registered customer accounts will appear here."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
