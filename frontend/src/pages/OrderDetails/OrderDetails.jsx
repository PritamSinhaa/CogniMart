import {
  AlertCircle,
  ArrowLeft,
  Check,
  LoaderCircle,
  MapPin,
  Package,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  WalletCards,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { motion } from "motion/react";

import { cancelOrder, getOrderById } from "../../api/order.api";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

const ORDER_STEPS = [
  {
    status: "pending",
    title: "Placed",
    icon: Check,
  },
  {
    status: "confirmed",
    title: "Confirmed",
    icon: ShieldCheck,
  },
  {
    status: "processing",
    title: "Processing",
    icon: Package,
  },
  {
    status: "shipped",
    title: "Shipped",
    icon: Truck,
  },
  {
    status: "delivered",
    title: "Delivered",
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
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getShortOrderId(orderId) {
  return orderId ? orderId.slice(-8).toUpperCase() : "UNKNOWN";
}

function extractOrder(response) {
  return response?.data?.order || response?.order || null;
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to load the order";
}

export default function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [cancelling, setCancelling] = useState(false);

  const [error, setError] = useState("");

  const [actionError, setActionError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load order
  |--------------------------------------------------------------------------
  */

  const loadOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getOrderById(orderId);

      const loadedOrder = extractOrder(response);

      if (!loadedOrder) {
        throw new Error("Order information was not found");
      }

      setOrder(loadedOrder);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getOrderById(orderId);

        if (!active) {
          return;
        }

        const loadedOrder = extractOrder(response);

        if (!loadedOrder) {
          throw new Error("Order information was not found");
        }

        setOrder(loadedOrder);
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

    fetchOrder();

    return () => {
      active = false;
    };
  }, [orderId]);

  /*
  |--------------------------------------------------------------------------
  | Cancel order
  |--------------------------------------------------------------------------
  */

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setCancelling(true);
    setActionError("");

    try {
      await cancelOrder(orderId);

      /*
       * Preserve the populated products while
       * applying the new status immediately.
       */
      setOrder((currentOrder) => ({
        ...currentOrder,
        orderStatus: "cancelled",
      }));
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <OrderDetailsLoading />;
  }

  if (error || !order) {
    return (
      <OrderDetailsError
        message={error || "Order was not found"}
        onRetry={loadOrder}
      />
    );
  }

  const canCancel = ["pending", "confirmed", "processing"].includes(
    order.orderStatus,
  );

  const itemCount =
    order.items?.reduce(
      (total, item) => total + (Number(item.quantity) || 0),
      0,
    ) || 0;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}

        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400"
          >
            <ArrowLeft size={16} />
            Back to orders
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                Order details
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                #{getShortOrderId(order._id)}
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <StatusBadge status={order.orderStatus} />
          </div>
        </div>

        {/* Main grid */}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* Left column */}

          <div className="space-y-5">
            {/* Timeline */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                title="Order status"
                description="Track the progress of your order."
              />

              <div className="p-5">
                {order.orderStatus === "cancelled" ? (
                  <CancelledNotice />
                ) : (
                  <OrderTimeline status={order.orderStatus} />
                )}
              </div>
            </section>

            {/* Products */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Items
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in this
                    order
                  </p>
                </div>

                <Package size={19} className="text-slate-400" />
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.items?.map((item, index) => (
                  <ProductRow
                    key={item.product?._id || item.product || index}
                    item={item}
                  />
                ))}
              </div>
            </section>

            {/* Address */}

            <DeliveryAddress address={order.shippingAddress} />

            {/* Payment */}

            <PaymentInformation
              method={order.paymentMethod}
              status={order.paymentStatus}
            />
          </div>

          {/* Right column */}

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <PriceSummary order={order} />

            <OrderStatusCard status={order.orderStatus} />

            {actionError && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
              >
                {actionError}
              </p>
            )}

            <div className="space-y-3">
              {canCancel && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  {cancelling ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Cancel order
                    </>
                  )}
                </button>
              )}

              <Link
                to="/products"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700"
              >
                <ShoppingBag size={16} />
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Timeline
|--------------------------------------------------------------------------
*/

function OrderTimeline({ status }) {
  const currentIndex = STATUS_INDEX[status] ?? 0;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[540px] items-start">
        {ORDER_STEPS.map((step, index) => (
          <TimelineStep
            key={step.status}
            step={step}
            completed={index <= currentIndex}
            lineCompleted={index < currentIndex}
            isLast={index === ORDER_STEPS.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineStep({ step, completed, lineCompleted, isLast }) {
  const Icon = step.icon;

  return (
    <>
      <div className="flex w-20 shrink-0 flex-col items-center text-center">
        <div
          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
            completed
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-400 dark:bg-slate-800"
          }`}
        >
          <Icon size={14} />
        </div>

        <p
          className={`mt-2 whitespace-nowrap text-xs font-semibold ${
            completed ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
          }`}
        >
          {step.title}
        </p>
      </div>

      {!isLast && (
        <div
          className={`mt-4 h-px flex-1 ${
            lineCompleted ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
          }`}
        />
      )}
    </>
  );
}

function CancelledNotice() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
      <XCircle
        size={20}
        className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
      />

      <div>
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
          This order was cancelled
        </p>

        <p className="mt-1 text-xs leading-5 text-red-600/80 dark:text-red-400/80">
          The reserved product stock has been returned automatically.
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Product
|--------------------------------------------------------------------------
*/

function ProductRow({ item }) {
  const product = typeof item.product === "object" ? item.product : null;

  const image = product?.images?.[0] || FALLBACK_IMAGE;

  const productId = product?._id;

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  const productName = (
    <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
      {item.name}
    </p>
  );

  return (
    <div className="flex gap-3 p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
        <img
          src={image}
          alt={item.name}
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
| Address
|--------------------------------------------------------------------------
*/

function DeliveryAddress({ address }) {
  if (!address) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SectionHeader title="Delivery address" />

      <div className="flex gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <MapPin size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {address.fullName}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ""}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
          </p>

          <p className="mt-2 text-xs text-slate-400">{address.phone}</p>
        </div>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Payment
|--------------------------------------------------------------------------
*/

function PaymentInformation({ method, status }) {
  const paid = status === "paid";

  const statusStyles = paid
    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
    : status === "failed"
      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
      : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SectionHeader title="Payment information" />

      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <WalletCards size={19} className="text-slate-400" />

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {method === "cod" ? "Cash on delivery" : "Online payment"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {method === "cod" && status === "pending"
                ? "Payment will be collected on delivery."
                : `Payment status: ${status}`}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles}`}
        >
          {status}
        </span>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Price
|--------------------------------------------------------------------------
*/

function PriceSummary({ order }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SectionHeader title="Price summary" />

      <div className="space-y-3 p-4 text-sm">
        <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />

        {order.discount > 0 && (
          <SummaryRow
            label={
              order.couponCode ? `Discount (${order.couponCode})` : "Discount"
            }
            value={`− ${formatPrice(order.discount)}`}
            valueClass="text-emerald-600"
          />
        )}

        <SummaryRow
          label="Delivery"
          value={
            order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)
          }
          valueClass={order.shippingFee === 0 ? "text-emerald-600" : ""}
        />

        <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-700" />

        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
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

/*
|--------------------------------------------------------------------------
| Current status card
|--------------------------------------------------------------------------
*/

function OrderStatusCard({ status }) {
  const information = {
    pending: {
      title: "Order received",
      description: "Your order is waiting for confirmation.",
      icon: Package,
    },

    confirmed: {
      title: "Order confirmed",
      description: "Your order has been confirmed.",
      icon: ShieldCheck,
    },

    processing: {
      title: "Preparing your order",
      description: "Your products are being prepared.",
      icon: Package,
    },

    shipped: {
      title: "Order shipped",
      description: "Your order is currently on the way.",
      icon: Truck,
    },

    delivered: {
      title: "Order delivered",
      description: "Your order was delivered successfully.",
      icon: Check,
    },

    cancelled: {
      title: "Order cancelled",
      description: "This order will not be delivered.",
      icon: XCircle,
    },
  };

  const current = information[status] || information.pending;

  const Icon = current.icon;
  const cancelled = status === "cancelled";

  return (
    <section
      className={`rounded-xl border p-4 ${
        cancelled
          ? "border-red-100 bg-red-50 dark:border-red-500/10 dark:bg-red-500/5"
          : "border-emerald-100 bg-emerald-50 dark:border-emerald-500/10 dark:bg-emerald-500/5"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-900 ${
            cancelled ? "text-red-600" : "text-emerald-600"
          }`}
        >
          <Icon size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {current.title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {current.description}
          </p>
        </div>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Shared UI
|--------------------------------------------------------------------------
*/

function SectionHeader({ title, description }) {
  return (
    <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
      <h2 className="text-lg font-bold text-slate-950 dark:text-white">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      )}
    </div>
  );
}

function SummaryRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>

      <span
        className={`font-medium text-slate-700 dark:text-slate-300 ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
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
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
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
| Loading and error
|--------------------------------------------------------------------------
*/

function OrderDetailsLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <LoaderCircle
          size={30}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading order details...
        </p>
      </div>
    </main>
  );
}

function OrderDetailsError({ message, onRetry }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <AlertCircle size={36} className="mx-auto text-red-500" />

        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Unable to load order
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/orders"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Back to orders
          </Link>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <RotateCcw size={15} />
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
  