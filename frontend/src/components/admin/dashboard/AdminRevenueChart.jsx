import {
  BarChart3,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

const monthlyData = [
  { month: "Jan", revenue: 72000, orders: 182 },
  { month: "Feb", revenue: 84000, orders: 214 },
  { month: "Mar", revenue: 79000, orders: 198 },
  { month: "Apr", revenue: 96000, orders: 245 },
  { month: "May", revenue: 112000, orders: 286 },
  { month: "Jun", revenue: 128000, orders: 323 },
  { month: "Jul", revenue: 118000, orders: 301 },
  { month: "Aug", revenue: 142000, orders: 356 },
  { month: "Sep", revenue: 136000, orders: 342 },
  { month: "Oct", revenue: 154000, orders: 389 },
  { month: "Nov", revenue: 168000, orders: 421 },
  { month: "Dec", revenue: 184000, orders: 468 },
];

const maxRevenue = Math.max(
  ...monthlyData.map((item) => item.revenue),
);

const formatRevenue = (value) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  return `₹${Math.round(value / 1000)}K`;
};

export default function AdminRevenueChart() {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          border-slate-100
          p-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-5
          dark:border-slate-800
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-emerald-50
                text-emerald-600
                dark:bg-emerald-950/40
                dark:text-emerald-400
              "
            >
              <BarChart3 size={16} />
            </div>

            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Revenue Overview
            </h2>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              ₹12.84L
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1
                text-xs
                font-semibold
                text-emerald-600
                dark:text-emerald-400
              "
            >
              <TrendingUp size={13} />
              12.8%
            </span>
          </div>

          <p className="mt-0.5 text-[11px] text-slate-400">
            Total revenue this year
          </p>
        </div>

        {/* Period selector */}

        <button
          type="button"
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            py-2
            text-xs
            font-medium
            text-slate-600
            transition-colors
            hover:border-slate-300
            hover:bg-slate-50
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-300
            dark:hover:bg-slate-800
          "
        >
          This year
          <ChevronDown size={14} />
        </button>
      </div>

      {/* ============================================================
          CHART
      ============================================================ */}

      <div className="p-4 sm:p-5">
        <div className="relative h-72">
          {/* Grid */}

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
            {[4, 3, 2, 1, 0].map((line) => (
              <div
                key={line}
                className="flex items-center gap-3"
              >
                <span className="w-10 text-right text-[10px] text-slate-400">
                  {formatRevenue(
                    maxRevenue * (line / 4),
                  )}
                </span>

                <div className="h-px flex-1 border-t border-dashed border-slate-200 dark:border-slate-800" />
              </div>
            ))}
          </div>

          {/* Bars */}

          <div
            className="
              absolute
              inset-0
              flex
              items-end
              gap-1
              pl-14
              pr-1
              pb-8
              sm:gap-2
            "
          >
            {monthlyData.map((item) => {
              const height =
                (item.revenue / maxRevenue) * 100;

              return (
                <div
                  key={item.month}
                  className="
                    group
                    flex
                    h-full
                    min-w-0
                    flex-1
                    flex-col
                    justify-end
                  "
                >
                  <div className="relative flex h-full items-end">
                    {/* Tooltip */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        bottom-[calc(100%+8px)]
                        left-1/2
                        z-10
                        -translate-x-1/2
                        whitespace-nowrap
                        rounded-lg
                        bg-slate-950
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-medium
                        text-white
                        opacity-0
                        shadow-lg
                        transition-opacity
                        group-hover:opacity-100
                        dark:bg-white
                        dark:text-slate-950
                      "
                    >
                      <p>{formatRevenue(item.revenue)}</p>
                      <p className="mt-0.5 opacity-70">
                        {item.orders} orders
                      </p>
                    </div>

                    {/* Bar */}

                    <div
                      className="
                        w-full
                        rounded-t-md
                        bg-emerald-500/80
                        transition-all
                        duration-300
                        group-hover:bg-emerald-600
                        dark:bg-emerald-500/70
                        dark:group-hover:bg-emerald-500
                      "
                      style={{
                        height: `${height}%`,
                        minHeight: "8px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Month labels */}

          <div
            className="
              absolute
              bottom-0
              left-14
              right-1
              flex
              gap-1
              sm:gap-2
            "
          >
            {monthlyData.map((item) => (
              <span
                key={item.month}
                className="
                  min-w-0
                  flex-1
                  text-center
                  text-[10px]
                  text-slate-400
                "
              >
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}