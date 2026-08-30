import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

const iconStyles = {
  emerald: {
    wrapper:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  blue: {
    wrapper: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  violet: {
    wrapper:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  },
  amber: {
    wrapper:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  },
  red: {
    wrapper: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  },
};

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  color = "emerald",
  change,
  changeLabel = "vs last month",
  trend = "up",
  description,
}) {
  const styles = iconStyles[color] || iconStyles.emerald;

  const isPositive = trend === "up";
  const isNeutral = trend === "neutral";

  return (
    <article
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        sm:p-5
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* ============================================================
          TOP
      ============================================================ */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="
              truncate
              text-xs
              font-medium
              text-slate-500
              dark:text-slate-400
            "
          >
            {title}
          </p>

          <p
            className="
              mt-2
              truncate
              text-2xl
              font-bold
              tracking-tight
              text-slate-950
              dark:text-white
            "
          >
            {value}
          </p>
        </div>

        {/* Icon */}

        {Icon && (
          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${styles.wrapper}
            `}
          >
            <Icon size={19} strokeWidth={1.9} />
          </div>
        )}
      </div>

      {/* ============================================================
          BOTTOM
      ============================================================ */}

      {(change !== undefined || description) && (
        <div className="mt-4">
          {change !== undefined && (
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Trend */}

              <span
                className={`
                  inline-flex
                  items-center
                  gap-0.5
                  text-xs
                  font-semibold

                  ${
                    isNeutral
                      ? "text-slate-500 dark:text-slate-400"
                      : isPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                  }
                `}
              >
                {isNeutral ? (
                  <Minus size={13} />
                ) : isPositive ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}

                {change}
              </span>

              <span className="text-[11px] text-slate-400">{changeLabel}</span>
            </div>
          )}

          {description && (
            <p className="mt-1 text-[11px] text-slate-400">{description}</p>
          )}
        </div>
      )}
    </article>
  );
}
