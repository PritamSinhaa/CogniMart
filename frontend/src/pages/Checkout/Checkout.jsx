import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import DeliveryAddressSection from "../../components/checkout/DeliveryAddressSection";

import { createOrder } from "../../api/order.api";

import { useAddresses } from "../../context/AddressContext";
import { useCart } from "../../context/CartContext";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to place your order";
}

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    subtotal,
    shippingFee,
    total,
    loading: cartLoading,
    refreshCart,
  } = useCart();

  const {
    selectedAddress,
    selectedAddressId,
    loading: addressLoading,
  } = useAddresses();

  /*
   * Keep COD as the only active option until
   * Razorpay payment verification is connected.
   */
  const [paymentMethod] = useState("cod");

  const [placingOrder, setPlacingOrder] = useState(false);

  const [orderError, setOrderError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Price information
  |--------------------------------------------------------------------------
  */

  const originalSubtotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.originalPrice || item.price) * item.quantity,
    0,
  );

  const productDiscount = Math.max(originalSubtotal - subtotal, 0);

  /*
  |--------------------------------------------------------------------------
  | Place order
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (placingOrder) {
      return;
    }

    setOrderError("");

    if (cartItems.length === 0) {
      setOrderError("Your cart is empty. Add products before checking out.");

      return;
    }

    if (!selectedAddressId) {
      setOrderError("Please save and select a delivery address.");

      return;
    }

    setPlacingOrder(true);

    try {
      const response = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
      });

      const order = response?.data?.order || response?.order || null;

      /*
       * The backend clears the MongoDB cart inside
       * the order transaction. Refresh the frontend
       * state after the order succeeds.
       */
      await refreshCart();

      navigate("/order-success", {
        replace: true,
        state: {
          order,
          orderId: order?._id || null,
        },
      });
    } catch (error) {
      setOrderError(getErrorMessage(error));
    } finally {
      setPlacingOrder(false);
    }
  };

  const checkoutLoading = cartLoading || addressLoading;

  const placeOrderDisabled =
    checkoutLoading ||
    placingOrder ||
    cartItems.length === 0 ||
    !selectedAddressId;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page header */}

        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400"
          >
            <ArrowLeft size={16} />
            Back to cart
          </Link>

          <div className="mt-4">
            <p className="text-sm font-semibold text-emerald-600">
              Secure checkout
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Checkout
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Select a saved address and complete your order.
            </p>
          </div>
        </div>

        {checkoutLoading ? (
          <CheckoutLoading />
        ) : cartItems.length === 0 ? (
          <EmptyCheckout />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 lg:grid-cols-[1fr_340px]"
          >
            {/* Left column */}

            <div className="space-y-4">
              {/* Saved delivery addresses */}

              <DeliveryAddressSection />

              {/* Payment method */}

              <PaymentSection paymentMethod={paymentMethod} />

              {/* Security notice */}

              <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Secure checkout
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Product prices, stock, discounts and order totals are
                    verified securely by the server.
                  </p>
                </div>
              </div>
            </div>

            {/* Order summary */}

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Order summary
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </p>
                </div>

                {/* Products */}

                <div className="max-h-80 space-y-3 overflow-y-auto p-4">
                  {cartItems.map((item) => (
                    <CheckoutItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Selected address summary */}

                {selectedAddress && (
                  <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Delivering to
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {selectedAddress.fullName}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {selectedAddress.addressLine1}
                      {selectedAddress.addressLine2
                        ? `, ${selectedAddress.addressLine2}`
                        : ""}
                      , {selectedAddress.city}, {selectedAddress.state}{" "}
                      {selectedAddress.postalCode}
                    </p>
                  </div>
                )}

                {/* Totals */}

                <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                  <div className="space-y-3 text-sm">
                    <SummaryRow
                      label="Original price"
                      value={formatPrice(originalSubtotal)}
                    />

                    {productDiscount > 0 && (
                      <SummaryRow
                        label="Product discount"
                        value={`− ${formatPrice(productDiscount)}`}
                        valueClass="text-emerald-600"
                      />
                    )}

                    <SummaryRow
                      label="Subtotal"
                      value={formatPrice(subtotal)}
                    />

                    <SummaryRow
                      label="Delivery"
                      value={
                        shippingFee === 0 ? "FREE" : formatPrice(shippingFee)
                      }
                      valueClass={shippingFee === 0 ? "text-emerald-600" : ""}
                    />
                  </div>

                  <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-700" />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Total
                    </span>

                    <span className="text-xl font-bold text-slate-950 dark:text-white">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {orderError && (
                    <p
                      role="alert"
                      className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                    >
                      {orderError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={placeOrderDisabled}
                    className="group mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {placingOrder ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" />
                        Placing order...
                      </>
                    ) : (
                      <>
                        Place COD order
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>

                  {!selectedAddressId && (
                    <p className="mt-3 text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                      Save and select an address to continue.
                    </p>
                  )}

                  <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">
                    By placing your order, you agree to our terms and
                    conditions.
                  </p>
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Payment
|--------------------------------------------------------------------------
*/

function PaymentSection({ paymentMethod }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <WalletCards size={18} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Payment method
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Online payment will be available after Razorpay integration.
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="relative rounded-xl border border-emerald-500 bg-emerald-50/60 p-4 dark:bg-emerald-500/5">
          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
            <ShieldCheck size={12} />
          </div>

          <WalletCards size={20} className="text-emerald-600" />

          <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Cash on delivery
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Pay when your order arrives
          </p>

          <input type="hidden" name="paymentMethod" value={paymentMethod} />
        </div>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Checkout item
|--------------------------------------------------------------------------
*/

function CheckoutItem({ item }) {
  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <div className="flex gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.name}
          onError={handleImageError}
          className="h-full w-full object-cover"
        />

        <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
          {item.quantity}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <Link
          to={`/products/${item.id}`}
          className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors hover:text-emerald-600 dark:text-slate-200"
        >
          {item.name}
        </Link>

        {item.brand && (
          <p className="mt-1 text-xs text-slate-400">{item.brand}</p>
        )}

        <p className="mt-1 text-xs text-slate-400">Quantity: {item.quantity}</p>
      </div>

      <p className="shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {formatPrice(item.price * item.quantity)}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Summary row
|--------------------------------------------------------------------------
*/

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
| Loading state
|--------------------------------------------------------------------------
*/

function CheckoutLoading() {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="text-center">
        <LoaderCircle
          size={28}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading checkout...
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

function EmptyCheckout() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <WalletCards
        size={36}
        className="mx-auto text-slate-300 dark:text-slate-700"
      />

      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        Your cart is empty
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Add products to your cart before proceeding to checkout.
      </p>

      <Link
        to="/products"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Browse products
      </Link>
    </div>
  );
}
