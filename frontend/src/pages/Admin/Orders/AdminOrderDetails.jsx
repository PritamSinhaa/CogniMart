import {
  ArrowLeft,
  Check,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const orderData = {
  "CM-10482": {
    id: "CM-10482",
    date: "18 Aug 2026, 10:42 AM",
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "UPI",
    customer: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
    },
    address: {
      name: "Rahul Sharma",
      line1: "24 Green Park Road",
      line2: "Near City Mall",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110016",
    },
    items: [
      {
        id: 1,
        name: "Sony WH-1000XM5 Wireless Headphones",
        sku: "CM-SONY-XM5",
        image:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
        quantity: 1,
        price: 29999,
      },
      {
        id: 2,
        name: "Logitech MX Master 3S",
        sku: "CM-MXMASTER-3S",
        image:
          "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
        quantity: 1,
        price: 8999,
      },
      {
        id: 3,
        name: "USB-C Fast Charging Cable",
        sku: "CM-USBC-001",
        image:
          "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400",
        quantity: 1,
        price: 499,
      },
    ],
    subtotal: 39497,
    shipping: 0,
    discount: 2000,
    tax: 709,
    total: 38206,
  },

  "CM-10481": {
    id: "CM-10481",
    date: "18 Aug 2026, 09:18 AM",
    status: "Shipped",
    payment: "Paid",
    paymentMethod: "Card",
    customer: {
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 91234 56789",
    },
    address: {
      name: "Priya Patel",
      line1: "18 Sunrise Apartments",
      line2: "Satellite Road",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015",
    },
    items: [
      {
        id: 1,
        name: "Apple AirPods Pro",
        sku: "CM-AIRPODS-PRO",
        image:
          "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
        quantity: 1,
        price: 18999,
      },
      {
        id: 2,
        name: "Apple Magic Keyboard",
        sku: "CM-MAGIC-KEY",
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
        quantity: 1,
        price: 7499,
      },
    ],
    subtotal: 26498,
    shipping: 99,
    discount: 1500,
    tax: 540,
    total: 25637,
  },
};

const defaultOrder = {
  id: "CM-10480",
  date: "17 Aug 2026, 03:25 PM",
  status: "Processing",
  payment: "Paid",
  paymentMethod: "Card",
  customer: {
    name: "Arjun Mehta",
    email: "arjun@example.com",
    phone: "+91 99887 77665",
  },
  address: {
    name: "Arjun Mehta",
    line1: "42 Lake View Street",
    line2: "Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560034",
  },
  items: [
    {
      id: 1,
      name: "ASUS ROG Gaming Laptop",
      sku: "CM-ASUS-ROG-001",
      image:
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      quantity: 1,
      price: 34999,
    },
  ],
  subtotal: 34999,
  shipping: 0,
  discount: 1000,
  tax: 6119,
  total: 40118,
};

const timeline = [
  {
    key: "placed",
    title: "Order placed",
    description: "Customer placed the order.",
    date: "17 Aug 2026, 03:25 PM",
    icon: Package,
  },
  {
    key: "confirmed",
    title: "Order confirmed",
    description: "Payment was successfully confirmed.",
    date: "17 Aug 2026, 03:27 PM",
    icon: Check,
  },
  {
    key: "processing",
    title: "Processing",
    description: "Order is being prepared for shipment.",
    date: "17 Aug 2026, 04:10 PM",
    icon: Clock3,
  },
  {
    key: "shipped",
    title: "Shipped",
    description: "Order has been handed over to the delivery partner.",
    date: "18 Aug 2026, 09:10 AM",
    icon: Truck,
  },
  {
    key: "delivered",
    title: "Delivered",
    description: "Order was delivered successfully.",
    date: "18 Aug 2026, 02:45 PM",
    icon: Check,
  },
];

const statusOrder = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

function getCurrentTimelineIndex(status) {
  switch (status) {
    case "Pending":
      return 0;

    case "Processing":
      return 2;

    case "Shipped":
      return 3;

    case "Delivered":
      return 4;

    default:
      return 0;
  }
}

function getStatusClasses(status) {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";

    case "Shipped":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

    case "Processing":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";

    case "Pending":
      return "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

    case "Cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";

    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

export default function AdminOrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const order = orderData[orderId] || {
    ...defaultOrder,
    id: orderId || defaultOrder.id,
  };

  const currentIndex = getCurrentTimelineIndex(order.status);

  return (
    <main
      className="
        min-h-full
        bg-slate-50
        px-4
        py-5
        sm:px-6
        sm:py-6
        lg:px-8
        lg:py-7
        xl:px-10
        dark:bg-slate-950
      "
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* ======================================================
            TOP HEADER
        ====================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/orders")}
              className="
                mt-0.5
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-500
                shadow-sm
                transition
                hover:border-emerald-200
                hover:bg-emerald-50
                hover:text-emerald-600
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-400
                dark:hover:border-emerald-900
                dark:hover:bg-emerald-950/30
              "
              aria-label="Back to orders"
            >
              <ArrowLeft size={17} />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-950
                    sm:text-[26px]
                    dark:text-white
                  "
                >
                  {order.id}
                </h1>

                <span
                  className={`
                    rounded-full
                    px-2.5
                    py-1
                    text-[11px]
                    font-bold
                    ${getStatusClasses(order.status)}
                  `}
                >
                  {order.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Placed on {order.date}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <CreditCard
              size={15}
              className="text-emerald-600 dark:text-emerald-400"
            />

            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {order.payment}
            </span>

            <span className="text-xs text-slate-400">
              • {order.paymentMethod}
            </span>
          </div>
        </div>

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div
          className="
            mt-6
            grid
            gap-5
            xl:grid-cols-[minmax(0,1fr)_360px]
          "
        >
          {/* ====================================================
              LEFT COLUMN
          ==================================================== */}

          <div className="min-w-0 space-y-5">
            {/* Order items */}

            <section
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-slate-200
                  px-5
                  py-4
                  dark:border-slate-800
                "
              >
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Order items
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "product" : "products"}
                  </p>
                </div>

                <Package size={18} className="text-slate-400" />
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex
                      gap-4
                      px-5
                      py-4
                    "
                  >
                    <div
                      className="
                        h-20
                        w-20
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        dark:border-slate-700
                        dark:bg-slate-800
                      "
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        SKU: {item.sku}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Qty: {item.quantity}
                        </span>

                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-xs text-slate-400">Total</p>

                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Price summary */}

            <section
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
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Payment summary
                </h2>

                <span className="text-xs text-slate-400">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Subtotal
                  </span>

                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    ₹{order.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Shipping
                  </span>

                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {order.shipping === 0
                      ? "Free"
                      : `₹${order.shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Discount
                  </span>

                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    -₹
                    {order.discount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Tax
                  </span>

                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    ₹{order.tax.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-700" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Total
                  </span>

                  <span className="text-xl font-bold text-slate-950 dark:text-white">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>

            {/* Order timeline */}

            <section
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
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Order timeline
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Track the progress of this order.
                </p>
              </div>

              <div className="mt-6">
                {timeline.map((step, index) => {
                  const Icon = step.icon;
                  const completed = index <= currentIndex;
                  const active = index === currentIndex;

                  return (
                    <div key={step.key} className="relative flex gap-4">
                      {/* Connector */}

                      {index < timeline.length - 1 && (
                        <div
                          className={`
                            absolute
                            left-[15px]
                            top-8
                            h-[calc(100%-8px)]
                            w-px
                            ${
                              index < currentIndex
                                ? "bg-emerald-500"
                                : "bg-slate-200 dark:bg-slate-700"
                            }
                          `}
                        />
                      )}

                      {/* Icon */}

                      <div
                        className={`
                          relative
                          z-10
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          ${
                            completed
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900"
                          }
                          ${active ? "ring-4 ring-emerald-500/10" : ""}
                        `}
                      >
                        <Icon size={14} />
                      </div>

                      {/* Content */}

                      <div
                        className={`
                          min-w-0
                          flex-1
                          ${index === timeline.length - 1 ? "pb-0" : "pb-7"}
                        `}
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <h3
                            className={`
                              text-sm
                              font-semibold
                              ${
                                completed
                                  ? "text-slate-900 dark:text-white"
                                  : "text-slate-400"
                              }
                            `}
                          >
                            {step.title}
                          </h3>

                          <span className="text-[11px] text-slate-400">
                            {step.date}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ====================================================
              RIGHT COLUMN
          ==================================================== */}

          <div className="space-y-5">
            {/* Customer */}

            <section
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
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Customer
                </h2>

                <User size={17} className="text-slate-400" />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-50
                    text-sm
                    font-bold
                    text-emerald-700
                    dark:bg-emerald-950/50
                    dark:text-emerald-400
                  "
                >
                  {order.customer.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {order.customer.name}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    {order.customer.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex justify-between gap-3 text-xs">
                  <span className="text-slate-400">Email</span>

                  <span className="truncate text-right font-medium text-slate-600 dark:text-slate-300">
                    {order.customer.email}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-xs">
                  <span className="text-slate-400">Phone</span>

                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {order.customer.phone}
                  </span>
                </div>
              </div>
            </section>

            {/* Shipping address */}

            <section
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
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Shipping address
                </h2>

                <MapPin size={17} className="text-slate-400" />
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {order.address.name}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {order.address.line1}
                  <br />
                  {order.address.line2}
                  <br />
                  {order.address.city}, {order.address.state}
                  <br />
                  {order.address.pincode}
                </p>
              </div>
            </section>

            {/* Payment */}

            <section
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
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Payment
                </h2>

                <CreditCard size={17} className="text-slate-400" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Status</span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {order.payment}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Method</span>

                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Amount</span>

                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>

            {/* Quick actions */}

            <section
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
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Quick actions
              </h2>

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  className="
                    h-10
                    rounded-xl
                    border
                    border-slate-200
                    text-xs
                    font-semibold
                    text-slate-700
                    transition
                    hover:border-emerald-200
                    hover:bg-emerald-50
                    hover:text-emerald-700
                    dark:border-slate-700
                    dark:text-slate-300
                    dark:hover:border-emerald-900
                    dark:hover:bg-emerald-950/30
                    dark:hover:text-emerald-400
                  "
                >
                  Update order status
                </button>

                <button
                  type="button"
                  className="
                    h-10
                    rounded-xl
                    border
                    border-slate-200
                    text-xs
                    font-semibold
                    text-slate-700
                    transition
                    hover:border-emerald-200
                    hover:bg-emerald-50
                    hover:text-emerald-700
                    dark:border-slate-700
                    dark:text-slate-300
                    dark:hover:border-emerald-900
                    dark:hover:bg-emerald-950/30
                    dark:hover:text-emerald-400
                  "
                >
                  Contact customer
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
