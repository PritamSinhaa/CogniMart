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

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
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

  const navigationOrder = location.state?.order || null;

  const [order, setOrder] = useState(() => {
    const navigationOrderId = navigationOrder?._id || navigationOrder?.id;

    return String(navigationOrderId) === String(orderId)
      ? navigationOrder
      : null;
  });

  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentOrderId = order?._id || order?.id;

    if (order && String(currentOrderId) === String(orderId)) {
      return undefined;
    }

    let active = true;

    async function loadOrder() {
      setLoading(true);
      setError("");

      try {
        const response = await getOrderById(orderId);
        const loadedOrder = extractOrder(response);

        if (!loadedOrder) {
          throw new Error("Order information was not found");
        }

        if (active) {
          setOrder(loadedOrder);
        }
      } catch (requestError) {
        if (active) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

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

  const currentOrderId = order._id || order.id;

  const shortOrderId = String(currentOrderId).slice(-8).toUpperCase();

  const orderStatus = String(order.orderStatus || "pending").toLowerCase();

  const isCancelled = orderStatus === "cancelled";

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-3xl px-3 py-8 sm:px-6 sm:py-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mx-auto w-full max-w-xl"
        >
          <SuccessHeader />

          <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <OrderInformation
              orderNumber={shortOrderId}
              createdAt={order.createdAt}
              total={order.total}
            />

            <PaymentInformation order={order} />

            <div className="border-t border-slate-200 p-4 sm:p-5 dark:border-slate-800">
              {isCancelled ? (
                <CancelledStatus />
              ) : (
                <OrderProgress status={orderStatus} />
              )}
            </div>

            {order.shippingAddress && (
              <DeliveryAddress address={order.shippingAddress} />
            )}

            <OrderActions orderId={currentOrderId} />
          </section>

          <div className="mt-5 flex items-center justify-center gap-2 px-4 text-center text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 shrink-0" />

            <span>Your order information is securely stored.</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Success header
|--------------------------------------------------------------------------
*/

function SuccessHeader() {
  return (
    <header className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 220,
            damping: 15,
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <Check className="h-6 w-6" strokeWidth={3} />
        </motion.div>
      </div>

      <p className="mt-4 text-sm font-semibold text-emerald-600">
        Order confirmed
      </p>

      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
        Order placed successfully!
      </h1>

      <p className="mx-auto mt-2 max-w-md px-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Thank you for shopping with CogniMart. Your order has been received and
        will be processed shortly.
      </p>
    </header>
  );
}

/*
|--------------------------------------------------------------------------
| Order information
|--------------------------------------------------------------------------
*/

function OrderInformation({ orderNumber, createdAt, total }) {
  return (
    <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
      <InfoItem label="Order number" value={`#${orderNumber}`} />

      <InfoItem label="Placed on" value={formatDate(createdAt)} />

      <InfoItem label="Order total" value={formatPrice(total)} />
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0 px-4 py-4 sm:px-5">
      <p className="text-xs font-medium text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Payment information
|--------------------------------------------------------------------------
*/

function PaymentInformation({ order }) {
  const isCashOnDelivery = order.paymentMethod === "cod";

  return (
    <div className="flex min-w-0 items-start gap-3 border-t border-slate-200 p-4 sm:p-5 dark:border-slate-800">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
        <WalletCards className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {isCashOnDelivery ? "Cash on delivery" : "Online payment"}
        </p>

        <p className="mt-1 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">
          {isCashOnDelivery
            ? "Pay when your order is delivered."
            : `Payment status: ${order.paymentStatus || "pending"}`}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Order progress
|--------------------------------------------------------------------------
*/

function OrderProgress({ status }) {
  const currentIndex = STATUS_INDEX[status] ?? 0;

  const completedPercentage = (currentIndex / (ORDER_STEPS.length - 1)) * 100;

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <Package className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
            Order status: <span className="capitalize">{status}</span>
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            We will update you as your order progresses.
          </p>
        </div>
      </div>

      <div className="relative mt-6 w-full px-1">
        <div className="absolute left-[10%] right-[10%] top-4 h-px bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{
              width: `${completedPercentage}%`,
            }}
          />
        </div>

        <div className="relative grid grid-cols-5">
          {ORDER_STEPS.map((step, index) => (
            <ProgressItem
              key={step.status}
              step={step}
              active={index <= currentIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ step, active }) {
  const Icon = step.icon;

  return (
    <div className="flex min-w-0 flex-col items-center">
      <div
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white sm:h-9 sm:w-9 dark:border-slate-900 ${
          active
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
        }`}
      >
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </div>

      <p
        className={`mt-2 w-full break-words px-0.5 text-center text-[9px] font-medium leading-3 sm:text-xs ${
          active ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
        }`}
      >
        {step.label}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Cancelled status
|--------------------------------------------------------------------------
*/

function CancelledStatus() {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

      <div className="min-w-0">
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
          Order cancelled
        </p>

        <p className="mt-1 break-words text-xs leading-5 text-red-600/80 dark:text-red-400/80">
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
  const locationParts = [
    address.city,
    address.state,
    address.postalCode,
  ].filter(Boolean);

  return (
    <div className="min-w-0 border-t border-slate-200 p-4 sm:p-5 dark:border-slate-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Delivery address
      </p>

      <div className="mt-3 min-w-0">
        <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
          {address.fullName}
        </p>

        <div className="mt-1 break-words text-sm leading-6 text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
          {address.addressLine1 && <p>{address.addressLine1}</p>}

          {address.addressLine2 && <p>{address.addressLine2}</p>}

          {locationParts.length > 0 && <p>{locationParts.join(", ")}</p>}

          {address.country && <p>{address.country}</p>}

          {address.phone && <p>{address.phone}</p>}
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

function OrderActions({ orderId }) {
  const sharedButtonClasses =
    "flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all";

  return (
    <div className="grid grid-cols-1 gap-3 border-t border-slate-200 p-4 sm:grid-cols-2 sm:p-5 dark:border-slate-800">
      <Link
        to={`/orders/${orderId}`}
        className={`${sharedButtonClasses} group bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-md`}
      >
        <span>View order</span>

        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>

      <Link
        to="/products"
        className={`${sharedButtonClasses} border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
      >
        <ShoppingBag className="h-4 w-4" />

        <span>Continue shopping</span>
      </Link>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading state
|--------------------------------------------------------------------------
*/

function OrderSuccessLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="text-center">
        <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-emerald-600" />

        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading your order...
        </p>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Error state
|--------------------------------------------------------------------------
*/

function OrderSuccessError({ message }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Unable to load order
        </h1>

        <p className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <Link
          to="/orders"
          className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          View my orders
        </Link>
      </div>
    </main>
  );
}
