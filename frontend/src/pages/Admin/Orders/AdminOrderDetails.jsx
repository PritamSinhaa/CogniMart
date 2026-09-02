import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock3,
  CreditCard,
  LoaderCircle,
  MapPin,
  Package,
  PackageSearch,
  RefreshCw,
  ShieldCheck,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { getAdminOrderById, updateOrderStatus } from "../../../api/order.api";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

const STATUS_STEPS = [
  {
    status: "pending",
    title: "Order placed",
    description: "The customer placed the order.",
    icon: Package,
  },
  {
    status: "confirmed",
    title: "Order confirmed",
    description: "The order was confirmed by the store.",
    icon: ShieldCheck,
  },
  {
    status: "processing",
    title: "Processing",
    description: "The order is being prepared.",
    icon: Clock3,
  },
  {
    status: "shipped",
    title: "Shipped",
    description: "The order was handed to the delivery partner.",
    icon: Truck,
  },
  {
    status: "delivered",
    title: "Delivered",
    description: "The order was delivered successfully.",
    icon: Check,
  },
];

const STATUS_INDEX = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
};

const ALLOWED_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],

  confirmed: ["processing", "cancelled"],

  processing: ["shipped", "cancelled"],

  shipped: ["delivered"],

  delivered: [],

  cancelled: [],
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

function extractOrder(response) {
  return response?.data?.order || response?.order || null;
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to load the order.";
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

export default function AdminOrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [actionError, setActionError] = useState("");

  const [actionSuccess, setActionSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load order
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller = new AbortController();

    let active = true;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminOrderById(orderId, {
          signal: controller.signal,
        });

        if (!active) {
          return;
        }

        const loadedOrder = extractOrder(response);

        if (!loadedOrder) {
          throw new Error("Order information was not found.");
        }

        setOrder(loadedOrder);
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

    loadOrder();

    return () => {
      active = false;
      controller.abort();
    };
  }, [orderId, reloadKey]);

  /*
   * Select the first valid transition
   * whenever the current status changes.
   */
  useEffect(() => {
    const nextStatuses = ALLOWED_TRANSITIONS[order?.orderStatus] || [];

    setSelectedStatus(nextStatuses[0] || "");
  }, [order?.orderStatus]);

  /*
  |--------------------------------------------------------------------------
  | Update status
  |--------------------------------------------------------------------------
  */

  const handleStatusUpdate = async (event) => {
    event.preventDefault();

    if (!selectedStatus || updatingStatus) {
      return;
    }

    const validStatuses = ALLOWED_TRANSITIONS[order?.orderStatus] || [];

    if (!validStatuses.includes(selectedStatus)) {
      setActionError("This status transition is not allowed.");

      return;
    }

    if (selectedStatus === "cancelled") {
      const confirmed = window.confirm(
        "Cancel this order? Reserved stock will be restored. This action cannot be undone.",
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setUpdatingStatus(true);
      setActionError("");
      setActionSuccess("");

      const response = await updateOrderStatus(order._id, selectedStatus);

      const updatedOrder = extractOrder(response);

      /*
       * The status-update endpoint may
       * return unpopulated references.
       * Preserve the already loaded
       * customer and product information.
       */
      setOrder((currentOrder) => ({
        ...currentOrder,

        orderStatus: updatedOrder?.orderStatus || selectedStatus,

        paymentStatus:
          updatedOrder?.paymentStatus || currentOrder.paymentStatus,

        updatedAt: updatedOrder?.updatedAt || currentOrder.updatedAt,
      }));

      setActionSuccess(
        response?.message || "Order status updated successfully.",
      );
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <OrderLoading />;
  }

  if (error || !order) {
    return (
      <OrderError
        message={error || "Order not found."}
        onRetry={() => setReloadKey((current) => current + 1)}
      />
    );
  }

  const availableStatuses = ALLOWED_TRANSITIONS[order.orderStatus] || [];

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <OrderHeader order={order} />

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <OrderItems items={order.items} />

            <PaymentSummary order={order} />

            <OrderTimeline order={order} />
          </div>

          <aside className="space-y-5">
            <CustomerCard order={order} />

            <AddressCard address={order.shippingAddress} />

            <PaymentCard order={order} />

            <StatusUpdateCard
              currentStatus={order.orderStatus}
              availableStatuses={availableStatuses}
              selectedStatus={selectedStatus}
              updating={updatingStatus}
              error={actionError}
              success={actionSuccess}
              onStatusChange={setSelectedStatus}
              onSubmit={handleStatusUpdate}
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

function OrderHeader({ order }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Link
          to="/admin/orders"
          aria-label="Back to orders"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
        >
          <ArrowLeft size={17} />
        </Link>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[26px]">
              #{getShortOrderId(order._id)}
            </h1>

            <OrderStatusBadge status={order.orderStatus} />
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CreditCard
          size={15}
          className="text-emerald-600 dark:text-emerald-400"
        />

        <PaymentStatus status={order.paymentStatus} />

        <span className="text-xs text-slate-400">
          • {formatPaymentMethod(order.paymentMethod)}
        </span>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Order items
|--------------------------------------------------------------------------
*/

function OrderItems({ items = [] }) {
  const itemCount = items.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Order items
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>

        <Package size={18} className="text-slate-400" />
      </div>

      {items.length > 0 ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item, index) => (
            <OrderItem
              key={item.product?._id || item.product || index}
              item={item}
            />
          ))}
        </div>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-slate-400">
          No items were found in this order.
        </p>
      )}
    </section>
  );
}

function OrderItem({ item }) {
  const product = typeof item.product === "object" ? item.product : null;

  const productId = product?._id;

  const image = product?.images?.[0] || FALLBACK_IMAGE;

  const itemSubtotal =
    Number(item.subtotal) || Number(item.price) * Number(item.quantity);

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src = FALLBACK_IMAGE;
  };

  const productName = (
    <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
      {item.name || product?.name || "Unknown product"}
    </h3>
  );

  return (
    <div className="flex gap-4 px-5 py-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
        <img
          src={image}
          alt={item.name || "Order product"}
          loading="lazy"
          onError={handleImageError}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        {productId ? (
          <Link
            to={`/products/${productId}`}
            className="transition-colors hover:text-emerald-600"
          >
            {productName}
          </Link>
        ) : (
          productName
        )}

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {formatPrice(item.price)} × {item.quantity}
        </p>
      </div>

      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-xs text-slate-400">Total</p>

        <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
          {formatPrice(itemSubtotal)}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Payment summary
|--------------------------------------------------------------------------
*/

function PaymentSummary({ order }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Price summary
        </h2>

        <span className="text-xs text-slate-400">
          {formatPaymentMethod(order.paymentMethod)}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />

        {Number(order.discount) > 0 && (
          <SummaryRow
            label={
              order.couponCode ? `Coupon (${order.couponCode})` : "Discount"
            }
            value={`− ${formatPrice(order.discount)}`}
            valueClass="text-emerald-600 dark:text-emerald-400"
          />
        )}

        <SummaryRow
          label="Delivery"
          value={
            Number(order.shippingFee) === 0
              ? "FREE"
              : formatPrice(order.shippingFee)
          }
          valueClass={
            Number(order.shippingFee) === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : ""
          }
        />

        <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-700" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Total
          </span>

          <span className="text-xl font-bold text-slate-950 dark:text-white">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>

      <span
        className={`font-medium text-slate-800 dark:text-slate-200 ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Timeline
|--------------------------------------------------------------------------
*/

function OrderTimeline({ order }) {
  if (order.orderStatus === "cancelled") {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-500/20 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <XCircle size={18} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
              Order cancelled
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              This order will not be fulfilled. Reserved stock was restored
              automatically.
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Last updated {formatDate(order.updatedAt)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentIndex = STATUS_INDEX[order.orderStatus] ?? 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
        Order timeline
      </h2>

      <p className="mt-1 text-xs text-slate-400">Current order progress.</p>

      <div className="mt-6">
        {STATUS_STEPS.map((step, index) => (
          <TimelineStep
            key={step.status}
            step={step}
            index={index}
            currentIndex={currentIndex}
            placedAt={index === 0 ? order.createdAt : null}
            last={index === STATUS_STEPS.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function TimelineStep({ step, index, currentIndex, placedAt, last }) {
  const Icon = step.icon;

  const completed = index <= currentIndex;

  const active = index === currentIndex;

  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
            index < currentIndex
              ? "bg-emerald-500"
              : "bg-slate-200 dark:bg-slate-700"
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
          completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900"
        } ${active ? "ring-4 ring-emerald-500/10" : ""}`}
      >
        <Icon size={14} />
      </div>

      <div className={`min-w-0 flex-1 ${last ? "pb-0" : "pb-7"}`}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3
            className={`text-sm font-semibold ${
              completed ? "text-slate-900 dark:text-white" : "text-slate-400"
            }`}
          >
            {step.title}
          </h3>

          {placedAt && (
            <span className="text-[11px] text-slate-400">
              {formatDate(placedAt)}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {step.description}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Customer
|--------------------------------------------------------------------------
*/

function CustomerCard({ order }) {
  const customerName =
    order.user?.name || order.shippingAddress?.fullName || "Deleted customer";

  const customerEmail = order.user?.email || "Email unavailable";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Customer
        </h2>

        <User size={17} className="text-slate-400" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          {createInitials(customerName) || "CM"}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {customerName}
          </p>

          <p className="truncate text-xs text-slate-400">{customerEmail}</p>
        </div>
      </div>

      {order.shippingAddress?.phone && (
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Phone: {order.shippingAddress.phone}
        </p>
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Address
|--------------------------------------------------------------------------
*/

function AddressCard({ address }) {
  if (!address) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Delivery address
        </h2>

        <MapPin size={17} className="text-slate-400" />
      </div>

      <div className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          {address.fullName}
        </p>

        <p className="mt-1">
          {address.addressLine1}
          {address.addressLine2 ? `, ${address.addressLine2}` : ""}
          <br />
          {address.city}, {address.state} {address.postalCode}
          <br />
          {address.country}
        </p>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Payment information
|--------------------------------------------------------------------------
*/

function PaymentCard({ order }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Payment
        </h2>

        <CreditCard size={17} className="text-slate-400" />
      </div>

      <div className="mt-4 space-y-3">
        <InformationRow
          label="Method"
          value={formatPaymentMethod(order.paymentMethod)}
        />

        <InformationRow
          label="Status"
          value={<PaymentStatus status={order.paymentStatus} />}
        />

        {order.paymentMethod === "cod" && order.paymentStatus === "pending" && (
          <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            Payment will be collected when the order is delivered.
          </p>
        )}
      </div>
    </section>
  );
}

function InformationRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-400">{label}</span>

      <span className="font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Status update
|--------------------------------------------------------------------------
*/

function StatusUpdateCard({
  currentStatus,
  availableStatuses,
  selectedStatus,
  updating,
  error,
  success,
  onStatusChange,
  onSubmit,
}) {
  const finished = availableStatuses.length === 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
        Update order status
      </h2>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        Current status:{" "}
        <span className="font-semibold capitalize">{currentStatus}</span>
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
        >
          {success}
        </p>
      )}

      {finished ? (
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          {currentStatus === "delivered"
            ? "Delivered orders cannot be updated."
            : "Cancelled orders cannot be updated."}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-4">
          <label className="block">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Next status
            </span>

            <select
              value={selectedStatus}
              onChange={(event) => onStatusChange(event.target.value)}
              disabled={updating}
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm capitalize text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={updating || !selectedStatus}
            className={`mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              selectedStatus === "cancelled"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {updating ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update status"
            )}
          </button>
        </form>
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Shared statuses
|--------------------------------------------------------------------------
*/

function OrderStatusBadge({ status }) {
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
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
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

function formatPaymentMethod(method) {
  if (method === "cod") {
    return "Cash on delivery";
  }

  if (method === "online") {
    return "Online payment";
  }

  return method ? method.toUpperCase() : "Unknown";
}

/*
|--------------------------------------------------------------------------
| Loading and error
|--------------------------------------------------------------------------
*/

function OrderLoading() {
  return (
    <main
      role="status"
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950"
    >
      <div className="text-center">
        <LoaderCircle
          size={30}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Loading order details...
        </p>
      </div>
    </main>
  );
}

function OrderError({ message, onRetry }) {
  return (
    <main
      role="alert"
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {message.toLowerCase().includes("not found") ? (
          <PackageSearch size={36} className="mx-auto text-slate-400" />
        ) : (
          <AlertCircle size={36} className="mx-auto text-red-500" />
        )}

        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Unable to load order
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/admin/orders"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Back to orders
          </Link>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
