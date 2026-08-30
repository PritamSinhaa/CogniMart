import {
  ArrowRight,
  Brain,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
  Zap,
} from "lucide-react";

const insights = [
  {
    id: "low-stock",
    type: "Low Stock Alert",
    title: "Wireless Headphones",
    description:
      "Only 8 units remaining. Based on the current sales rate, this product may run out in approximately 3 days.",
    action: "Review inventory",
    icon: PackageCheck,
    tone: "warning",
  },
  {
    id: "high-demand",
    type: "High Demand",
    title: "Gaming Keyboard",
    description:
      "Demand increased 34% this week. Consider increasing stock to avoid missed sales opportunities.",
    action: "View product",
    icon: TrendingUp,
    tone: "success",
  },
  {
    id: "restock",
    type: "Restock Recommendation",
    title: "Recommended restock: 25 units",
    description:
      "AI recommends ordering 25 additional units based on recent sales velocity and current inventory.",
    action: "Review recommendation",
    icon: ShoppingBag,
    tone: "info",
  },
  {
    id: "sales",
    type: "Sales Insight",
    title: "Electronics generated 42%",
    description:
      "Electronics is currently your strongest category and generated 42% of this month's total revenue.",
    action: "View analytics",
    icon: Zap,
    tone: "purple",
  },
];

const toneStyles = {
  warning: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    border: "hover:border-amber-200 dark:hover:border-amber-900",
  },

  success: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    border: "hover:border-emerald-200 dark:hover:border-emerald-900",
  },

  info: {
    icon: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    border: "hover:border-blue-200 dark:hover:border-blue-900",
  },

  purple: {
    icon: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    badge:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    border: "hover:border-violet-200 dark:hover:border-violet-900",
  },
};

export default function AdminAIInsights() {
  const handleAction = (insight) => {
    console.log("AI insight action:", insight.id);
  };

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
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600
              dark:bg-emerald-950/40
              dark:text-emerald-400
            "
          >
            <Brain size={19} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                AI Insights
              </h2>

              <span
                className="
                  rounded-full
                  bg-emerald-100
                  px-2
                  py-0.5
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-emerald-700
                  dark:bg-emerald-950/60
                  dark:text-emerald-400
                "
              >
                AI Powered
              </span>
            </div>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Actionable recommendations based on your store data
            </p>
          </div>
        </div>

        <button
          type="button"
          className="
            inline-flex
            w-fit
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-emerald-600
            transition-colors
            hover:text-emerald-700
            dark:text-emerald-400
            dark:hover:text-emerald-300
          "
        >
          View all insights
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ============================================================
          INSIGHTS
      ============================================================ */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          p-4
          sm:grid-cols-2
          sm:p-5
        "
      >
        {insights.map((insight) => {
          const Icon = insight.icon;
          const styles = toneStyles[insight.tone];

          return (
            <article
              key={insight.id}
              className={`
                group
                rounded-2xl
                border
                border-slate-200
                p-4
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-sm
                dark:border-slate-800
                ${styles.border}
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}

                <div
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${styles.icon}
                  `}
                >
                  <Icon size={17} />
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2
                      py-1
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wide
                      ${styles.badge}
                    `}
                  >
                    {insight.type}
                  </span>

                  <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                    {insight.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {insight.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleAction(insight)}
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-slate-700
                      transition-colors
                      hover:text-emerald-600
                      dark:text-slate-300
                      dark:hover:text-emerald-400
                    "
                  >
                    {insight.action}
                    <ArrowRight
                      size={13}
                      className="
                        transition-transform
                        group-hover:translate-x-0.5
                      "
                    />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
