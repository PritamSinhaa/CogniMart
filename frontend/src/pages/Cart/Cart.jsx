import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

import { motion } from "motion/react";

import { useCart } from "../../context/CartContext";

import { useWishlist } from "../../context/WishlistContext";

const FALLBACK_IMAGE = "/favicon.svg";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

export default function Cart() {
  const {
    cartItems,
    cartCount,
    uniqueItemCount,
    subtotal,
    discount,
    delivery,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { addToWishlist } = useWishlist();

  const handleMoveToWishlist = (item) => {
    addToWishlist(item);
    removeFromCart(item.id);
  };

  const handleClearCart = () => {
    const confirmed = window.confirm("Remove all products from your cart?");

    if (confirmed) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <CartHeader cartCount={cartCount} />

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-slate-800">
                  <div>
                    <h2 className="font-bold text-slate-950 dark:text-white">
                      Cart items
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {uniqueItemCount}{" "}
                      {uniqueItemCount === 1 ? "product" : "products"},{" "}
                      {cartCount} {cartCount === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-xs font-semibold text-red-500 transition-colors hover:text-red-600"
                    >
                      Clear cart
                    </button>

                    <ShoppingBag size={20} className="text-emerald-600" />
                  </div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {cartItems.map((item, index) => (
                    <CartProduct
                      key={item.id}
                      item={item}
                      index={index}
                      increaseQuantity={increaseQuantity}
                      decreaseQuantity={decreaseQuantity}
                      removeFromCart={removeFromCart}
                      moveToWishlist={handleMoveToWishlist}
                    />
                  ))}
                </div>
              </div>

              <ShoppingBenefits />
            </section>

            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              delivery={delivery}
              total={total}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CartHeader({ cartCount }) {
  return (
    <div className="mb-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400"
      >
        <ArrowLeft size={16} />
        Continue shopping
      </Link>

      <div className="mt-5">
        <p className="text-sm font-semibold text-emerald-600">
          Your shopping bag
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
          Shopping Cart
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {cartCount > 0
            ? `You have ${cartCount} ${
                cartCount === 1 ? "item" : "items"
              } in your cart.`
            : "Your cart is currently empty."}
        </p>
      </div>
    </div>
  );
}

function CartProduct({
  item,
  index,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  moveToWishlist,
}) {
  const itemTotal = Number(item.price) * Number(item.quantity);

  const isAtStockLimit = item.quantity >= item.stock;

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -10,
      }}
      transition={{
        delay: Math.min(index * 0.05, 0.25),
      }}
      className="p-5 sm:p-6"
    >
      <div className="flex gap-4">
        <Link
          to={`/products/${item.id}`}
          className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-32 dark:bg-slate-800"
        >
          <img
            src={item.image || FALLBACK_IMAGE}
            alt={item.name}
            loading="lazy"
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-emerald-600">
                {item.category || "Uncategorized"}
              </p>

              <Link
                to={`/products/${item.id}`}
                className="mt-1 block line-clamp-2 text-sm font-bold text-slate-950 transition-colors hover:text-emerald-600 sm:text-base dark:text-white"
              >
                {item.name}
              </Link>

              {item.brand && (
                <p className="mt-1 text-xs text-slate-400">{item.brand}</p>
              )}

              {item.stock <= 5 && (
                <p className="mt-1 text-xs font-medium text-amber-500">
                  Only {item.stock} left in stock
                </p>
              )}
            </div>

            <p className="hidden shrink-0 text-base font-bold text-slate-950 sm:block dark:text-white">
              {formatPrice(itemTotal)}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => decreaseQuantity(item.id)}
                disabled={item.quantity <= 1}
                className="flex h-9 w-9 items-center justify-center text-slate-500 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus size={14} />
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center border-x border-slate-200 px-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-200">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => increaseQuantity(item.id)}
                disabled={isAtStockLimit}
                className="flex h-9 w-9 items-center justify-center text-slate-500 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveToWishlist(item)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10"
                aria-label={`Move ${item.name} to wishlist`}
              >
                <Heart size={17} />
              </button>

              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>

          <p className="mt-3 text-sm font-bold text-slate-950 sm:hidden dark:text-white">
            {formatPrice(itemTotal)}
          </p>

          {isAtStockLimit && (
            <p className="mt-2 text-xs text-amber-500">
              Maximum available quantity reached.
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ShoppingBenefits() {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <BenefitItem
        icon={Truck}
        title="Delivery information"
        description="Delivery charges are calculated from your current cart total."
      />

      <BenefitItem
        icon={ShieldCheck}
        title="Secure shopping"
        description="Product prices and stock will be verified again before the order is placed."
      />
    </div>
  );
}

function BenefitItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
        <Icon size={17} />
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-4 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, discount, delivery, total }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Order Summary
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Review your total before checkout.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="space-y-3 text-sm">
            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />

            <SummaryRow
              label="Discount"
              value={
                discount > 0 ? `− ${formatPrice(discount)}` : formatPrice(0)
              }
              valueClass={discount > 0 ? "text-emerald-600" : ""}
            />

            <SummaryRow
              label="Delivery"
              value={delivery === 0 ? "FREE" : formatPrice(delivery)}
              valueClass={delivery === 0 ? "text-emerald-600" : ""}
            />
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

          <Link
            to="/checkout"
            className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.99]"
          >
            Proceed to Checkout
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">
            Prices and availability will be verified when the order is placed.
          </p>
        </div>
      </div>
    </aside>
  );
}

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

function EmptyCart() {
  return (
    <div className="flex min-h-[430px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <ShoppingBag size={30} />
        </div>

        <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">
          Your cart is empty
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Explore our products and add something you like to your cart.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Browse Products
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
