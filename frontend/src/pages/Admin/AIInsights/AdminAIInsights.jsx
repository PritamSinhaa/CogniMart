import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

const insights = [
  {
    id: 1,
    type: "Low Stock Alert",
    title: "Wireless Headphones",
    description:
      "Only 8 units are remaining. Current sales velocity suggests the product may run out within 4 days.",
    recommendation: "Restock 25 units",
    priority: "High",
    icon: AlertTriangle,
    action: "Review inventory",
  },
  {
    id: 2,
    type: "High Demand",
    title: "Gaming Keyboard",
    description:
      "Demand increased by 34% compared with the previous 30-day period.",
    recommendation: "Increase inventory by 20%",
    priority: "High",
    icon: TrendingUp,
    action: "View product",
  },
  {
    id: 3,
    type: "Restock Recommendation",
    title: "Smart Watch Pro",
    description:
      "Sales velocity is increasing while available inventory is trending below the ideal safety level.",
    recommendation: "Recommended restock: 25 units",
    priority: "Medium",
    icon: Package,
    action: "Create purchase plan",
  },
  {
    id: 4,
    type: "Sales Insight",
    title: "Electronics category",
    description:
      "Electronics generated 42% of this month's revenue and continues to outperform other categories.",
    recommendation: "Promote top electronics products",
    priority: "Medium",
    icon: ShoppingBag,
    action: "View analytics",
  },
  {
    id: 5,
    type: "Customer Insight",
    title: "Returning customers",
    description:
      "Repeat purchases increased 12% this month. Customers who purchased accessories are most likely to return.",
    recommendation: "Create an accessory bundle",
    priority: "Low",
    icon: Users,
    action: "View customers",
  },
  {
    id: 6,
    type: "Opportunity",
    title: "Weekend sales opportunity",
    description:
      "AI predicts higher weekend traffic based on recent purchasing patterns.",
    recommendation: "Schedule a weekend promotion",
    priority: "Low",
    icon: Zap,
    action: "Create promotion",
  },
];

const priorityStyles = {
  High: {
    badge: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-500",
  },
  Medium: {
    badge:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Low: {
    badge:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
};

export default function AdminAIInsights() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

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
            <div className="flex items-center gap-2">
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
                <Sparkles size={17} />
              </div>

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
                CogniMart Intelligence
              </p>
            </div>

            <h1
              className="
                mt-3
                text-2xl
                font-bold
                tracking-tight
                text-slate-950
                dark:text-white
              "
            >
              AI Insights
            </h1>

            <p
              className="
                mt-1
                max-w-2xl
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Actionable recommendations generated from your store's sales,
              inventory, and customer activity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
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
              shadow-sm
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Analyzing..." : "Refresh insights"}
          </button>
        </div>

        {/* AI STATUS CARD */}

        <section
          className="
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-emerald-100
            bg-white
            shadow-sm
            dark:border-emerald-950
            dark:bg-slate-900
          "
        >
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-emerald-50
                    text-emerald-600
                    dark:bg-emerald-950/40
                    dark:text-emerald-400
                  "
                >
                  <Brain size={21} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      AI business analysis is active
                    </h2>

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-emerald-50
                        px-2
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-emerald-600
                        dark:bg-emerald-950/40
                        dark:text-emerald-400
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    CogniMart AI analyzed your latest sales, inventory, and
                    customer activity.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 border-t border-slate-100 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 dark:border-slate-800">
                <MiniStat label="Insights" value="12" />

                <MiniStat label="High priority" value="2" />

                <MiniStat label="Opportunities" value="5" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION HEADER */}

        <div className="mt-7 flex items-end justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recommended actions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Prioritized opportunities based on current store data.
            </p>
          </div>

          <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
            Updated just now
          </span>
        </div>

        {/* INSIGHTS GRID */}

        <div
          className="
            mt-4
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {insights.map((insight) => {
            const Icon = insight.icon;
            const styles = priorityStyles[insight.priority];

            return (
              <InsightCard
                key={insight.id}
                insight={insight}
                Icon={Icon}
                styles={styles}
              />
            );
          })}
        </div>

        {/* AI SUMMARY */}

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
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-slate-100
                text-slate-600
                dark:bg-slate-800
                dark:text-slate-300
              "
            >
              <Lightbulb size={17} />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                AI summary
              </h2>

              <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                Your store is showing healthy growth, with electronics
                continuing to lead revenue. The highest immediate priority is
                inventory: several fast-moving products are approaching their
                safety-stock threshold. Increasing stock on these products could
                help prevent lost sales over the next few weeks.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <SummaryTag>Inventory attention needed</SummaryTag>

                <SummaryTag>Electronics performing well</SummaryTag>

                <SummaryTag>Repeat customers increasing</SummaryTag>
              </div>
            </div>
          </div>
        </section>

        {/* AI FOOTER */}

        <div className="mt-5 flex items-center justify-center gap-2 pb-2 text-[10px] text-slate-400">
          <Sparkles size={11} />
          CogniMart AI continuously analyzes your business data
        </div>
      </div>
    </main>
  );
}

function InsightCard({ insight, Icon, styles }) {
  return (
    <article
      className="
        group
        flex
        flex-col
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-600
            dark:bg-slate-800
            dark:text-slate-300
          "
        >
          <Icon size={16} />
        </div>

        <span
          className={`
            inline-flex
            items-center
            gap-1.5
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
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />

          {insight.priority}
        </span>
      </div>

      <p
        className="
          mt-4
          text-[10px]
          font-bold
          uppercase
          tracking-wider
          text-emerald-600
          dark:text-emerald-400
        "
      >
        {insight.type}
      </p>

      <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
        {insight.title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {insight.description}
      </p>

      <div
        className="
          mt-4
          rounded-xl
          bg-slate-50
          p-3
          dark:bg-slate-800/70
        "
      >
        <div className="flex items-start gap-2">
          <CheckCircle2
            size={14}
            className="mt-0.5 shrink-0 text-emerald-500"
          />

          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Recommended action
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {insight.recommendation}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="
          mt-4
          inline-flex
          items-center
          justify-between
          text-xs
          font-semibold
          text-slate-600
          transition
          hover:text-emerald-600
          dark:text-slate-400
          dark:hover:text-emerald-400
        "
      >
        {insight.action}

        <ArrowRight
          size={14}
          className="
            transition-transform
            group-hover:translate-x-0.5
          "
        />
      </button>
    </article>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <p className="text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] font-medium text-slate-400">{label}</p>
    </div>
  );
}

function SummaryTag({ children }) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-slate-200
        bg-white
        px-2.5
        py-1.5
        text-[10px]
        font-medium
        text-slate-500
        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-400
      "
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {children}
    </span>
  );
}
