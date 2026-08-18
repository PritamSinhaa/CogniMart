import { ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartSummary() {
  const {
    subtotal,
    delivery,
    total,
  } = useCart();

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <h2 className="text-lg font-bold text-slate-950 dark:text-white">
        Order Summary
      </h2>

      <div className="mt-5 space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">
            Subtotal
          </span>

          <span className="font-medium text-slate-900 dark:text-white">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">
            Delivery
          </span>

          <span className="font-medium text-emerald-600">
            {delivery === 0
              ? "FREE"
              : `₹${delivery}`}
          </span>
        </div>
      </div>

      <div className="my-5 h-px bg-slate-200 dark:bg-slate-800" />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-900 dark:text-white">
          Total
        </span>

        <span className="text-xl font-bold text-slate-950 dark:text-white">
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>

      <button
        type="button"
        className="
          mt-6
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-emerald-600
          text-sm
          font-semibold
          text-white
          transition-all
          hover:bg-emerald-700
          active:scale-[0.98]
        "
      >
        Proceed to Checkout
        <ArrowRight size={16} />
      </button>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
        <ShieldCheck
          size={17}
          className="mt-0.5 shrink-0 text-emerald-600"
        />

        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
          Your order and payment information will be
          securely processed.
        </p>
      </div>
    </div>
  );
}