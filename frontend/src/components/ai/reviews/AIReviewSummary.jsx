import {
  AlertCircle,
  Check,
  MessageSquareText,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

function RatingStars({ rating = 0 }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= Math.round(rating)
              ? "fill-emerald-500 text-emerald-500"
              : "text-slate-300 dark:text-slate-700"
          }
        />
      ))}
    </div>
  );
}

function SummaryPoint({ type, children }) {
  const isPositive = type === "positive";

  return (
    <li className="flex items-start gap-2">
      <span
        className={`
          mt-0.5
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          ${
            isPositive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }
        `}
      >
        {isPositive ? <ThumbsUp size={10} /> : <ThumbsDown size={10} />}
      </span>

      <span
        className="
          text-xs
          leading-5
          text-slate-600
          dark:text-slate-400
        "
      >
        {children}
      </span>
    </li>
  );
}

export default function AIReviewSummary({
  rating = 0,
  totalReviews = 0,
  summary = "",
  positivePoints = [],
  negativePoints = [],
  verdict = "",
}) {
  const formattedReviews =
    typeof totalReviews === "number"
      ? totalReviews.toLocaleString("en-IN")
      : totalReviews;

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
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div
        className="
          border-b
          border-slate-200
          p-4
          sm:p-5
          dark:border-slate-800
        "
      >
        <div className="flex items-start gap-3">
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
            <MessageSquareText size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
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
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-emerald-50
                  px-2
                  py-0.5
                  text-[9px]
                  font-semibold
                  text-emerald-700
                  dark:bg-emerald-950/50
                  dark:text-emerald-400
                "
              >
                <Sparkles size={9} />
                AI
              </span>
            </div>

            <p
              className="
                mt-1
                text-[11px]
                leading-4
                text-slate-500
                dark:text-slate-400
              "
            >
              A concise summary of what customers are saying.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          RATING
      ============================================================ */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          border-b
          border-slate-200
          p-4
          sm:grid-cols-[auto_1fr]
          sm:items-center
          sm:p-5
          dark:border-slate-800
        "
      >
        {/* Rating score */}

        <div
          className="
            flex
            items-center
            gap-4
            sm:pr-5
          "
        >
          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-emerald-50
              dark:bg-emerald-950/40
            "
          >
            <span
              className="
                text-2xl
                font-bold
                tracking-tight
                text-emerald-700
                dark:text-emerald-400
              "
            >
              {Number(rating).toFixed(1)}
            </span>
          </div>

          <div>
            <RatingStars rating={rating} />

            <p
              className="
                mt-1.5
                text-[10px]
                text-slate-400
              "
            >
              Based on {formattedReviews} reviews
            </p>
          </div>
        </div>

        {/* AI summary */}

        <div
          className="
            rounded-xl
            bg-slate-50
            p-3
            sm:p-4
            dark:bg-slate-950
          "
        >
          <div className="flex items-start gap-2">
            <Sparkles
              size={14}
              className="
                mt-0.5
                shrink-0
                text-emerald-600
                dark:text-emerald-400
              "
            />

            <div>
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                AI summary
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {summary ||
                  "There is not enough review information to generate a summary yet."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          REVIEW INSIGHTS
      ============================================================ */}

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
        {/* Positive */}

        <div
          className="
            border-b
            border-slate-200
            p-4
            sm:border-r
            sm:border-b-0
            sm:p-5
            dark:border-slate-800
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                bg-emerald-50
                text-emerald-600
                dark:bg-emerald-950/50
                dark:text-emerald-400
              "
            >
              <ThumbsUp size={13} />
            </div>

            <h4
              className="
                text-xs
                font-bold
                text-slate-800
                dark:text-slate-200
              "
            >
              What customers like
            </h4>
          </div>

          {positivePoints.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {positivePoints.map((point, index) => (
                <SummaryPoint key={`${point}-${index}`} type="positive">
                  {point}
                </SummaryPoint>
              ))}
            </ul>
          ) : (
            <p
              className="
                mt-4
                text-xs
                text-slate-400
              "
            >
              No positive insights available yet.
            </p>
          )}
        </div>

        {/* Negative */}

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                bg-slate-100
                text-slate-500
                dark:bg-slate-800
                dark:text-slate-400
              "
            >
              <ThumbsDown size={13} />
            </div>

            <h4
              className="
                text-xs
                font-bold
                text-slate-800
                dark:text-slate-200
              "
            >
              Common concerns
            </h4>
          </div>

          {negativePoints.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {negativePoints.map((point, index) => (
                <SummaryPoint key={`${point}-${index}`} type="negative">
                  {point}
                </SummaryPoint>
              ))}
            </ul>
          ) : (
            <p
              className="
                mt-4
                text-xs
                text-slate-400
              "
            >
              No major concerns found.
            </p>
          )}
        </div>
      </div>

      {/* ============================================================
          VERDICT
      ============================================================ */}

      {verdict && (
        <div
          className="
            border-t
            border-slate-200
            bg-emerald-50/60
            p-4
            dark:border-slate-800
            dark:bg-emerald-950/20
            sm:p-5
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-emerald-600
                text-white
              "
            >
              <Check size={15} />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-emerald-700
                  dark:text-emerald-400
                "
              >
                AI verdict
              </p>

              <p
                className="
                  mt-1
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
        </div>
      )}

      {/* ============================================================
          DISCLAIMER
      ============================================================ */}

      <div
        className="
          flex
          items-start
          gap-2
          border-t
          border-slate-200
          px-4
          py-3
          dark:border-slate-800
        "
      >
        <AlertCircle
          size={12}
          className="
            mt-0.5
            shrink-0
            text-slate-400
          "
        />

        <p
          className="
            text-[9px]
            leading-4
            text-slate-400
          "
        >
          AI summaries are generated from available customer reviews and may not
          represent every review or customer experience.
        </p>
      </div>
    </section>
  );
}
