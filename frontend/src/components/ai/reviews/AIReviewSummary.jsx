import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Star,
} from "lucide-react";
import { useState } from "react";

export default function AIReviewSummary({
  rating = 4.7,
  totalReviews = 1248,
  summary = "",
  positivePoints = [],
  negativePoints = [],
  verdict = "Recommended",
}) {
  const [showDetails, setShowDetails] = useState(false);

  const ratingValue = Number(rating) || 0;

  const ratingPercentage = Math.min(Math.max((ratingValue / 5) * 100, 0), 100);

  const positive =
    positivePoints.length > 0
      ? positivePoints
      : [
          "Excellent overall performance",
          "Good build quality",
          "Comfortable for long-term use",
        ];

  const negative =
    negativePoints.length > 0
      ? negativePoints
      : ["Premium pricing", "Some users mention minor issues"];

  return (
    <section
      className="
        w-full
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
      {/* ============================================================= */}
      {/* Header                                                        */}
      {/* ============================================================= */}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* AI Icon */}

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
              dark:bg-emerald-950/50
              dark:text-emerald-400
            "
          >
            <Sparkles size={18} />
          </div>

          {/* Title */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                AI Review Summary
              </h3>

              <span
                className="
                  rounded-full
                  bg-emerald-50
                  px-2
                  py-0.5
                  text-[10px]
                  font-semibold
                  text-emerald-700
                  dark:bg-emerald-950/50
                  dark:text-emerald-400
                "
              >
                AI generated
              </span>
            </div>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              Based on {Number(totalReviews).toLocaleString("en-IN")} customer
              reviews
            </p>
          </div>
        </div>

        {/* =========================================================== */}
        {/* Rating                                                       */}
        {/* =========================================================== */}

        <div
          className="
            mt-5
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
          "
        >
          {/* Rating */}

          <div className="flex items-center gap-3">
            <span
              className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
                dark:text-white
              "
            >
              {ratingValue.toFixed(1)}
            </span>

            <div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    className={
                      star <= Math.round(ratingValue)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }
                  />
                ))}
              </div>

              <p
                className="
                  mt-1
                  text-[11px]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Customer rating
              </p>
            </div>
          </div>

          {/* Sentiment */}

          <div className="flex-1 sm:max-w-xs">
            <div
              className="
                mb-1.5
                flex
                items-center
                justify-between
                text-[10px]
                font-medium
                text-slate-500
                dark:text-slate-400
              "
            >
              <span>Overall sentiment</span>

              <span>{Math.round(ratingPercentage)}%</span>
            </div>

            <div
              className="
                h-2
                overflow-hidden
                rounded-full
                bg-slate-100
                dark:bg-slate-800
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-emerald-500
                  transition-all
                  duration-500
                "
                style={{
                  width: `${ratingPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* Summary                                                      */}
        {/* =========================================================== */}

        <div
          className="
            mt-5
            rounded-xl
            bg-slate-50
            p-4
            dark:bg-slate-950
          "
        >
          <p
            className="
              text-sm
              leading-6
              text-slate-700
              dark:text-slate-300
            "
          >
            {summary ||
              "Customers are generally satisfied with this product based on the available reviews."}
          </p>
        </div>

        {/* =========================================================== */}
        {/* Verdict                                                      */}
        {/* =========================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-emerald-100
            bg-emerald-50/70
            px-3
            py-3
            dark:border-emerald-900/50
            dark:bg-emerald-950/30
          "
        >
          <CheckCircle2
            size={17}
            className="
              shrink-0
              text-emerald-600
              dark:text-emerald-400
            "
          />

          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-emerald-600
                dark:text-emerald-400
              "
            >
              AI verdict
            </p>

            <p
              className="
                mt-0.5
                text-sm
                font-semibold
                text-slate-800
                dark:text-slate-200
              "
            >
              {verdict}
            </p>
          </div>
        </div>

        {/* =========================================================== */}
        {/* Details Button                                               */}
        {/* =========================================================== */}

        <button
          type="button"
          onClick={() => setShowDetails((current) => !current)}
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-xl
            border
            border-slate-200
            px-3
            py-2.5
            text-xs
            font-semibold
            text-slate-600
            transition-colors
            hover:border-emerald-200
            hover:bg-emerald-50
            hover:text-emerald-700
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500/30
            dark:border-slate-700
            dark:text-slate-300
            dark:hover:border-emerald-900
            dark:hover:bg-emerald-950/30
            dark:hover:text-emerald-400
          "
        >
          {showDetails ? "Hide review insights" : "View review insights"}

          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* ============================================================= */}
      {/* Detailed Insights                                             */}
      {/* ============================================================= */}

      {showDetails && (
        <div
          className="
            grid
            gap-5
            border-t
            border-slate-200
            p-4
            sm:grid-cols-2
            sm:p-5
            dark:border-slate-800
          "
        >
          {/* Positive */}

          <div>
            <h4
              className="
                text-xs
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Customers like
            </h4>

            <ul className="mt-3 space-y-2.5">
              {positive.map((point, index) => (
                <li
                  key={`positive-${index}`}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2
                    size={15}
                    className="
                      mt-0.5
                      shrink-0
                      text-emerald-500
                    "
                  />

                  <span
                    className="
                      text-xs
                      leading-5
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Negative */}

          <div>
            <h4
              className="
                text-xs
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Things to consider
            </h4>

            <ul className="mt-3 space-y-2.5">
              {negative.map((point, index) => (
                <li
                  key={`negative-${index}`}
                  className="flex items-start gap-2"
                >
                  <span
                    className="
                      mt-2
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-slate-400
                    "
                  />

                  <span
                    className="
                      text-xs
                      leading-5
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
