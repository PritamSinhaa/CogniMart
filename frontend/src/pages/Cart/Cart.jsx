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

const FALLBACK_IMAGE = "/images/product-placeholder.png";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

export default function Cart() {
  const {
    cartItems,
    cartCount,
    uniqueItemCount,
    originalSubtotal,
    subtotal,
    discount,
    delivery,
    total,
    loading,
    error,
    updatingProductId,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    clearCartError,
  } = useCart();

  const { addToWishlist, isInWishlist } = useWishlist();

  /*
  |--------------------------------------------------------------------------
  | Move product to wishlist
  |--------------------------------------------------------------------------
  */

  const handleMoveToWishlist = async (item) => {
    try {
      clearCartError();

      /*
       * Avoid adding the same product
       * twice when it is already saved.
       */
      if (!isInWishlist(item.id)) {
        await addToWishlist(item);
      }

      /*
       * Remove from the cart only after
       * the wishlist operation succeeds.
       */
      await removeFromCart(item.id);
    } catch {
      /*
       * CartContext or WishlistContext
       * owns the visible request error.
       */
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Clear cart
  |--------------------------------------------------------------------------
  */

  const handleClearCart = async () => {
    const confirmed = window.confirm("Remove all products from your cart?");

    if (!confirmed) {
      return;
    }

    try {
      clearCartError();
      await clearCart();
    } catch {
      /*
       * CartContext displays the
       * request error.
       */
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <CartHeader cartCount={cartCount} />

        {error && <CartError message={error} onClose={clearCartError} />}

        {loading && cartItems.length === 0 ? (
          <CartLoading />
        ) : cartItems.length === 0 ? (
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
                      disabled={loading}
                      className="text-xs font-semibold text-red-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                      updating={String(updatingProductId) === String(item.id)}
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
              originalSubtotal={originalSubtotal}
              subtotal={subtotal}
              discount={discount}
              delivery={delivery}
              total={total}
            />
          </div>
        )}
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Product
|--------------------------------------------------------------------------
*/

function CartProduct({
  item,
  index,
  updating,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  moveToWishlist,
}) {
  const itemTotal = Number(item.price) * Number(item.quantity);

  const isAtStockLimit = item.quantity >= item.availableStock;

  const isUnavailable =
    !item.isActive || !item.inStock || item.availableStock <= 0;

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src = FALLBACK_IMAGE;
  };

  const handleIncrease = () => {
    void increaseQuantity(item.id).catch(() => {});
  };

  const handleDecrease = () => {
    void decreaseQuantity(item.id).catch(() => {});
  };

  const handleRemove = () => {
    void removeFromCart(item.id).catch(() => {});
  };

  const handleMove = () => {
    void moveToWishlist(item);
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

              {isUnavailable ? (
                <p className="mt-1 text-xs font-medium text-red-500">
                  Currently unavailable
                </p>
              ) : (
                item.availableStock <= 5 && (
                  <p className="mt-1 text-xs font-medium text-amber-500">
                    Only {item.availableStock} left in stock
                  </p>
                )
              )}
            </div>

            <div className="hidden shrink-0 text-right sm:block">
              <p className="text-base font-bold text-slate-950 dark:text-white">
                {formatPrice(itemTotal)}
              </p>

              {item.originalPrice > item.price && (
                <p className="mt-1 text-xs text-slate-400 line-through">
                  {formatPrice(item.originalPrice * item.quantity)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={updating || item.quantity <= 1 || isUnavailable}
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
                onClick={handleIncrease}
                disabled={updating || isAtStockLimit || isUnavailable}
                className="flex h-9 w-9 items-center justify-center text-slate-500 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleMove}
                disabled={updating}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-emerald-500/10"
                aria-label={`Move ${item.name} to wishlist`}
              >
                <Heart size={17} />
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={updating}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10"
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>

          <div className="mt-3 sm:hidden">
            <p className="text-sm font-bold text-slate-950 dark:text-white">
              {formatPrice(itemTotal)}
            </p>

            {item.originalPrice > item.price && (
              <p className="mt-1 text-xs text-slate-400 line-through">
                {formatPrice(item.originalPrice * item.quantity)}
              </p>
            )}
          </div>

          {isAtStockLimit && !isUnavailable && (
            <p className="mt-2 text-xs text-amber-500">
              Maximum available quantity reached.
            </p>
          )}

          {updating && (
            <p className="mt-2 text-xs font-medium text-emerald-600">
              Updating cart...
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/*
|--------------------------------------------------------------------------
| Shopping benefits
|--------------------------------------------------------------------------
*/

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
        description="Product prices and stock are verified again before the order is placed."
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

/*
|--------------------------------------------------------------------------
| Order summary
|--------------------------------------------------------------------------
*/

function OrderSummary({
  originalSubtotal,
  subtotal,
  discount,
  delivery,
  total,
}) {
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
            <SummaryRow
              label="Original price"
              value={formatPrice(originalSubtotal)}
            />

            {discount > 0 && (
              <SummaryRow
                label="Product discount"
                value={`− ${formatPrice(discount)}`}
                valueClass="text-emerald-600"
              />
            )}

            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />

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
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>

      <span
        className={`font-medium text-slate-700 dark:text-slate-300 ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Error
|--------------------------------------------------------------------------
*/

function CartError({ message, onClose }) {
  return (
    <div
      role="alert"
      className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10"
    >
      <p className="text-sm font-medium text-red-600 dark:text-red-400">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-xs font-semibold text-red-500 hover:text-red-700"
      >
        Dismiss
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function CartLoading() {
  return (
    <div
      role="status"
      className="flex min-h-[430px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />

        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading your cart...
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty cart
|--------------------------------------------------------------------------
*/

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
