
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Download,
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const revenueData = [
  { month: "Jan", revenue: 148000, orders: 182 },
  { month: "Feb", revenue: 171000, orders: 204 },
  { month: "Mar", revenue: 163000, orders: 198 },
  { month: "Apr", revenue: 196000, orders: 231 },
  { month: "May", revenue: 224000, orders: 268 },
  { month: "Jun", revenue: 247000, orders: 291 },
  { month: "Jul", revenue: 281000, orders: 326 },
  { month: "Aug", revenue: 314000, orders: 359 },
];

const categoryData = [
  { name: "Electronics", revenue: 132000, percentage: 42, products: 184 },
  { name: "Fashion", revenue: 76000, percentage: 24, products: 326 },
  { name: "Home & Living", revenue: 51000, percentage: 16, products: 218 },
  { name: "Gaming", revenue: 38000, percentage: 12, products: 96 },
  { name: "Accessories", revenue: 19000, percentage: 6, products: 142 },
];

const topProducts = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    units: 384,
    revenue: 768000,
    growth: 18.4,
  },
  {
    name: "Mechanical Gaming Keyboard",
    category: "Gaming",
    units: 291,
    revenue: 582000,
    growth: 14.8,
  },
  {
    name: "Smart Watch Pro",
    category: "Electronics",
    units: 247,
    revenue: 494000,
    growth: 11.6,
  },
  {
    name: "Premium Backpack",
    category: "Fashion",
    units: 213,
    revenue: 319500,
    growth: 8.9,
  },
  {
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    units: 188,
    revenue: 282000,
    growth: 7.4,
  },
];

const customerData = [
  { month: "Jan", customers: 420 },
  { month: "Feb", customers: 468 },
  { month: "Mar", customers: 503 },
  { month: "Apr", customers: 571 },
  { month: "May", customers: 642 },
  { month: "Jun", customers: 719 },
  { month: "Jul", customers: 814 },
  { month: "Aug", customers: 927 },
];

const dateRanges = [
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
  "This year",
];

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("Last 6 months");

  const totalRevenue = useMemo(() => {
    return revenueData.reduce(
      (total, item) => total + item.revenue,
      0,
    );
  }, []);

  const totalOrders = useMemo(() => {
    return revenueData.reduce(
      (total, item) => total + item.orders,
      0,
    );
  }, []);

  const latestMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];

  const revenueGrowth =
    ((latestMonth.revenue - previousMonth.revenue) /
      previousMonth.revenue) *
    100;

  const orderGrowth =
    ((latestMonth.orders - previousMonth.orders) /
      previousMonth.orders) *
    100;

  const totalCustomers =
    customerData[customerData.length - 1].customers;

  const previousCustomers =
    customerData[customerData.length - 2].customers;

  const customerGrowth =
    ((totalCustomers - previousCustomers) /
      previousCustomers) *
    100;

  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const maxRevenue = Math.max(
    ...revenueData.map((item) => item.revenue),
  );

  const maxCustomers = Math.max(
    ...customerData.map((item) => item.customers),
  );

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

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-emerald-600
                dark:text-emerald-400
              "
            >
              Business intelligence
            </p>

            <h1
              className="
                mt-1
                text-2xl
                font-bold
                tracking-tight
                text-slate-950
                dark:text-white
              "
            >
              Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Understand your store performance and customer growth.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <CalendarDays
                size={15}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <select
                value={dateRange}
                onChange={(event) =>
                  setDateRange(event.target.value)
                }
                className="
                  h-10
                  w-full
                  appearance-none
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  pl-9
                  pr-9
                  text-xs
                  font-semibold
                  text-slate-700
                  outline-none
                  focus:border-emerald-500
                  sm:w-[165px]
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-300
                "
              >
                {dateRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-xs
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-50
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* KPI CARDS */}

        <div
          className="
            mt-6
            grid
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <AnalyticsStat
            icon={IndianRupee}
            label="Total revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            change={`+${revenueGrowth.toFixed(1)}%`}
            description="vs previous month"
          />

          <AnalyticsStat
            icon={ShoppingCart}
            label="Total orders"
            value={totalOrders.toLocaleString("en-IN")}
            change={`+${orderGrowth.toFixed(1)}%`}
            description="vs previous month"
          />

          <AnalyticsStat
            icon={Users}
            label="Customers"
            value={totalCustomers.toLocaleString("en-IN")}
            change={`+${customerGrowth.toFixed(1)}%`}
            description="monthly growth"
          />

          <AnalyticsStat
            icon={BarChart3}
            label="Average order value"
            value={`₹${Math.round(
              averageOrderValue,
            ).toLocaleString("en-IN")}`}
            change="+6.8%"
            description="vs previous month"
          />
        </div>

        {/* REVENUE + CUSTOMER CHARTS */}

        <div
          className="
            mt-5
            grid
            gap-5
            xl:grid-cols-[1.65fr_1fr]
          "
        >
          {/* REVENUE */}

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
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Revenue overview
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Monthly revenue performance
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Revenue
                </span>
              </div>
            </div>

            <div className="mt-7 flex h-[280px] gap-3">
              <div className="flex w-12 flex-col justify-between pb-8 text-right">
                {[300, 225, 150, 75, 0].map((value) => (
                  <span
                    key={value}
                    className="text-[9px] text-slate-400"
                  >
                    {value === 0 ? "0" : `₹${value}k`}
                  </span>
                ))}
              </div>

              <div className="relative min-w-0 flex-1">
                <div className="absolute inset-x-0 bottom-8 top-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div
                      key={line}
                      className="
                        border-t
                        border-dashed
                        border-slate-100
                        dark:border-slate-800
                      "
                    />
                  ))}
                </div>

                <div className="absolute inset-0 bottom-8 flex items-end justify-between gap-2 px-1">
                  {revenueData.map((item) => {
                    const height =
                      (item.revenue / maxRevenue) * 100;

                    return (
                      <div
                        key={item.month}
                        className="
                          group
                          flex
                          h-full
                          flex-1
                          flex-col
                          items-center
                          justify-end
                        "
                      >
                        <div className="relative flex h-full w-full items-end justify-center">
                          <div
                            className="
                              relative
                              w-full
                              max-w-8
                              rounded-t-lg
                              bg-emerald-500
                              transition-all
                              duration-300
                              group-hover:bg-emerald-600
                            "
                            style={{
                              height: `${height}%`,
                            }}
                          >
                            <div
                              className="
                                absolute
                                -top-9
                                left-1/2
                                hidden
                                -translate-x-1/2
                                whitespace-nowrap
                                rounded-lg
                                bg-slate-900
                                px-2
                                py-1
                                text-[9px]
                                font-semibold
                                text-white
                                group-hover:block
                              "
                            >
                              ₹{Math.round(item.revenue / 1000)}k
                            </div>
                          </div>
                        </div>

                        <span className="mt-2 text-[9px] font-medium text-slate-400">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* CUSTOMER GROWTH */}

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
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Customer growth
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Monthly customer growth
                </p>
              </div>

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  dark:bg-emerald-950/40
                  dark:text-emerald-400
                "
              >
                <Users size={15} />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-2xl font-bold text-slate-950 dark:text-white">
                {totalCustomers.toLocaleString("en-IN")}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <ArrowUpRight
                  size={13}
                  className="text-emerald-500"
                />

                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {customerGrowth.toFixed(1)}%
                </span>

                <span className="text-[11px] text-slate-400">
                  this month
                </span>
              </div>
            </div>

            <div className="mt-7 flex h-[190px] items-end gap-2">
              {customerData.map((item) => {
                const height =
                  (item.customers / maxCustomers) * 100;

                return (
                  <div
                    key={item.month}
                    className="group flex h-full flex-1 flex-col items-center justify-end"
                  >
                    <div
                      className="
                        w-full
                        max-w-7
                        rounded-t-lg
                        bg-slate-200
                        transition-all
                        group-hover:bg-emerald-400
                        dark:bg-slate-700
                        dark:group-hover:bg-emerald-600
                      "
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <span className="mt-2 text-[9px] text-slate-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* CATEGORY PERFORMANCE */}

        <section
          className="
            mt-5
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
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue by category
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Which categories are driving your sales
              </p>
            </div>

            <Package size={17} className="text-slate-400" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div
                  className="
                    flex
                    h-48
                    w-48
                    items-center
                    justify-center
                    rounded-full
                    bg-[conic-gradient(#10b981_0_42%,#64748b_42%_66%,#94a3b8_66%_82%,#cbd5e1_82%_94%,#e2e8f0_94%_100%)]
                    dark:bg-[conic-gradient(#10b981_0_42%,#64748b_42%_66%,#94a3b8_66%_82%,#475569_82%_94%,#334155_94%_100%)]
                  "
                >
                  <div
                    className="
                      flex
                      h-28
                      w-28
                      flex-col
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      dark:bg-slate-900
                    "
                  >
                    <span className="text-xl font-bold text-slate-950 dark:text-white">
                      100%
                    </span>

                    <span className="text-[10px] text-slate-400">
                      Revenue
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          ${
                            index === 0
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }
                        `}
                      />

                      <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {category.name}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        ₹{category.revenue.toLocaleString("en-IN")}
                      </span>

                      <span className="w-8 text-right text-[10px] font-semibold text-slate-400">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`
                        h-full
                        rounded-full
                        ${
                          index === 0
                            ? "bg-emerald-500"
                            : "bg-slate-400 dark:bg-slate-600"
                        }
                      `}
                      style={{
                        width: `${category.percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {category.products} products
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TOP PRODUCTS */}

        <section
          className="
            mt-5
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
                Top-selling products
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Best performing products by revenue
              </p>
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Top 5
            </span>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr
                  className="
                    border-b
                    border-slate-200
                    bg-slate-50/70
                    dark:border-slate-800
                    dark:bg-slate-950/40
                  "
                >
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Units sold</TableHeader>
                  <TableHeader>Revenue</TableHeader>
                  <TableHeader>Growth</TableHeader>
                </tr>
              </thead>

              <tbody>
                {topProducts.map((product, index) => (
                  <tr
                    key={product.name}
                    className="
                      border-b
                      border-slate-100
                      last:border-0
                      dark:border-slate-800/80
                    "
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-slate-100
                            text-xs
                            font-bold
                            text-slate-500
                            dark:bg-slate-800
                            dark:text-slate-400
                          "
                        >
                          {index + 1}
                        </div>

                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {product.units.toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-xs font-bold text-slate-900 dark:text-white">
                      ₹{product.revenue.toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <ArrowUpRight size={13} />
                        {product.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}

          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-3 p-4"
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                    text-xs
                    font-bold
                    text-slate-500
                    dark:bg-slate-800
                    dark:text-slate-400
                  "
                >
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {product.name}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {product.category} · {product.units} units
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    ₹{product.revenue.toLocaleString("en-IN")}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-emerald-600">
                    +{product.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PERFORMANCE METRICS */}

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <MetricCard
            title="Conversion rate"
            value="4.82%"
            change="+0.64%"
            description="More visitors are completing purchases."
          />

          <MetricCard
            title="Cart abandonment"
            value="21.4%"
            change="-3.2%"
            description="Checkout completion improved this month."
          />

          <MetricCard
            title="Repeat purchase rate"
            value="38.7%"
            change="+5.8%"
            description="Customers are returning more frequently."
          />
        </div>
      </div>
    </main>
  );
}

function AnalyticsStat({
  icon: Icon,
  label,
  value,
  change,
  description,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="flex items-start justify-between">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-emerald-50
            text-emerald-600
            dark:bg-emerald-950/40
            dark:text-emerald-400
          "
        >
          <Icon size={16} />
        </div>

        <span
          className="
            inline-flex
            items-center
            gap-0.5
            rounded-full
            bg-emerald-50
            px-2
            py-1
            text-[10px]
            font-bold
            text-emerald-600
            dark:bg-emerald-950/40
            dark:text-emerald-400
          "
        >
          <ArrowUpRight size={11} />
          {change}
        </span>
      </div>

      <p className="mt-4 text-[11px] font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        {description}
      </p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  description,
}) {
  const isPositive = change.startsWith("+");

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
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <span
          className={`
            inline-flex
            items-center
            gap-0.5
            rounded-full
            px-2
            py-1
            text-[10px]
            font-bold
            ${
              isPositive
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
            }
          `}
        >
          {isPositive ? (
            <ArrowUpRight size={11} />
          ) : (
            <ArrowDownRight size={11} />
          )}

          {change}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <th
      className="
        px-5
        py-3.5
        text-left
        text-[10px]
        font-bold
        uppercase
        tracking-wider
        text-slate-400
      "
    >
      {children}
    </th>
  );
}

