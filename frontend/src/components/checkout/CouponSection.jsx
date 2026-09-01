import { CheckCircle2, LoaderCircle, Tag, X } from "lucide-react";

import { useEffect, useState } from "react";

import { applyCoupon } from "../../api/coupon.api";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

function getErrorMessage(error) {
  return (
    error?.data?.message || error?.message || "Unable to apply this coupon"
  );
}

function extractCouponResult(response) {
  return response?.data || response || null;
}

export default function CouponSection({
  orderValue,
  appliedCoupon,
  onCouponApplied,
  onCouponRemoved,
}) {
  const [code, setCode] = useState("");

  const [applying, setApplying] = useState(false);

  const [error, setError] = useState("");

  /*
   * Keep the input synchronized with
   * the applied coupon.
   */
  useEffect(() => {
    if (appliedCoupon?.coupon?.code) {
      setCode(appliedCoupon.coupon.code);
    }
  }, [appliedCoupon]);

  /*
  |--------------------------------------------------------------------------
  | Input
  |--------------------------------------------------------------------------
  */

  const handleCodeChange = (event) => {
    const nextCode = event.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "")
      .slice(0, 30);

    setCode(nextCode);
    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Apply coupon
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode.length < 3) {
      setError("Enter a valid coupon code");

      return;
    }

    if (!Number.isFinite(Number(orderValue)) || Number(orderValue) <= 0) {
      setError("Add products before applying a coupon");

      return;
    }

    setApplying(true);
    setError("");

    try {
      const response = await applyCoupon(normalizedCode, Number(orderValue));

      const result = extractCouponResult(response);

      if (!result?.coupon?.code) {
        throw new Error("Coupon information was not returned");
      }

      onCouponApplied(result);

      setCode(result.coupon.code);
    } catch (requestError) {
      onCouponRemoved();

      setError(getErrorMessage(requestError));
    } finally {
      setApplying(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Remove coupon
  |--------------------------------------------------------------------------
  */

  const handleRemove = () => {
    onCouponRemoved();
    setCode("");
    setError("");
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <Tag size={18} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Apply coupon
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Enter a valid coupon code to save more.
          </p>
        </div>
      </div>

      <div className="p-4">
        {appliedCoupon ? (
          <AppliedCoupon result={appliedCoupon} onRemove={handleRemove} />
        ) : (
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="coupon-code"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Coupon code
            </label>

            <div className="mt-2 flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Tag
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="coupon-code"
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  disabled={applying}
                  placeholder="WELCOME20"
                  autoComplete="off"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold uppercase tracking-wide text-slate-900 outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={
                  applying || code.trim().length < 3 || Number(orderValue) <= 0
                }
                className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applying ? (
                  <>
                    <LoaderCircle size={15} className="animate-spin" />
                    Applying
                  </>
                ) : (
                  "Apply"
                )}
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
              >
                {error}
              </p>
            )}

            <p className="mt-3 text-[11px] leading-4 text-slate-400">
              Coupon eligibility and discount amount are verified securely by
              the server.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Applied coupon
|--------------------------------------------------------------------------
*/

function AppliedCoupon({ result, onRemove }) {
  const coupon = result.coupon || {};

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <CheckCircle2 size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {coupon.code}
            </p>

            <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80">
              Coupon applied successfully
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove coupon ${coupon.code}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-emerald-700 transition-colors hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4 space-y-2 border-t border-emerald-200 pt-3 text-xs dark:border-emerald-500/20">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500 dark:text-slate-400">
            Coupon discount
          </span>

          <span className="font-bold text-emerald-600">
            − {formatPrice(result.discount)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500 dark:text-slate-400">
            Amount after coupon
          </span>

          <span className="font-bold text-slate-900 dark:text-white">
            {formatPrice(result.finalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
