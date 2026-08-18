import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const initialCartItems = [
  {
    id: 1,
    name: "Sony WH-1000XM5",
    variant: "Black",
    price: 29990,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Apple AirPods Pro",
    variant: "White",
    price: 24999,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=500&q=80",
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  item.quantity + change
                ),
              }
            : item
        )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const discount = subtotal >= 40000 ? 2000 : 0;

  const delivery = subtotal > 0 ? 0 : 0;

  const total = subtotal - discount + delivery;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* ================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <Link
            to="/products"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition-colors
              hover:text-emerald-600
              dark:text-slate-400
            "
          >
            <ArrowLeft size={16} />
            Continue shopping
          </Link>

          <div className="mt-5">
            <p className="text-sm font-semibold text-emerald-600">
              Your shopping bag
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Review your items before moving to checkout.
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

            {/* ============================================
                CART ITEMS
            ============================================= */}

            <section className="min-w-0">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                {/* Section header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
                  <div>
                    <h2 className="font-bold text-slate-950 dark:text-white">
                      Cart items
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {cartItems.length}{" "}
                      {cartItems.length === 1
                        ? "product"
                        : "products"}
                    </p>
                  </div>

                  <ShoppingBag
                    size={20}
                    className="text-emerald-600"
                  />
                </div>

                {/* Items */}

                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="p-5 sm:p-6"
                    >
                      <div className="flex gap-4">

                        {/* Product image */}

                        <Link
                          to={`/products/${item.id}`}
                          className="
                            h-24
                            w-24
                            shrink-0
                            overflow-hidden
                            rounded-xl
                            bg-slate-100
                            sm:h-32
                            sm:w-32
                            dark:bg-slate-800
                          "
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-300
                              hover:scale-105
                            "
                          />
                        </Link>

                        {/* Product details */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">
                              <p className="text-xs font-medium text-emerald-600">
                                Electronics
                              </p>

                              <Link
                                to={`/products/${item.id}`}
                                className="
                                  mt-1
                                  block
                                  line-clamp-2
                                  text-sm
                                  font-bold
                                  text-slate-950
                                  transition-colors
                                  hover:text-emerald-600
                                  sm:text-base
                                  dark:text-white
                                "
                              >
                                {item.name}
                              </Link>

                              <p className="mt-1 text-xs text-slate-400">
                                {item.variant}
                              </p>
                            </div>

                            {/* Desktop price */}

                            <p className="hidden shrink-0 text-base font-bold text-slate-950 sm:block dark:text-white">
                              {formatPrice(
                                item.price *
                                  item.quantity
                              )}
                            </p>
                          </div>

                          <div className="mt-5 flex items-center justify-between gap-3">

                            {/* Quantity */}

                            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    -1
                                  )
                                }
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  text-slate-500
                                  transition-colors
                                  hover:text-emerald-600
                                  dark:text-slate-400
                                "
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>

                              <span className="flex h-9 min-w-9 items-center justify-center border-x border-slate-200 px-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-200">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    1
                                  )
                                }
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  text-slate-500
                                  transition-colors
                                  hover:text-emerald-600
                                  dark:text-slate-400
                                "
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Actions */}

                            <div className="flex items-center gap-1">

                              <button
                                type="button"
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-slate-400
                                  transition-colors
                                  hover:bg-emerald-50
                                  hover:text-emerald-600
                                  dark:hover:bg-emerald-500/10
                                "
                                aria-label="Move to wishlist"
                              >
                                <Heart size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(item.id)
                                }
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-slate-400
                                  transition-colors
                                  hover:bg-red-50
                                  hover:text-red-500
                                  dark:hover:bg-red-500/10
                                "
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={17} />
                              </button>

                            </div>
                          </div>

                          {/* Mobile price */}

                          <p className="mt-3 text-sm font-bold text-slate-950 sm:hidden dark:text-white">
                            {formatPrice(
                              item.price *
                                item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Benefits */}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                    <Truck size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Free delivery
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-slate-400">
                      Free standard delivery on eligible orders.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                    <ShieldCheck size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Secure shopping
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-slate-400">
                      Your payment and information stay protected.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* ============================================
                ORDER SUMMARY
            ============================================= */}

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Order Summary
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Review your total before checkout.
                  </p>
                </div>

                <div className="p-5 sm:p-6">

                  <div className="space-y-3 text-sm">

                    <SummaryRow
                      label="Subtotal"
                      value={formatPrice(subtotal)}
                    />

                    <SummaryRow
                      label="Discount"
                      value={
                        discount > 0
                          ? `− ${formatPrice(discount)}`
                          : "₹0"
                      }
                      valueClass="text-emerald-600"
                    />

                    <SummaryRow
                      label="Delivery"
                      value="FREE"
                      valueClass="text-emerald-600"
                    />

                  </div>

                  {/* Promo */}

                  <div className="my-5 border-t border-dashed border-slate-200 dark:border-slate-700" />

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="
                        h-10
                        min-w-0
                        flex-1
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-xs
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-emerald-500
                        focus:ring-4
                        focus:ring-emerald-500/10
                        dark:border-slate-700
                        dark:bg-slate-950
                        dark:text-white
                      "
                    />

                    <button
                      type="button"
                      className="
                        h-10
                        rounded-lg
                        border
                        border-emerald-600
                        px-4
                        text-xs
                        font-semibold
                        text-emerald-600
                        transition-colors
                        hover:bg-emerald-50
                        dark:hover:bg-emerald-500/10
                      "
                    >
                      Apply
                    </button>
                  </div>

                  <div className="my-5 border-t border-slate-200 dark:border-slate-700" />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Total
                    </span>

                    <span className="text-xl font-bold text-slate-950 dark:text-white">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* Checkout */}

                  <Link
                    to="/checkout"
                    className="
                      group
                      mt-5
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
                      shadow-sm
                      shadow-emerald-600/20
                      transition-all
                      hover:bg-emerald-700
                      hover:shadow-md
                      active:scale-[0.99]
                    "
                  >
                    Proceed to Checkout

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>

                  <Link
                    to="/products"
                    className="
                      mt-3
                      flex
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-slate-500
                      transition-colors
                      hover:text-emerald-600
                      dark:text-slate-400
                    "
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

/* ==========================================================
   SUMMARY ROW
========================================================== */

function SummaryRow({
  label,
  value,
  valueClass = "",
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span
        className={`font-medium text-slate-700 dark:text-slate-300 ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ==========================================================
   EMPTY CART
========================================================== */

function EmptyCart() {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        flex
        min-h-[500px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-6
        text-center
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
        <ShoppingBag size={34} />
      </div>

      <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">
        Your cart is empty
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        Looks like you haven't added anything yet.
        Explore our products and find something you'll love.
      </p>

      <Link
        to="/products"
        className="
          mt-6
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-emerald-600
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          transition-all
          hover:bg-emerald-700
          active:scale-[0.98]
        "
      >
        Start Shopping
        <ArrowRight size={16} />
      </Link>
    </motion.section>
  );
}