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
    return "Unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getShortOrderId(orderId) {
  return orderId ? String(orderId).slice(-8).toUpperCase() : "UNKNOWN";
}

function extractOrder(response) {
  return response?.data?.order || response?.order || null;
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to load the order.";
}

export default function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [cancelling, setCancelling] = useState(false);

  const [error, setError] = useState("");

  const [actionError, setActionError] = useState("");

  const loadOrder = async () => {
    if (!orderId) {
      setOrder(null);
      setError("Order information was not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getOrderById(orderId);

      const loadedOrder = extractOrder(response);

      if (!loadedOrder) {
        throw new Error("Order information was not found.");
      }

      setOrder(loadedOrder);
    } catch (requestError) {
      setOrder(null);

      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      if (!orderId) {
        if (active) {
          setError("Order information was not found.");

          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(orderId);

        if (!active) {
          return;
        }

        const loadedOrder = extractOrder(response);

        if (!loadedOrder) {
          throw new Error("Order information was not found.");
        }

        setOrder(loadedOrder);
      } catch (requestError) {
        if (active) {
          setOrder(null);

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

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setActionError("");

      const response = await cancelOrder(orderId);

      const cancelledOrder = extractOrder(response);

      setOrder((currentOrder) => ({
        ...currentOrder,
        ...(cancelledOrder || {}),
        orderStatus: cancelledOrder?.orderStatus || "cancelled",
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
        message={error || "Order was not found."}
        onRetry={loadOrder}
      />
    );
  }

  const canCancel = ["pending", "confirmed", "processing"].includes(
    order.orderStatus,
  );

  const itemCount =
    order.items?.reduce((total, item) => {
      return total + (Number(item.quantity) || 0);
    }, 0) || 0;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full min-w-0 max-w-6xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <OrderHeader order={order} />

        <div className="mt-6 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-5">
            <OrderStatusSection status={order.orderStatus} />

            <OrderItemsSection items={order.items} itemCount={itemCount} />

            <DeliveryAddress address={order.shippingAddress} />

            <PaymentInformation
              method={order.paymentMethod}
              status={order.paymentStatus}
            />
          </div>

          <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <PriceSummary order={order} />

            <OrderStatusCard status={order.orderStatus} />

            {actionError && (
              <p
                role="alert"
                className="break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
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
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-500/10"
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
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
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

function OrderHeader({ order }) {
  return (
    <header className="min-w-0">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400"
      >
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <div className="mt-4 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-600">
            Order details
          </p>

          <h1 className="mt-1 break-all text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            #{getShortOrderId(order._id)}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <StatusBadge status={order.orderStatus} />
      </div>
    </header>
  );
}

function OrderStatusSection({ status }) {
  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SectionHeader
        title="Order status"
        description="Track the progress of your order."
      />

      <div className="min-w-0 px-3 py-5 sm:p-5">
        {status === "cancelled" ? (
          <CancelledNotice />
        ) : (
          <OrderTimeline status={status} />
        )}
      </div>
    </section>
  );
}

function OrderTimeline({ status }) {
  const currentIndex = STATUS_INDEX[status] ?? 0;

  const lastIndex = ORDER_STEPS.length - 1;

  const progress = lastIndex > 0 ? (currentIndex / lastIndex) * 100 : 0;

  return (
    <div className="relative w-full min-w-0">
      <div className="absolute left-[10%] right-[10%] top-4 h-px overflow-hidden bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full bg-emerald-600 transition-all duration-500"
          style={{
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
          }}
        />
      </div>

      <div className="relative grid w-full min-w-0 grid-cols-5 gap-0.5 sm:gap-1">
        {ORDER_STEPS.map((step, index) => (
          <TimelineStep
            key={step.status}
            step={step}
            completed={index <= currentIndex}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineStep({ step, completed }) {
  const Icon = step.icon;

  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
        }`}
      >
        <Icon size={14} />
      </div>

      <p
        className={`mt-2 w-full min-w-0 break-words text-[9px] font-semibold leading-3 sm:text-xs sm:leading-4 ${
          completed ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
        }`}
      >
        {step.title}
      </p>
    </div>
  );
}

function CancelledNotice() {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
      <XCircle
        size={20}
        className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
      />

      <div className="min-w-0">
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
          This order was cancelled
        </p>

        <p className="mt-1 break-words text-xs leading-5 text-red-600/80 dark:text-red-400/80">
          The reserved product stock has been returned automatically.
        </p>
      </div>
    </div>
  );
}

function OrderItemsSection({ items, itemCount }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Items
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {itemCount} {itemCount === 1 ? "item" : "items"} in this order
          </p>
        </div>

        <Package size={19} className="shrink-0 text-slate-400" />
      </div>

      {safeItems.length > 0 ? (
        <div className="min-w-0 divide-y divide-slate-100 dark:divide-slate-800">
          {safeItems.map((item, index) => (
            <ProductRow
              key={item.product?._id || item.product || index}
              item={item}
            />
          ))}
        </div>
      ) : (
        <p className="p-4 text-sm text-slate-500 dark:text-slate-400">
          No products were found in this order.
        </p>
      )}
    </section>
  );
}

function ProductRow({ item }) {
  const product = typeof item.product === "object" ? item.product : null;

  const productId =
    product?._id || (typeof item.product === "string" ? item.product : null);

  const image = product?.images?.[0] || FALLBACK_IMAGE;

  const subtotal =
    Number(item.subtotal) ||
    (Number(item.price) || 0) * (Number(item.quantity) || 0);

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src = FALLBACK_IMAGE;
  };

  const productName = (
    <p className="line-clamp-2 break-words text-sm font-semibold leading-5 text-slate-900 dark:text-white">
      {item.name || product?.name || "Product"}
    </p>
  );

  return (
    <div className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:p-4">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-16 sm:w-16 dark:bg-slate-800">
        <img
          src={image}
          alt={item.name || product?.name || "Ordered product"}
          loading="lazy"
          onError={handleImageError}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        {productId ? (
          <Link
            to={`/products/${productId}`}
            className="block min-w-0 transition-colors hover:text-emerald-600"
          >
            {productName}
          </Link>
        ) : (
          productName
        )}

        <p className="mt-1 break-words text-xs text-slate-500 dark:text-slate-400">
          {formatPrice(item.price)} × {item.quantity}
        </p>

        <p className="mt-2 text-sm font-semibold text-slate-700 sm:hidden dark:text-slate-300">
          {formatPrice(subtotal)}
        </p>
      </div>

      <p className="hidden shrink-0 whitespace-nowrap text-right text-sm font-semibold text-slate-700 sm:block dark:text-slate-300">
        {formatPrice(subtotal)}
      </p>
    </div>
  );
}

function DeliveryAddress({ address }) {
  if (!address) {
    return null;
  }

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SectionHeader title="Delivery address" />

      <div className="flex min-w-0 gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <MapPin size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
            {address.fullName}
          </p>

          <p className="mt-1 break-words [overflow-wrap:anywhere] text-sm leading-6 text-slate-500 dark:text-slate-400">
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ""}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
          </p>

          <p className="mt-2 break-all text-xs text-slate-400">
            {address.phone}
          </p>
        </div>
      </div>
    </section>
  );
}

function PaymentInformation({ method, status }) {
  const paymentStatus = status || "pending";

  const paid = paymentStatus === "paid";

  const statusStyles = paid
    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
    : paymentStatus === "failed"
      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
      : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SectionHeader title="Payment information" />

      <div className="flex min-w-0 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <WalletCards size={19} className="mt-0.5 shrink-0 text-slate-400" />

          <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
              {method === "cod" ? "Cash on delivery" : "Online payment"}
            </p>

            <p className="mt-1 break-words text-xs leading-5 text-slate-400">
              {method === "cod" && paymentStatus === "pending"
                ? "Payment will be collected on delivery."
                : `Payment status: ${paymentStatus}`}
            </p>
          </div>
        </div>

        <span
          className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles}`}
        >
          {paymentStatus}
        </span>
      </div>
    </section>
  );
}

function PriceSummary({ order }) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SectionHeader title="Price summary" />

      <div className="space-y-3 p-4 text-sm">
        <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />

        {Number(order.discount) > 0 && (
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
            Number(order.shippingFee) === 0
              ? "FREE"
              : formatPrice(order.shippingFee)
          }
          valueClass={Number(order.shippingFee) === 0 ? "text-emerald-600" : ""}
        />

        <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-700" />

        <div className="flex min-w-0 items-center justify-between gap-4">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Total
          </span>

          <span className="min-w-0 break-words text-right text-xl font-bold text-slate-950 dark:text-white">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>
    </section>
  );
}

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
      className={`w-full min-w-0 rounded-xl border p-4 ${
        cancelled
          ? "border-red-100 bg-red-50 dark:border-red-500/10 dark:bg-red-500/5"
          : "border-emerald-100 bg-emerald-50 dark:border-emerald-500/10 dark:bg-emerald-500/5"
      }`}
    >
      <div className="flex min-w-0 gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-900 ${
            cancelled ? "text-red-600" : "text-emerald-600"
          }`}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
            {current.title}
          </p>

          <p className="mt-1 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">
            {current.description}
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="min-w-0 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
      <h2 className="break-words text-lg font-bold text-slate-950 dark:text-white">
        {title}
      </h2>

      {description && (
        <p className="mt-1 break-words text-xs text-slate-400">{description}</p>
      )}
    </div>
  );
}

function SummaryRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4">
      <span className="min-w-0 break-words text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span
        className={`shrink-0 whitespace-nowrap text-right font-medium text-slate-700 dark:text-slate-300 ${valueClass}`}
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
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
        styles[status] || styles.pending
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {status || "pending"}
    </span>
  );
}

function OrderDetailsLoading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950"
      role="status"
    >
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

        <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
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
