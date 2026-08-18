import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";

export default function Cart() {
  const { cartItems, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-5">
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/30">
              <ShoppingBag
                size={32}
                className="text-emerald-600"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Looks like you haven't added anything to
              your cart yet.
            </p>

            <Link
              to="/products"
              className="
                mt-6
                inline-flex
                h-11
                items-center
                justify-center
                rounded-xl
                bg-emerald-600
                px-6
                text-sm
                font-semibold
                text-white
                transition-colors
                hover:bg-emerald-700
              "
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12">
        {/* Header */}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Shopping Cart
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Your Cart
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {cartCount}{" "}
            {cartCount === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>

        {/* Content */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Items */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-5
              dark:border-slate-800
              dark:bg-slate-900
              sm:px-6
            "
          >
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}
          </section>

          {/* Summary */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary />
          </aside>
        </div>
      </main>
    </div>
  );
}