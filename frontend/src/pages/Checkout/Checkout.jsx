import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import CouponSection from "../../components/checkout/CouponSection";
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

function roundMoney(value) {
  return Number((Number(value) || 0).toFixed(2));
}

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    originalSubtotal,
    subtotal,
    discount,
    shippingFee,
    loading: cartLoading,
    refreshCart,
  } = useCart();

  const {
    selectedAddress,
    selectedAddressId,
    loading: addressLoading,
  } = useAddresses();

  /*
   * Keep COD as the only payment
   * option until Razorpay is ready.
   */
  const [paymentMethod] = useState("cod");

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [orderError, setOrderError] = useState("");

  /*
   * A coupon is validated against a
   * particular order subtotal.
   *
   * Remove it whenever the cart subtotal
   * changes so an old discount is never
   * displayed or submitted.
   */
  useEffect(() => {
    setAppliedCoupon((currentCoupon) => {
      if (!currentCoupon) {
        return null;
      }

      const couponOrderValue = roundMoney(currentCoupon.orderValue);

      const currentSubtotal = roundMoney(subtotal);

      if (couponOrderValue !== currentSubtotal) {
        return null;
      }

      return currentCoupon;
    });
  }, [subtotal]);

  const couponMatchesSubtotal =
    appliedCoupon &&
    roundMoney(appliedCoupon.orderValue) === roundMoney(subtotal);

  const validAppliedCoupon = couponMatchesSubtotal ? appliedCoupon : null;

  const couponDiscount = Math.min(
    roundMoney(validAppliedCoupon?.discount),
    roundMoney(subtotal),
  );

  /*
   * Shipping is calculated from the
   * selling-price subtotal before the
   * coupon, matching the backend.
   */
  const finalTotal = Math.max(
    roundMoney(subtotal + shippingFee - couponDiscount),
    0,
  );

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

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      setOrderError("Your cart is empty. Add products before checking out.");

      return;
    }

    if (!selectedAddressId) {
      setOrderError("Please save and select a delivery address.");

      return;
    }

    const unavailableItem = cartItems.find(
      (item) =>
        !item.isActive || !item.inStock || item.availableStock < item.quantity,
    );

    if (unavailableItem) {
      setOrderError(
        `${unavailableItem.name} is unavailable or does not have enough stock.`,
      );

      return;
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        addressId: selectedAddressId,

        paymentMethod,
      };

      const couponCode = validAppliedCoupon?.coupon?.code;

      if (couponCode) {
        orderData.couponCode = couponCode;
      }

      /*
       * The backend validates prices,
       * stock and coupon again.
       */
      const response = await createOrder(orderData);

      const order = response?.data?.order || response?.order || null;

      if (!order?._id) {
        throw new Error(
          "The order was created, but its confirmation could not be loaded.",
        );
      }

      /*
       * The backend clears the database
       * cart inside the order transaction.
       */
      await refreshCart();

      setAppliedCoupon(null);

      navigate(`/order-success/${order._id}`, {
        replace: true,

        state: {
          order,
        },
      });
    } catch (error) {
      setOrderError(getErrorMessage(error));
    } finally {
      setPlacingOrder(false);
    }
  };

  const checkoutLoading = cartLoading || addressLoading;

  const hasUnavailableItem = cartItems.some(
    (item) =>
      !item.isActive || !item.inStock || item.availableStock < item.quantity,
  );

  const placeOrderDisabled =
    checkoutLoading ||
    placingOrder ||
    cartItems.length === 0 ||
    !selectedAddressId ||
    hasUnavailableItem;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <CheckoutHeader />

        {checkoutLoading ? (
          <CheckoutLoading />
        ) : cartItems.length === 0 ? (
          <EmptyCheckout />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 lg:grid-cols-[1fr_340px]"
          >
            <div className="space-y-4">
              <DeliveryAddressSection />

              <PaymentSection paymentMethod={paymentMethod} />

              <CouponSection
                orderValue={subtotal}
                appliedCoupon={validAppliedCoupon}
                onCouponApplied={setAppliedCoupon}
                onCouponRemoved={() => setAppliedCoupon(null)}
              />

              <SecurityNotice />
            </div>

            <CheckoutSummary
              cartItems={cartItems}
              cartCount={cartCount}
              selectedAddress={selectedAddress}
              originalSubtotal={originalSubtotal}
              subtotal={subtotal}
              productDiscount={discount}
              couponDiscount={couponDiscount}
              couponCode={validAppliedCoupon?.coupon?.code}
              shippingFee={shippingFee}
              finalTotal={finalTotal}
              orderError={orderError}
              placingOrder={placingOrder}
              selectedAddressId={selectedAddressId}
              placeOrderDisabled={placeOrderDisabled}
              hasUnavailableItem={hasUnavailableItem}
            />
          </form>
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

function CheckoutHeader() {
  return (
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
  );
}

/*
|--------------------------------------------------------------------------
| Payment method
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
            Pay when your order arrives.
          </p>

          <input type="hidden" name="paymentMethod" value={paymentMethod} />
        </div>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Security notice
|--------------------------------------------------------------------------
*/

function SecurityNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
      <ShieldCheck size={19} className="mt-0.5 shrink-0 text-emerald-600" />

      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Secure checkout
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Product prices, stock, discounts, coupons and order totals are
          verified securely by the server.
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Checkout summary
|--------------------------------------------------------------------------
*/

function CheckoutSummary({
  cartItems,
  cartCount,
  selectedAddress,
  originalSubtotal,
  subtotal,
  productDiscount,
  couponDiscount,
  couponCode,
  shippingFee,
  finalTotal,
  orderError,
  placingOrder,
  selectedAddressId,
  placeOrderDisabled,
  hasUnavailableItem,
}) {
  return (
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

        <div className="max-h-80 space-y-3 overflow-y-auto p-4">
          {cartItems.map((item) => (
            <CheckoutItem key={item.id} item={item} />
          ))}
        </div>

        {selectedAddress && <SelectedAddress address={selectedAddress} />}

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

            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />

            {couponDiscount > 0 && (
              <SummaryRow
                label={
                  couponCode ? `Coupon (${couponCode})` : "Coupon discount"
                }
                value={`− ${formatPrice(couponDiscount)}`}
                valueClass="text-emerald-600"
              />
            )}

            <SummaryRow
              label="Delivery"
              value={shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
              valueClass={shippingFee === 0 ? "text-emerald-600" : ""}
            />
          </div>

          <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-700" />

          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Total
            </span>

            <span className="text-xl font-bold text-slate-950 dark:text-white">
              {formatPrice(finalTotal)}
            </span>
          </div>

          {couponDiscount > 0 && (
            <p className="mt-2 text-right text-xs font-medium text-emerald-600">
              You save {formatPrice(productDiscount + couponDiscount)} in total
            </p>
          )}

          {orderError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            >
              {orderError}
            </p>
          )}

          {hasUnavailableItem && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
            >
              Remove unavailable products or reduce their quantities before
              placing the order.
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
            By placing your order, you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </aside>
  );
}

/*
|--------------------------------------------------------------------------
| Selected address
|--------------------------------------------------------------------------
*/

function SelectedAddress({ address }) {
  const addressParts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
  ].filter(Boolean);

  return (
    <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Delivering to
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        {address.fullName}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {addressParts.join(", ")}
      </p>

      {address.phone && (
        <p className="mt-1 text-xs text-slate-400">{address.phone}</p>
      )}
    </div>
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

  const unavailable =
    !item.isActive || !item.inStock || item.availableStock < item.quantity;

  return (
    <div className="flex gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.name}
          loading="lazy"
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

        {unavailable && (
          <p className="mt-1 text-xs font-medium text-red-500">
            Unavailable or insufficient stock
          </p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {formatPrice(item.price * item.quantity)}
        </p>

        {item.originalPrice > item.price && (
          <p className="mt-1 text-xs text-slate-400 line-through">
            {formatPrice(item.originalPrice * item.quantity)}
          </p>
        )}
      </div>
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
| Loading
|--------------------------------------------------------------------------
*/

function CheckoutLoading() {
  return (
    <div
      role="status"
      className="flex min-h-80 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
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
| Empty checkout
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
