import {
  AlertCircle,
  ArrowLeft,
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  Eye,
  LoaderCircle,
  Mail,
  Package,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserX,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { getAllOrders } from "../../../api/order.api";

import {
  deactivateUser,
  getUserById,
  updateUserRole,
} from "../../../api/users.api";

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

function getShortId(value) {
  if (!value) {
    return "UNKNOWN";
  }

  return value.slice(-8).toUpperCase();
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

function extractUser(response) {
  return response?.data?.user || response?.user || null;
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
  return (
    error?.data?.message || error?.message || "Unable to complete the request."
  );
}

export default function AdminCustomerDetails() {
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  const [selectedRole, setSelectedRole] = useState("customer");

  const [updatingRole, setUpdatingRole] = useState(false);

  const [deactivating, setDeactivating] = useState(false);

  const [actionError, setActionError] = useState("");

  const [actionSuccess, setActionSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load customer and orders
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let active = true;

    const loadCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const [userResponse, ordersResponse] = await Promise.all([
          getUserById(customerId),
          getAllOrders(),
        ]);

        if (!active) {
          return;
        }

        const loadedCustomer = extractUser(userResponse);

        if (!loadedCustomer) {
          throw new Error("Customer information was not found.");
        }

        const allOrders = extractOrders(ordersResponse);

        const customerOrders = allOrders
          .filter(
            (order) =>
              String(getOrderUserId(order)) === String(loadedCustomer._id),
          )
          .sort(
            (first, second) =>
              new Date(second.createdAt).getTime() -
              new Date(first.createdAt).getTime(),
          );

        setCustomer(loadedCustomer);

        setSelectedRole(loadedCustomer.role || "customer");

        setOrders(customerOrders);
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

    loadCustomer();

    return () => {
      active = false;
    };
  }, [customerId, reloadKey]);

  /*
  |--------------------------------------------------------------------------
  | Calculated statistics
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const deliveredOrders = orders.filter(
      (order) => order.orderStatus === "delivered",
    );

    const cancelledOrders = orders.filter(
      (order) => order.orderStatus === "cancelled",
    );

    const spending = deliveredOrders.reduce(
      (total, order) => total + (Number(order.total) || 0),
      0,
    );

    return {
      totalOrders: orders.length,

      deliveredOrders: deliveredOrders.length,

      cancelledOrders: cancelledOrders.length,

      spending,
    };
  }, [orders]);

  /*
  |--------------------------------------------------------------------------
  | Update role
  |--------------------------------------------------------------------------
  */

  const handleRoleUpdate = async (event) => {
    event.preventDefault();

    if (updatingRole || !customer || selectedRole === customer.role) {
      return;
    }

    const confirmed = window.confirm(
      selectedRole === "admin"
        ? `Promote ${customer.name} to administrator? This gives them access to protected admin features.`
        : `Change ${customer.name}'s role to customer? They will lose admin access.`,
    );

    if (!confirmed) {
      setSelectedRole(customer.role);

      return;
    }

    try {
      setUpdatingRole(true);
      setActionError("");
      setActionSuccess("");

      const response = await updateUserRole(customer._id, selectedRole);

      const updatedUser = extractUser(response);

      setCustomer((currentCustomer) => ({
        ...currentCustomer,
        role: updatedUser?.role || selectedRole,
        updatedAt: updatedUser?.updatedAt || currentCustomer.updatedAt,
      }));

      setActionSuccess(response?.message || "User role updated successfully.");
    } catch (requestError) {
      setSelectedRole(customer.role);

      setActionError(getErrorMessage(requestError));
    } finally {
      setUpdatingRole(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Deactivate account
  |--------------------------------------------------------------------------
  */

  const handleDeactivate = async () => {
    if (deactivating || !customer || customer.isActive === false) {
      return;
    }

    const confirmed = window.confirm(
      `Deactivate ${customer.name}'s account? Your current backend does not provide a reactivation endpoint.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeactivating(true);
      setActionError("");
      setActionSuccess("");

      const response = await deactivateUser(customer._id);

      const updatedUser = extractUser(response);

      setCustomer((currentCustomer) => ({
        ...currentCustomer,
        isActive: updatedUser?.isActive ?? false,
        updatedAt: updatedUser?.updatedAt || currentCustomer.updatedAt,
      }));

      setActionSuccess(
        response?.message || "Account deactivated successfully.",
      );
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
    } finally {
      setDeactivating(false);
    }
  };

  if (loading) {
    return <CustomerDetailsLoading />;
  }

  if (error || !customer) {
    return (
      <CustomerDetailsError
        message={error || "Customer not found."}
        onRetry={() => setReloadKey((current) => current + 1)}
      />
    );
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <CustomerHeader customer={customer} />

        {actionError && <Message type="error" message={actionError} />}

        {actionSuccess && <Message type="success" message={actionSuccess} />}

        <CustomerStatistics statistics={statistics} />

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <CustomerOrderHistory orders={orders} />

          <aside className="space-y-5">
            <CustomerInformation customer={customer} />

            <RoleManagement
              customer={customer}
              selectedRole={selectedRole}
              updating={updatingRole}
              onRoleChange={setSelectedRole}
              onSubmit={handleRoleUpdate}
            />

            <AccountManagement
              customer={customer}
              deactivating={deactivating}
              onDeactivate={handleDeactivate}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function CustomerHeader({ customer }) {
  return (
    <div className="flex items-start gap-3">
      <Link
        to="/admin/customers"
        aria-label="Back to customers"
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
      >
        <ArrowLeft size={17} />
      </Link>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[26px]">
            {customer.name}
          </h1>

          <CustomerStatus active={customer.isActive !== false} />

          <RoleBadge role={customer.role} />
        </div>

        <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
          {customer.email}
        </p>

        <p className="mt-1 font-mono text-xs text-slate-400">
          Customer #{getShortId(customer._id)}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Messages
|--------------------------------------------------------------------------
*/

function Message({ type, message }) {
  const success = type === "success";

  return (
    <div
      role={success ? "status" : "alert"}
      className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
      }`}
    >
      {message}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

function CustomerStatistics({ statistics }) {
  const cards = [
    {
      label: "Total orders",
      value: statistics.totalOrders,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Delivered",
      value: statistics.deliveredOrders,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Cancelled",
      value: statistics.cancelledOrders,
      icon: UserX,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Delivered spending",
      value: formatPrice(statistics.spending),
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
| Order history
|--------------------------------------------------------------------------
*/

function CustomerOrderHistory({ orders }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Order history
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Real orders placed by this account.
          </p>
        </div>

        <Package size={18} className="text-slate-400" />
      </div>

      {orders.length > 0 ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {orders.map((order) => (
            <CustomerOrderRow key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <div className="px-5 py-14 text-center">
          <Package
            size={32}
            className="mx-auto text-slate-300 dark:text-slate-700"
          />

          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            No orders yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            This customer has not placed an order.
          </p>
        </div>
      )}
    </section>
  );
}

function CustomerOrderRow({ order }) {
  const itemCount =
    order.items?.reduce(
      (total, item) => total + (Number(item.quantity) || 0),
      0,
    ) || 0;

  return (
    <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/admin/orders/${order._id}`}
            className="font-mono text-sm font-bold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white"
          >
            #{getShortId(order._id)}
          </Link>

          <OrderStatus status={order.orderStatus} />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          {formatDate(order.createdAt)}
          {" • "}
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {formatPrice(order.total)}
          </p>

          <p className="mt-1 text-xs capitalize text-slate-400">
            {order.paymentStatus}
          </p>
        </div>

        <Link
          to={`/admin/orders/${order._id}`}
          aria-label={`View order ${getShortId(order._id)}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300"
        >
          <Eye size={15} />
        </Link>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Customer information
|--------------------------------------------------------------------------
*/

function CustomerInformation({ customer }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Account information
        </h2>

        <UserCheck size={17} className="text-slate-400" />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          {createInitials(customer.name) || "CM"}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {customer.name}
          </p>

          <p className="truncate text-xs text-slate-400">{customer.email}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
        <InformationRow icon={Mail} label="Email" value={customer.email} />

        <InformationRow
          icon={CalendarDays}
          label="Joined"
          value={formatDate(customer.createdAt)}
        />

        <InformationRow
          icon={ShieldCheck}
          label="Email verification"
          value={customer.isEmailVerified ? "Verified" : "Not verified"}
        />
      </div>
    </section>
  );
}

function InformationRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="mt-0.5 shrink-0 text-slate-400" />

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-1 break-all text-sm font-semibold text-slate-700 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Role management
|--------------------------------------------------------------------------
*/

function RoleManagement({
  customer,
  selectedRole,
  updating,
  onRoleChange,
  onSubmit,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Role management
        </h2>

        <UserCog size={17} className="text-slate-400" />
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        Administrators can access protected management pages.
      </p>

      <form onSubmit={onSubmit} className="mt-4">
        <select
          value={selectedRole}
          onChange={(event) => onRoleChange(event.target.value)}
          disabled={updating}
          aria-label="User role"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm capitalize text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="customer">Customer</option>

          <option value="admin">Administrator</option>
        </select>

        <button
          type="submit"
          disabled={updating || selectedRole === customer.role}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updating ? (
            <>
              <LoaderCircle size={15} className="animate-spin" />
              Updating...
            </>
          ) : (
            "Update role"
          )}
        </button>
      </form>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Account management
|--------------------------------------------------------------------------
*/

function AccountManagement({ customer, deactivating, onDeactivate }) {
  const inactive = customer.isActive === false;

  return (
    <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-500/20 dark:bg-slate-900">
      <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
        Account access
      </h2>

      {inactive ? (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-700 dark:bg-red-500/10 dark:text-red-400">
          This account is inactive. Your current backend does not provide
          account reactivation.
        </div>
      ) : (
        <>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Deactivation prevents this user from accessing the account if
            authentication checks the <code>isActive</code> field.
          </p>

          <button
            type="button"
            onClick={onDeactivate}
            disabled={deactivating}
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            {deactivating ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                Deactivating...
              </>
            ) : (
              <>
                <UserX size={15} />
                Deactivate account
              </>
            )}
          </button>
        </>
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Badges
|--------------------------------------------------------------------------
*/

function CustomerStatus({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
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

function RoleBadge({ role }) {
  return (
    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
      {role || "customer"}
    </span>
  );
}

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
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        styles[normalizedStatus] || styles.pending
      }`}
    >
      {normalizedStatus}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Loading and error
|--------------------------------------------------------------------------
*/

function CustomerDetailsLoading() {
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
          Loading customer...
        </p>
      </div>
    </main>
  );
}

function CustomerDetailsError({ message, onRetry }) {
  return (
    <main
      role="alert"
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950"
    >
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center dark:border-red-500/20 dark:bg-slate-900">
        <AlertCircle size={35} className="mx-auto text-red-500" />

        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Unable to load customer
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/admin/customers"
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Back
          </Link>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
