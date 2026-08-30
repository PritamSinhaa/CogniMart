import {
  ArrowRight,
  Check,
  LoaderCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  WalletCards,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";

import { motion } from "motion/react";

import { getOrderById } from "../../api/order.api";

const ORDER_STEPS = [
  {
    status: "pending",
    label: "Placed",
    icon: Check,
  },
  {
    status: "confirmed",
    label: "Confirmed",
    icon: ShieldCheck,
  },
  {
    status: "processing",
    label: "Processing",
    icon: Package,
  },
  {
    status: "shipped",
    label: "Shipped",
    icon: Truck,
  },
  {
    status: "delivered",
    label: "Delivered",
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
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to load the order";
}

function extractOrder(response) {
  return response?.data?.order || response?.order || null;
}

export default function OrderSuccess() {
  const { orderId } = useParams();
  const location = useLocation();

  /*
   * Checkout passes the newly created order
   * through navigation state, avoiding an
   * unnecessary request on the first render.
   */
  const navigationOrder = location.state?.order || null;

  const [order, setOrder] = useState(
    navigationOrder?._id === orderId ? navigationOrder : null,
  );

  const [loading, setLoading] = useState(!order);

  const [error, setError] = useState("");

  useEffect(() => {
    if (order && String(order._id) === String(orderId)) {
      return;
    }

    let active = true;

    const loadOrder = async () => {
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

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderId, order]);

  if (loading) {
    return <OrderSuccessLoading />;
  }

  if (error || !order) {
    return (
      <OrderSuccessError message={error || "Order information was not found"} />
    );
  }

  const shortOrderId = order._id?.slice(-8).toUpperCase() || "UNKNOWN";

  const isCancelled = order.orderStatus === "cancelled";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="w-full max-w-2xl"
        >
          {/* Success icon */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
            <motion.div
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 220,
                damping: 15,
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white"
            >
              <Check size={24} strokeWidth={3} />
            </motion.div>
          </div>

          {/* Heading */}

          <div className="mt-5 text-center">
            <p className="text-sm font-semibold text-emerald-600">
              Order confirmed
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Order placed successfully!
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              Thank you for shopping with CogniMart. Your order has been
              received and will be processed shortly.
            </p>
          </div>

          {/* Order card */}

          <div className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Basic information */}

            <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
              <InfoItem label="Order number" value={`#${shortOrderId}`} />

              <InfoItem label="Placed on" value={formatDate(order.createdAt)} />

              <InfoItem label="Order total" value={formatPrice(order.total)} />
            </div>

            {/* Payment information */}

            <div className="flex items-start gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                <WalletCards size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {order.paymentMethod === "cod"
                    ? "Cash on delivery"
                    : "Online payment"}
                </p>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {order.paymentMethod === "cod"
                    ? "Pay when your order is delivered."
                    : `Payment status: ${order.paymentStatus}`}
                </p>
              </div>
            </div>

            {/* Status */}

            <div className="border-t border-slate-200 p-5 dark:border-slate-800">
              {isCancelled ? (
                <CancelledStatus />
              ) : (
                <OrderProgress status={order.orderStatus} />
              )}
            </div>

            {/* Delivery address */}

            {order.shippingAddress && (
              <DeliveryAddress address={order.shippingAddress} />
            )}

            {/* Actions */}

            <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row dark:border-slate-800">
              <Link
                to={`/orders/${order._id}`}
                className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-md"
              >
                View order
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to="/products"
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ShoppingBag size={16} />
                Continue shopping
              </Link>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} />

            <span>Your order information is securely stored.</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Order progress
|--------------------------------------------------------------------------
*/

function OrderProgress({ status }) {
  const currentIndex = STATUS_INDEX[status] ?? 0;

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <Package size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Order status: <span className="capitalize">{status}</span>
          </p>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            We will update you as your order progresses.
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-1">
        <div className="flex min-w-[520px] items-start">
          {ORDER_STEPS.map((step, index) => (
            <ProgressItem
              key={step.status}
              step={step}
              active={index <= currentIndex}
              lineActive={index < currentIndex}
              isLast={index === ORDER_STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function ProgressItem({ step, active, lineActive, isLast }) {
  const Icon = step.icon;

  return (
    <>
      <div className="flex w-20 shrink-0 flex-col items-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            active
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-400 dark:bg-slate-800"
          }`}
        >
          <Icon size={15} />
        </div>

        <p
          className={`mt-2 whitespace-nowrap text-xs font-medium ${
            active ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
          }`}
        >
          {step.label}
        </p>
      </div>

      {!isLast && (
        <div
          className={`mt-4 h-px flex-1 ${
            lineActive ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
          }`}
        />
      )}
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Cancelled
|--------------------------------------------------------------------------
*/

function CancelledStatus() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
      <XCircle
        size={20}
        className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
      />

      <div>
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
          Order cancelled
        </p>

        <p className="mt-1 text-xs leading-5 text-red-600/80 dark:text-red-400/80">
          This order has been cancelled and will not be delivered.
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Delivery address
|--------------------------------------------------------------------------
*/

function DeliveryAddress({ address }) {
  return (
    <div className="border-t border-slate-200 p-5 dark:border-slate-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Delivery address
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
        {address.fullName}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
        <br />
        {address.city}, {address.state} {address.postalCode}
        <br />
        {address.country}
        <br />
        {address.phone}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Information item
|--------------------------------------------------------------------------
*/

function InfoItem({ label, value }) {
  return (
    <div className="px-5 py-4">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function OrderSuccessLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <LoaderCircle
          size={30}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading your order...
        </p>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Error
|--------------------------------------------------------------------------
*/

function OrderSuccessError({ message }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <XCircle size={36} className="mx-auto text-red-500" />

        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Unable to load order
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <Link
          to="/orders"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          View my orders
        </Link>
      </div>
    </main>
  );
}
