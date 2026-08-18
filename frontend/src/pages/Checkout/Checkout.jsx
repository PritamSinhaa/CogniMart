import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  ShieldCheck,
  Smartphone,
  Truck,
  WalletCards,
} from "lucide-react";

const cartItems = [
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
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Checkout() {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [deliveryMethod, setDeliveryMethod] =
    useState("standard");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const discount = 2000;

  const deliveryCharge =
    deliveryMethod === "express" ? 149 : 0;

  const total =
    subtotal - discount + deliveryCharge;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // UI only for now.
    // Later this will call the order/payment API.
    navigate("/order-success");
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-6">
          <Link
            to="/cart"
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
              Complete your delivery and payment details.
            </p>
          </div>
        </div>

        {/* =====================================================
            CHECKOUT CONTENT
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 lg:grid-cols-[1fr_340px]"
        >
          {/* ===================================================
              LEFT COLUMN
          =================================================== */}

          <div className="space-y-4">

            {/* =================================================
                DELIVERY ADDRESS
            ================================================== */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <SectionHeader
                icon={MapPin}
                title="Delivery address"
                description="Where should we deliver your order?"
              />

              <div className="grid gap-4 p-4 sm:grid-cols-2">

                <Input
                  label="Full name"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />

                <Input
                  label="Phone number"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  type="tel"
                  required
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    name="address"
                    value={address.address}
                    onChange={handleChange}
                    placeholder="House no., street, area"
                    required
                  />
                </div>

                <Input
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />

                <Input
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  inputMode="numeric"
                  required
                />
              </div>
            </section>

            {/* =================================================
                DELIVERY METHOD
            ================================================== */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <SectionHeader
                icon={Truck}
                title="Delivery method"
                description="Choose your preferred delivery option."
              />

              <div className="space-y-3 p-4">

                <DeliveryOption
                  selected={
                    deliveryMethod === "standard"
                  }
                  onClick={() =>
                    setDeliveryMethod("standard")
                  }
                  title="Standard delivery"
                  description="3–5 business days"
                  price="FREE"
                />

                <DeliveryOption
                  selected={
                    deliveryMethod === "express"
                  }
                  onClick={() =>
                    setDeliveryMethod("express")
                  }
                  title="Express delivery"
                  description="1–2 business days"
                  price="₹149"
                />

              </div>
            </section>

            {/* =================================================
                PAYMENT METHOD
            ================================================== */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <SectionHeader
                icon={WalletCards}
                title="Payment method"
                description="Choose how you want to pay."
              />

              <div className="grid gap-3 p-4 sm:grid-cols-3">

                <PaymentOption
                  selected={paymentMethod === "upi"}
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                  icon={Smartphone}
                  title="UPI"
                  description="GPay, PhonePe"
                />

                <PaymentOption
                  selected={paymentMethod === "card"}
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  icon={CreditCard}
                  title="Card"
                  description="Credit / Debit"
                />

                <PaymentOption
                  selected={paymentMethod === "cod"}
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  icon={WalletCards}
                  title="Cash on delivery"
                  description="Pay at doorstep"
                />

              </div>

              {/* Card details */}

              {paymentMethod === "card" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  className="grid gap-4 px-4 pb-4 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <Input
                      label="Card number"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                    />
                  </div>

                  <Input
                    label="Expiry date"
                    name="expiry"
                    placeholder="MM / YY"
                  />

                  <Input
                    label="CVV"
                    name="cvv"
                    placeholder="•••"
                    type="password"
                  />
                </motion.div>
              )}
            </section>

            {/* =================================================
                SECURITY NOTICE
            ================================================== */}

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
                  Your payment and personal information are
                  protected with industry-standard security.
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              RIGHT COLUMN — ORDER SUMMARY
          =================================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              {/* Summary Header */}

              <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Order summary
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {cartItems.length} items
                </p>
              </div>

              {/* =================================================
                  CART ITEMS
              ================================================== */}

              <div className="space-y-3 p-4">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >
                    {/* Image */}

                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    {/* Details */}

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.variant}
                      </p>
                    </div>

                    {/* Price */}

                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {formatPrice(
                        item.price * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* =================================================
                  TOTALS
              ================================================== */}

              <div className="border-t border-slate-200 p-4 dark:border-slate-800">

                <div className="space-y-3 text-sm">

                  <SummaryRow
                    label="Subtotal"
                    value={formatPrice(subtotal)}
                  />

                  <SummaryRow
                    label="Discount"
                    value={`− ${formatPrice(discount)}`}
                    valueClass="text-emerald-600"
                  />

                  <SummaryRow
                    label="Delivery"
                    value={
                      deliveryCharge === 0
                        ? "FREE"
                        : formatPrice(deliveryCharge)
                    }
                    valueClass={
                      deliveryCharge === 0
                        ? "text-emerald-600"
                        : ""
                    }
                  />
                </div>

                <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-700" />

                {/* Total */}

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Total
                  </span>

                  <span className="text-xl font-bold text-slate-950 dark:text-white">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Place order */}

                <button
                  type="submit"
                  className="
                    group
                    mt-4
                    flex
                    h-11
                    w-full
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
                    active:scale-[0.99]
                  "
                >
                  Place order

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>

                <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">
                  By placing your order, you agree to our
                  terms and conditions.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
        <Icon size={18} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  inputMode,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        className="
          h-10
          w-full
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3
          text-sm
          text-slate-900
          outline-none
          transition-all
          placeholder:text-slate-400
          hover:border-slate-300
          focus:border-emerald-500
          focus:ring-4
          focus:ring-emerald-500/10
          dark:border-slate-700
          dark:bg-slate-950
          dark:text-white
          dark:hover:border-slate-600
        "
      />
    </div>
  );
}

/* ============================================================
   DELIVERY OPTION
============================================================ */

function DeliveryOption({
  selected,
  onClick,
  title,
  description,
  price,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-lg
        border
        p-3
        text-left
        transition-all
        ${
          selected
            ? "border-emerald-500 bg-emerald-50/60 dark:border-emerald-500 dark:bg-emerald-500/5"
            : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
        }
      `}
    >
      {/* Radio */}

      <div
        className={`
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${
            selected
              ? "border-emerald-600 bg-emerald-600"
              : "border-slate-300 dark:border-slate-600"
          }
        `}
      >
        {selected && (
          <Check
            size={12}
            strokeWidth={3}
            className="text-white"
          />
        )}
      </div>

      <Truck
        size={18}
        className={
          selected
            ? "text-emerald-600"
            : "text-slate-400"
        }
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {description}
        </p>
      </div>

      <span
        className={`text-sm font-bold ${
          price === "FREE"
            ? "text-emerald-600"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        {price}
      </span>
    </button>
  );
}

/* ============================================================
   PAYMENT OPTION
============================================================ */

function PaymentOption({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        rounded-lg
        border
        p-3
        text-left
        transition-all
        ${
          selected
            ? "border-emerald-500 bg-emerald-50/60 dark:border-emerald-500 dark:bg-emerald-500/5"
            : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
        }
      `}
    >
      {selected && (
        <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check size={11} strokeWidth={3} />
        </div>
      )}

      <Icon
        size={19}
        className={
          selected
            ? "text-emerald-600"
            : "text-slate-400"
        }
      />

      <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        {title}
      </p>

      <p className="mt-0.5 text-xs text-slate-400">
        {description}
      </p>
    </button>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

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