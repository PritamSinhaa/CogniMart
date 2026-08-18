import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

export default function OrderSuccess() {
  const orderId = "CGM-2026-00124";
  const deliveryDate = "25–27 August";
  const total = "₹52,989";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-2xl"
        >
          {/* Success Icon */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
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
              Payment successful
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Order placed successfully!
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              Thank you for shopping with CogniMart. We've received
              your order and will keep you updated about its delivery.
            </p>
          </div>

          {/* Order Card */}

          <div className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            {/* Order Information */}

            <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-800">

              <InfoItem
                label="Order ID"
                value={orderId}
              />

              <InfoItem
                label="Estimated delivery"
                value={deliveryDate}
              />

              <InfoItem
                label="Total paid"
                value={total}
              />

            </div>

            {/* Delivery Progress */}

            <div className="border-t border-slate-200 p-5 dark:border-slate-800">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                  <Package size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Your order is being prepared
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    We'll notify you when your order is shipped.
                  </p>
                </div>
              </div>

              {/* Progress */}

              <div className="mt-5 flex items-center">

                <ProgressStep
                  icon={Check}
                  title="Order placed"
                  active
                />

                <ProgressLine active />

                <ProgressStep
                  icon={Package}
                  title="Processing"
                  active
                />

                <ProgressLine />

                <ProgressStep
                  icon={Truck}
                  title="Delivered"
                />

              </div>
            </div>

            {/* Actions */}

            <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row dark:border-slate-800">

              <Link
                to="/orders"
                className="
                  group
                  flex
                  h-11
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-emerald-600
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  shadow-emerald-600/20
                  transition-all
                  hover:bg-emerald-700
                  hover:shadow-md
                "
              >
                View order

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to="/"
                className="
                  flex
                  h-11
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  font-semibold
                  text-slate-700
                  transition-colors
                  hover:border-slate-300
                  hover:bg-slate-50
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-200
                  dark:hover:bg-slate-800
                "
              >
                <ShoppingBag size={16} />

                Continue shopping
              </Link>

            </div>
          </div>

          {/* Footer Note */}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldIcon />

            <span>
              Your order information is securely stored.
            </span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({ label, value }) {
  return (
    <div className="px-5 py-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   PROGRESS STEP
============================================================ */

function ProgressStep({
  icon: Icon,
  title,
  active = false,
}) {
  return (
    <div className="flex min-w-0 flex-col items-center">

      <div
        className={`
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          ${
            active
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-400 dark:bg-slate-800"
          }
        `}
      >
        <Icon size={15} />
      </div>

      <p
        className={`
          mt-2
          whitespace-nowrap
          text-xs
          font-medium
          ${
            active
              ? "text-slate-700 dark:text-slate-200"
              : "text-slate-400"
          }
        `}
      >
        {title}
      </p>
    </div>
  );
}

/* ============================================================
   PROGRESS LINE
============================================================ */

function ProgressLine({ active = false }) {
  return (
    <div
      className={`
        mx-2
        mb-5
        h-px
        flex-1
        ${
          active
            ? "bg-emerald-600"
            : "bg-slate-200 dark:bg-slate-700"
        }
      `}
    />
  );
}

/* ============================================================
   SECURITY ICON
============================================================ */

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7 3v5c0 4.5-2.9 8.1-7 10-4.1-1.9-7-5.5-7-10V6l7-3z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 12 2 2 4-4"
      />
    </svg>
  );
}