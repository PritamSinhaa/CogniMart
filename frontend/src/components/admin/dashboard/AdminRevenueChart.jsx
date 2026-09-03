import { BarChart3, ShoppingBag } from "lucide-react";

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

export default function AdminRevenueChart({ data = [] }) {
  const safeData = Array.isArray(data) ? data : [];

  const totalRevenue = safeData.reduce(
    (total, item) => total + (Number(item.revenue) || 0),
    0,
  );

  const totalOrders = safeData.reduce(
    (total, item) => total + (Number(item.orders) || 0),
    0,
  );

  const maximumRevenue = Math.max(
    ...safeData.map((item) => Number(item.revenue) || 0),
    1,
  );

  const hasRevenue = totalRevenue > 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <RevenueChartHeader
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
      />

      {safeData.length > 0 ? (
        <RevenueChartBody
          data={safeData}
          maximumRevenue={maximumRevenue}
          hasRevenue={hasRevenue}
        />
      ) : (
        <RevenueChartEmpty />
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function RevenueChartHeader({ totalRevenue, totalOrders }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <BarChart3 size={16} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Revenue Overview
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Paid and delivered orders only
            </p>
          </div>
        </div>

        <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          {formatPrice(totalRevenue)}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          Revenue during the last six months
        </p>
      </div>

      <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <ShoppingBag size={16} />
        </div>

        <div>
          <p className="text-lg font-bold text-slate-950 dark:text-white">
            {totalOrders.toLocaleString("en-IN")}
          </p>

          <p className="text-[10px] text-slate-400">Delivered orders</p>
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Chart
|--------------------------------------------------------------------------
*/

function RevenueChartBody({ data, maximumRevenue, hasRevenue }) {
  return (
    <div className="p-4 sm:p-5">
      {!hasRevenue && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          Revenue will appear after an order is paid and marked as delivered.
        </div>
      )}

      <div className="relative h-72">
        <ChartGrid maximumRevenue={maximumRevenue} />

        <ChartBars data={data} maximumRevenue={maximumRevenue} />

        <ChartLabels data={data} />
      </div>
    </div>
  );
}

function ChartGrid({ maximumRevenue }) {
  const levels = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
      {levels.map((level) => (
        <div key={level} className="flex items-center gap-3">
          <span className="w-12 text-right text-[10px] text-slate-400">
            {formatCompactPrice(maximumRevenue * level)}
          </span>

          <div className="h-px flex-1 border-t border-dashed border-slate-200 dark:border-slate-800" />
        </div>
      ))}
    </div>
  );
}

function ChartBars({ data, maximumRevenue }) {
  return (
    <div className="absolute inset-0 flex items-end gap-2 pb-8 pl-16 pr-1 sm:gap-4">
      {data.map((item) => {
        const revenue = Number(item.revenue) || 0;

        const height =
          revenue > 0 ? Math.max((revenue / maximumRevenue) * 100, 3) : 0;

        return (
          <div
            key={item.key || `${item.year}-${item.month}`}
            className="group flex h-full min-w-0 flex-1 flex-col justify-end"
          >
            <div className="relative flex h-full items-end">
              <ChartTooltip item={item} />

              <div
                role="img"
                aria-label={`${item.label}: ${formatPrice(revenue)} from ${
                  item.orders || 0
                } delivered orders`}
                className="w-full rounded-t-md bg-emerald-500/80 transition-all duration-300 group-hover:bg-emerald-600 dark:bg-emerald-500/70 dark:group-hover:bg-emerald-500"
                style={{
                  height: `${height}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChartTooltip({ item }) {
  return (
    <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-slate-950">
      <p>{formatPrice(item.revenue)}</p>

      <p className="mt-0.5 opacity-70">
        {item.orders || 0} {item.orders === 1 ? "order" : "orders"}
      </p>
    </div>
  );
}

function ChartLabels({ data }) {
  return (
    <div className="absolute bottom-0 left-16 right-1 flex gap-2 sm:gap-4">
      {data.map((item) => (
        <span
          key={item.key || `${item.year}-${item.month}`}
          className="min-w-0 flex-1 text-center text-[10px] text-slate-400"
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty
|--------------------------------------------------------------------------
*/

function RevenueChartEmpty() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <BarChart3 size={21} />
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">
        Revenue data unavailable
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Dashboard revenue will appear when orders are delivered.
      </p>
    </div>
  );
}
