import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Package,
  RotateCcw,
  Truck,
} from "lucide-react";

const order = {
  id: "CGM-2026-00124",
  date: "18 Aug 2026",
  status: "Delivered",
  deliveredDate: "21 Aug 2026",
  paymentMethod: "UPI",
  paymentStatus: "Paid",
  deliveryAddress: {
    name: "Pritam Sinha",
    phone: "+91 98765 43210",
    address: "123 Main Street, Sector 45",
    city: "Chandigarh",
    state: "Punjab",
    pincode: "160047",
  },
  products: [
    {
      id: 1,
      name: "Sony WH-1000XM5",
      variant: "Black",
      quantity: 1,
      price: 29990,
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "Apple AirPods Pro",
      variant: "White",
      quantity: 1,
      price: 24999,
      image:
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=300&q=80",
    },
  ],
};

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function OrderDetails() {
  const { orderId } = useParams();

  const subtotal = order.products.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  const discount = 2000;
  const delivery = 0;
  const total = subtotal - discount + delivery;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* =====================================================
            HEADER
        ====================================================== */}

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
                {order.id}
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Placed on {order.date}
              </p>
            </div>

            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* ===================================================
              LEFT COLUMN
          ==================================================== */}

          <div className="space-y-5">
            {/* =================================================
                ORDER TIMELINE
            ================================================== */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Order status
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Track the progress of your order.
                </p>
              </div>

              <div className="p-5">
                <OrderTimeline />
              </div>
            </section>

            {/* =================================================
                PRODUCTS
            ================================================== */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Items
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {order.products.length} products in this order
                  </p>
                </div>

                <Package size={19} className="text-slate-400" />
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.products.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* =================================================
                DELIVERY ADDRESS
            ================================================== */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Delivery address
                </h2>
              </div>

              <div className="flex gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {order.deliveryAddress.name}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {order.deliveryAddress.address}
                    <br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                    {order.deliveryAddress.pincode}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {order.deliveryAddress.phone}
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                PAYMENT
            ================================================== */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Payment information
                </h2>
              </div>

              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {order.paymentMethod}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Payment completed successfully
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10">
                  {order.paymentStatus}
                </span>
              </div>
            </section>
          </div>

          {/* ===================================================
              RIGHT COLUMN
          ==================================================== */}

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* =================================================
                PRICE SUMMARY
            ================================================== */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Price summary
                </h2>
              </div>

              <div className="space-y-3 p-4 text-sm">
                <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />

                <SummaryRow
                  label="Discount"
                  value={`− ${formatPrice(discount)}`}
                  valueClass="text-emerald-600"
                />

                <SummaryRow
                  label="Delivery"
                  value="FREE"
                  valueClass="text-emerald-600"
                />

                <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-700" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Total
                  </span>

                  <span className="text-xl font-bold text-slate-950 dark:text-white">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </section>

            {/* =================================================
                DELIVERY CARD
            ================================================== */}

            <section className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm dark:bg-slate-900">
                  <Truck size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Delivered
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Your order was delivered on {order.deliveredDate}.
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="space-y-3">
              <button
                type="button"
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-md"
              >
                <RotateCcw size={16} />
                Buy again
              </button>

              <button
                type="button"
                className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Download invoice
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ============================================================
   ORDER TIMELINE
============================================================ */

function OrderTimeline() {
  const steps = [
    {
      title: "Order placed",
      description: "18 Aug 2026",
      icon: Check,
      completed: true,
    },
    {
      title: "Processing",
      description: "18 Aug 2026",
      icon: Package,
      completed: true,
    },
    {
      title: "Shipped",
      description: "19 Aug 2026",
      icon: Truck,
      completed: true,
    },
    {
      title: "Delivered",
      description: "21 Aug 2026",
      icon: Check,
      completed: true,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {steps.map((step, index) => {
        const Icon = step.icon;

        return (
          <div key={step.title} className="relative text-center">
            {index < steps.length - 1 && (
              <div className="absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-4 h-px bg-emerald-600" />
            )}

            <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Icon size={14} />
            </div>

            <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              {step.title}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   PRODUCT ROW
============================================================ */

function ProductRow({ product }) {
  return (
    <div className="flex gap-3 p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
          {product.name}
        </p>

        <p className="mt-1 text-xs text-slate-400">{product.variant}</p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Quantity: {product.quantity}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {formatPrice(product.price)}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
        >
          View product
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>

      <span
        className={`font-medium text-slate-700 dark:text-slate-300 ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}
