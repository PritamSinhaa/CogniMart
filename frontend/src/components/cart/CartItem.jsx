import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <article
      className="
        flex
        gap-4
        border-b
        border-slate-200
        py-5
        dark:border-slate-800
      "
    >
      {/* Image */}

      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-28 sm:w-28">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-contain p-2"
        />
      </div>

      {/* Information */}

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {item.category}
        </p>

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
          {item.name}
        </h3>

        <p className="mt-2 text-base font-bold text-slate-950 dark:text-white">
          ₹{item.price.toLocaleString("en-IN")}
        </p>

        {/* Controls */}

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() =>
                decreaseQuantity(item.id)
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                text-slate-500
                hover:text-emerald-600
              "
            >
              <Minus size={13} />
            </button>

            <span className="w-8 text-center text-xs font-semibold text-slate-900 dark:text-white">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                increaseQuantity(item.id)
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                text-slate-500
                hover:text-emerald-600
              "
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              removeFromCart(item.id)
            }
            className="
              flex
              items-center
              gap-1.5
              text-xs
              font-medium
              text-slate-400
              transition-colors
              hover:text-red-500
            "
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">
              Remove
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}