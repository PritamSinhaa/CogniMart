import { User } from "lucide-react";

import AIIcon from "../shared/AIIcon";
import AIProductResults from "./AIProductResults";
import AIProductComparison from "./AIProductComparison";
import AIReviewSummary from "../reviews/AIReviewSummary";
import AIMessageActions from "./AIMessageActions";

export default function AIMessage({
  role = "assistant",
  type = "text",
  content,
  products = [],
  onAddToCart,
  onToggleWishlist,
  rating,
  totalReviews,
  summary,
  positivePoints = [],
  negativePoints = [],
  verdict,
  onHelpful,
  onNotHelpful,
}) {
  const isUser = role === "user";

  /*
  |--------------------------------------------------------------------------
  | USER MESSAGE
  |--------------------------------------------------------------------------
  */

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="
            flex
            max-w-[90%]
            items-end
            gap-2
            sm:max-w-[75%]
          "
        >
          {/* User message */}

          <div
            className="
              rounded-2xl
              rounded-br-md
              bg-emerald-600
              px-4
              py-3
              text-sm
              leading-6
              text-white
              shadow-sm
            "
          >
            {content}
          </div>

          {/* User avatar */}

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-slate-200
              text-slate-600
              dark:bg-slate-800
              dark:text-slate-300
            "
          >
            <User size={15} aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ASSISTANT MESSAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flex items-start gap-3">
      {/* ============================================================
          AI AVATAR
      ============================================================ */}

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-emerald-50
          dark:bg-emerald-950/50
        "
      >
        <AIIcon size={17} />
      </div>

      {/* ============================================================
          CONTENT
      ============================================================ */}

      <div className="min-w-0 max-w-full flex-1">
        {/* ==========================================================
            TEXT RESPONSE
        ========================================================== */}

        {content && (
          <>
            <div
              className="
                w-fit
                max-w-[95%]
                rounded-2xl
                rounded-tl-md
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                leading-6
                text-slate-700
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-300
              "
            >
              {content}
            </div>

            {/* Message actions */}

            <AIMessageActions
              content={content}
              onHelpful={onHelpful}
              onNotHelpful={onNotHelpful}
            />
          </>
        )}

        {/* ==========================================================
            PRODUCT RESULTS
        ========================================================== */}

        {type === "products" && (
          <AIProductResults
            products={products}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
          />
        )}

        {/* ==========================================================
            PRODUCT COMPARISON
        ========================================================== */}

        {type === "comparison" && (
          <div className="mt-3 w-full max-w-4xl">
            <AIProductComparison
              products={products}
              onAddToCart={onAddToCart}
            />
          </div>
        )}

        {/* ==========================================================
            REVIEW SUMMARY
        ========================================================== */}

        {type === "review-summary" && (
          <div className="mt-3 w-full max-w-3xl">
            <AIReviewSummary
              rating={rating}
              totalReviews={totalReviews}
              summary={summary}
              positivePoints={positivePoints}
              negativePoints={negativePoints}
              verdict={verdict}
            />
          </div>
        )}
      </div>
    </div>
  );
}
