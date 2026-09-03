import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Download,
  IndianRupee,
  LoaderCircle,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
} from "lucide-react";

import { useState } from "react";

import { Link } from "react-router-dom";

import useAdminAnalytics, {
  ANALYTICS_RANGES,
} from "../../../hooks/useAdminAnalytics";

/*
|--------------------------------------------------------------------------
| Formatting
|--------------------------------------------------------------------------
*/

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatCompactPrice(value) {
  const amount = Number(value) || 0;

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}K`;
  }

  return `₹${Math.round(amount)}`;
}

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString("en-IN");
}

function formatPercentage(value) {
  return `${(Number(value) || 0).toFixed(1)}%`;
}

/*
|--------------------------------------------------------------------------
| CSV export
|--------------------------------------------------------------------------
*/

function escapeCsvValue(value) {
  let safeValue = String(value ?? "");

  /*
   * Prevent spreadsheet formula
   * execution from user-controlled
   * product/category names.
   */
  if (/^[=+\-@]/.test(safeValue)) {
    safeValue = `'${safeValue}`;
  }

  return `"${safeValue.replace(/"/g, '""')}"`;
}

function downloadAnalyticsCsv({
  statistics,
  categories,
  topProducts,
  metrics,
  range,
}) {
  const rows = [
    ["Report", "CogniMart Analytics"],
    ["Date range", range],
    [],
    ["Summary", "Value"],
    ["Total revenue", statistics.totalRevenue],
    ["Total orders", statistics.totalOrders],
    ["Registered customers", statistics.totalCustomers],
    ["New customers", statistics.newCustomers],
    ["Average order value", statistics.averageOrderValue],
    [],
    ["Operational metric", "Percentage"],
    ["Fulfillment rate", metrics.fulfillmentRate],
    ["Cancellation rate", metrics.cancellationRate],
    ["Repeat purchase rate", metrics.repeatPurchaseRate],
    [],
    ["Category", "Revenue", "Units", "Revenue share"],
    ...categories.map((category) => [
      category.name,
      category.revenue,
      category.units,
      category.percentage,
    ]),
    [],
    ["Product", "Category", "Units sold", "Revenue"],
    ...topProducts.map((product) => [
      product.name,
      product.category,
      product.units,
      product.revenue,
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `cognimart-analytics-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);

  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function AdminAnalytics() {
  const [range, setRange] = useState("last_6_months");

  const {
    statistics,
    timeSeries,
    categories,
    topProducts,
    metrics,
    loading,
    error,
    refresh,
  } = useAdminAnalytics(range);

  if (loading) {
    return <AnalyticsLoading />;
  }

  if (error) {
    return <AnalyticsError message={error} onRetry={refresh} />;
  }

  const selectedRange = ANALYTICS_RANGES.find(
    (option) => option.value === range,
  );

  const handleExport = () => {
    downloadAnalyticsCsv({
      statistics,
      categories,
      topProducts,
      metrics,
      range: selectedRange?.label || range,
    });
  };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <AnalyticsHeader
          range={range}
          onRangeChange={setRange}
          onRefresh={refresh}
          onExport={handleExport}
        />

        <AnalyticsStatistics statistics={statistics} />

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
          <RevenueChart data={timeSeries} />

          <CustomerChart
            data={timeSeries}
            totalCustomers={statistics.totalCustomers}
            newCustomers={statistics.newCustomers}
          />
        </div>

        <CategoryPerformance categories={categories} />

        <TopProducts products={topProducts} />

        <OperationalMetrics metrics={metrics} />
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function AnalyticsHeader({ range, onRangeChange, onRefresh, onExport }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          Business intelligence
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Understand real store, sales and customer performance.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative">
          <CalendarDays
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={range}
            onChange={(event) => onRangeChange(event.target.value)}
            aria-label="Analytics date range"
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 sm:w-[165px] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            {ANALYTICS_RANGES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <RefreshCw size={14} />
          Refresh
        </button>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| KPI cards
|--------------------------------------------------------------------------
*/

function AnalyticsStatistics({ statistics }) {
  return (
    <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsStat
        icon={IndianRupee}
        label="Total revenue"
        value={formatPrice(statistics.totalRevenue)}
        growth={statistics.revenueGrowth}
        description="Compared with previous period"
      />

      <AnalyticsStat
        icon={ShoppingCart}
        label="Total orders"
        value={formatNumber(statistics.totalOrders)}
        growth={statistics.orderGrowth}
        description="Compared with previous period"
      />

      <AnalyticsStat
        icon={Users}
        label="Registered customers"
        value={formatNumber(statistics.totalCustomers)}
        growth={statistics.customerGrowth}
        description={`${formatNumber(
          statistics.newCustomers,
        )} new in selected period`}
      />

      <AnalyticsStat
        icon={BarChart3}
        label="Average order value"
        value={formatPrice(statistics.averageOrderValue)}
        description="Paid and delivered orders"
      />
    </section>
  );
}

function AnalyticsStat({ icon: Icon, label, value, growth, description }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <Icon size={16} />
        </div>

        {growth !== undefined && <GrowthBadge value={growth} />}
      </div>

      <p className="mt-4 text-[11px] font-medium text-slate-400">{label}</p>

      <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">{description}</p>
    </article>
  );
}

function GrowthBadge({ value }) {
  if (value === null) {
    return (
      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        New
      </span>
    );
  }

  const numericValue = Number(value) || 0;

  const positive = numericValue > 0;

  const negative = numericValue < 0;

  const Icon = negative ? ArrowDownRight : ArrowUpRight;

  const style = positive
    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
    : negative
      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-bold ${style}`}
    >
      <Icon size={11} />
      {positive ? "+" : ""}
      {numericValue.toFixed(1)}%
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Revenue chart
|--------------------------------------------------------------------------
*/

function RevenueChart({ data }) {
  const maximumRevenue = Math.max(
    ...data.map((item) => Number(item.revenue) || 0),
    1,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Revenue overview
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Paid and delivered revenue by month
        </p>
      </div>

      <div className="mt-7 flex h-[280px] gap-3">
        <div className="flex w-14 flex-col justify-between pb-8 text-right">
          {[1, 0.75, 0.5, 0.25, 0].map((level) => (
            <span key={level} className="text-[9px] text-slate-400">
              {formatCompactPrice(maximumRevenue * level)}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="absolute inset-x-0 bottom-8 top-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((line) => (
              <div
                key={line}
                className="border-t border-dashed border-slate-100 dark:border-slate-800"
              />
            ))}
          </div>

          <div className="absolute inset-0 bottom-8 flex items-end justify-between gap-2 px-1">
            {data.map((item) => {
              const revenue = Number(item.revenue) || 0;

              const height =
                revenue > 0 ? Math.max((revenue / maximumRevenue) * 100, 3) : 0;

              return <ChartBar key={item.key} item={item} height={height} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChartBar({ item, height }) {
  return (
    <div className="group flex h-full flex-1 flex-col items-center justify-end">
      <div className="relative flex h-full w-full items-end justify-center">
        <div
          className="relative w-full max-w-10 rounded-t-lg bg-emerald-500 transition-colors group-hover:bg-emerald-600"
          style={{
            height: `${height}%`,
          }}
        >
          <div className="pointer-events-none absolute -top-12 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[9px] font-semibold text-white group-hover:block dark:bg-white dark:text-slate-900">
            <p>{formatPrice(item.revenue)}</p>

            <p className="opacity-70">{item.orders} orders</p>
          </div>
        </div>
      </div>

      <span className="mt-2 text-[9px] font-medium text-slate-400">
        {item.label}
      </span>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Customer chart
|--------------------------------------------------------------------------
*/

function CustomerChart({ data, totalCustomers, newCustomers }) {
  const maximumCustomers = Math.max(
    ...data.map((item) => Number(item.customers) || 0),
    1,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Customer growth
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            New customer registrations
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <Users size={15} />
        </div>
      </div>

      <p className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">
        {formatNumber(totalCustomers)}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        {formatNumber(newCustomers)} new in selected period
      </p>

      <div className="mt-7 flex h-[190px] items-end gap-2">
        {data.map((item) => {
          const customers = Number(item.customers) || 0;

          const height =
            customers > 0
              ? Math.max((customers / maximumCustomers) * 100, 4)
              : 0;

          return (
            <div
              key={item.key}
              className="group flex h-full flex-1 flex-col items-center justify-end"
            >
              <div
                title={`${customers} new customers`}
                className="w-full max-w-8 rounded-t-lg bg-slate-200 transition-colors group-hover:bg-emerald-500 dark:bg-slate-700"
                style={{
                  height: `${height}%`,
                }}
              />

              <span className="mt-2 text-[9px] text-slate-400">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Category performance
|--------------------------------------------------------------------------
*/

function CategoryPerformance({ categories }) {
  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Revenue by category
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Categories driving delivered sales
          </p>
        </div>

        <Package size={17} className="text-slate-400" />
      </div>

      {categories.length > 0 ? (
        <div className="mt-6 space-y-5">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {category.name}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {formatNumber(category.units)} units sold
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatPrice(category.revenue)}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {category.percentage}%
                  </p>
                </div>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(category.percentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnalyticsEmpty message="Category revenue will appear after orders are delivered." />
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Top products
|--------------------------------------------------------------------------
*/

function TopProducts({ products }) {
  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Top-selling products
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Ranked by delivered revenue
          </p>
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Top 5
        </span>
      </div>

      {products.length > 0 ? (
        <>
          <TopProductsTable products={products} />

          <TopProductsMobile products={products} />
        </>
      ) : (
        <AnalyticsEmpty message="Product rankings will appear after orders are delivered." />
      )}
    </section>
  );
}

function TopProductsTable({ products }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
            <TableHeader>Product</TableHeader>

            <TableHeader>Category</TableHeader>

            <TableHeader>Units sold</TableHeader>

            <TableHeader>Revenue</TableHeader>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id || product.name}
              className="border-b border-slate-100 last:border-0 dark:border-slate-800/80"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {index + 1}
                  </div>

                  {product.id ? (
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="text-xs font-semibold text-slate-800 hover:text-emerald-600 dark:text-slate-200"
                    >
                      {product.name}
                    </Link>
                  ) : (
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {product.name}
                    </span>
                  )}
                </div>
              </td>

              <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                {product.category}
              </td>

              <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {formatNumber(product.units)}
              </td>

              <td className="px-5 py-4 text-xs font-bold text-slate-900 dark:text-white">
                {formatPrice(product.revenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TopProductsMobile({ products }) {
  return (
    <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
      {products.map((product, index) => (
        <div
          key={product.id || product.name}
          className="flex items-center gap-3 p-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {product.name}
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              {product.category} · {formatNumber(product.units)} units
            </p>
          </div>

          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {formatPrice(product.revenue)}
          </p>
        </div>
      ))}
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {children}
    </th>
  );
}

/*
|--------------------------------------------------------------------------
| Operational metrics
|--------------------------------------------------------------------------
*/

function OperationalMetrics({ metrics }) {
  return (
    <section className="mt-5 grid gap-5 lg:grid-cols-3">
      <MetricCard
        title="Fulfillment rate"
        value={formatPercentage(metrics.fulfillmentRate)}
        description="Percentage of selected-period orders marked as delivered."
        tone="success"
      />

      <MetricCard
        title="Cancellation rate"
        value={formatPercentage(metrics.cancellationRate)}
        description="Percentage of selected-period orders that were cancelled."
        tone="danger"
      />

      <MetricCard
        title="Repeat purchase rate"
        value={formatPercentage(metrics.repeatPurchaseRate)}
        description="Customers with more than one paid and delivered order."
        tone="info"
      />
    </section>
  );
}

function MetricCard({ title, value, description, tone }) {
  const styles = {
    success: "text-emerald-600 dark:text-emerald-400",

    danger: "text-red-600 dark:text-red-400",

    info: "text-blue-600 dark:text-blue-400",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p
        className={`mt-4 text-2xl font-bold ${
          styles[tone] || "text-slate-950 dark:text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
        {description}
      </p>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Shared states
|--------------------------------------------------------------------------
*/

function AnalyticsEmpty({ message }) {
  return (
    <div className="px-6 py-12 text-center">
      <BarChart3
        size={26}
        className="mx-auto text-slate-300 dark:text-slate-700"
      />

      <p className="mt-3 text-xs text-slate-400">{message}</p>
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <main
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950"
      role="status"
    >
      <div className="text-center">
        <LoaderCircle
          size={30}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Loading analytics...
        </p>
      </div>
    </main>
  );
}

function AnalyticsError({ message, onRetry }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <AlertCircle size={34} className="mx-auto text-red-500" />

        <h1 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
          Unable to load analytics
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    </main>
  );
}
