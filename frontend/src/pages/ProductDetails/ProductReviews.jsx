import {
  CheckCircle2,
  LoaderCircle,
  MessageSquare,
  Pencil,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  createReview,
  deleteReview,
  getMyReview,
  getProductReviews,
  updateReview,
} from "../../api/review.api";

import { useAuth } from "../../context/AuthContext";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function extractReviews(response) {
  return response?.data?.reviews || response?.reviews || [];
}

function extractReview(response) {
  return response?.data?.review || response?.review || null;
}

function getErrorMessage(error, fallback) {
  return error?.data?.message || error?.message || fallback;
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(parsedDate);
}

function getInitials(name = "") {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "U";
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function ProductReviews({ productId, onReviewsChanged }) {
  const navigate = useNavigate();

  const location = useLocation();

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [reviews, setReviews] = useState([]);

  const [myReview, setMyReview] = useState(null);

  const [loading, setLoading] = useState(true);

  const [loadingMyReview, setLoadingMyReview] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [editing, setEditing] = useState(false);

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  const [hoveredRating, setHoveredRating] = useState(0);

  const [error, setError] = useState("");

  const [actionError, setActionError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load public reviews
  |--------------------------------------------------------------------------
  */

  const loadReviews = useCallback(async () => {
    if (!productId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getProductReviews(productId);

      const loadedReviews = extractReviews(response);

      setReviews(Array.isArray(loadedReviews) ? loadedReviews : []);
    } catch (requestError) {
      setReviews([]);

      setError(
        getErrorMessage(requestError, "Unable to load product reviews."),
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  /*
  |--------------------------------------------------------------------------
  | Load logged-in user's review
  |--------------------------------------------------------------------------
  */

  const loadMyReview = useCallback(async () => {
    if (!productId || !isAuthenticated) {
      setMyReview(null);
      return null;
    }

    setLoadingMyReview(true);

    try {
      const response = await getMyReview(productId);

      const loadedReview = extractReview(response);

      setMyReview(loadedReview);

      return loadedReview;
    } catch (requestError) {
      /*
       * A 404 is normal when the
       * customer has not reviewed
       * this product yet.
       */
      if (requestError?.status === 404) {
        setMyReview(null);
        return null;
      }

      setActionError(
        getErrorMessage(requestError, "Unable to load your review."),
      );

      return null;
    } finally {
      setLoadingMyReview(false);
    }
  }, [productId, isAuthenticated]);

  /*
  |--------------------------------------------------------------------------
  | Initial loading
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadMyReview();
  }, [authLoading, user?.id, user?._id, loadMyReview]);

  /*
  |--------------------------------------------------------------------------
  | Rating summary
  |--------------------------------------------------------------------------
  */

  const ratingSummary = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        count: 0,
      };
    }

    const total = reviews.reduce(
      (currentTotal, review) => currentTotal + (Number(review.rating) || 0),
      0,
    );

    return {
      average: total / reviews.length,

      count: reviews.length,
    };
  }, [reviews]);

  /*
  |--------------------------------------------------------------------------
  | Start editing
  |--------------------------------------------------------------------------
  */

  const handleStartEditing = () => {
    if (!myReview) {
      return;
    }

    setRating(Number(myReview.rating) || 0);

    setComment(myReview.comment || "");

    setEditing(true);
    setActionError("");
    setSuccessMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | Cancel editing
  |--------------------------------------------------------------------------
  */

  const handleCancelEditing = () => {
    setEditing(false);

    setRating(0);
    setComment("");

    setActionError("");
    setSuccessMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | Create or update review
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location.pathname,

          message: "Please log in to review this product.",
        },
      });

      return;
    }

    const cleanComment = comment.trim();

    if (rating < 1 || rating > 5) {
      setActionError("Please select a rating from 1 to 5.");

      return;
    }

    if (cleanComment.length < 3) {
      setActionError("Your review must contain at least 3 characters.");

      return;
    }

    if (cleanComment.length > 1000) {
      setActionError("Your review cannot exceed 1000 characters.");

      return;
    }

    setSubmitting(true);
    setActionError("");
    setSuccessMessage("");

    try {
      if (editing && myReview?._id) {
        await updateReview(myReview._id, {
          rating,
          comment: cleanComment,
        });

        setSuccessMessage("Your review was updated successfully.");
      } else {
        await createReview(productId, {
          rating,
          comment: cleanComment,
        });

        setSuccessMessage("Your review was submitted successfully.");
      }

      setEditing(false);
      setRating(0);
      setComment("");

      await Promise.all([loadReviews(), loadMyReview()]);

      onReviewsChanged?.();
    } catch (requestError) {
      setActionError(
        getErrorMessage(requestError, "Unable to save your review."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete review
  |--------------------------------------------------------------------------
  */

  const handleDelete = async () => {
    if (!myReview?._id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your review?",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setActionError("");
    setSuccessMessage("");

    try {
      await deleteReview(myReview._id);

      setMyReview(null);
      setEditing(false);
      setRating(0);
      setComment("");

      setSuccessMessage("Your review was deleted successfully.");

      await loadReviews();

      onReviewsChanged?.();
    } catch (requestError) {
      setActionError(
        getErrorMessage(requestError, "Unable to delete your review."),
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <ReviewHeader
        average={ratingSummary.average}
        count={ratingSummary.count}
      />

      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div>
          {authLoading || loadingMyReview ? (
            <ReviewFormLoading />
          ) : !isAuthenticated ? (
            <LoginToReview
              onLogin={() => {
                navigate("/login", {
                  state: {
                    from: location.pathname,

                    message: "Please log in to review this product.",
                  },
                });
              }}
            />
          ) : myReview && !editing ? (
            <MyReviewCard
              review={myReview}
              deleting={deleting}
              onEdit={handleStartEditing}
              onDelete={handleDelete}
            />
          ) : (
            <ReviewForm
              editing={editing}
              rating={rating}
              setRating={setRating}
              hoveredRating={hoveredRating}
              setHoveredRating={setHoveredRating}
              comment={comment}
              setComment={setComment}
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={handleCancelEditing}
            />
          )}

          {actionError && <Message type="error" message={actionError} />}

          {successMessage && (
            <Message type="success" message={successMessage} />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                Customer reviews
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Reviews from verified customers.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {ratingSummary.count}{" "}
              {ratingSummary.count === 1 ? "review" : "reviews"}
            </span>
          </div>

          {loading ? (
            <ReviewsLoading />
          ) : error ? (
            <ReviewsError message={error} onRetry={loadReviews} />
          ) : reviews.length === 0 ? (
            <EmptyReviews />
          ) : (
            <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
              {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function ReviewHeader({ average, count }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800 dark:bg-slate-950">
      <div>
        <p className="text-sm font-semibold text-emerald-600">
          Ratings &amp; reviews
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
          Customer feedback
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Star size={20} fill="currentColor" className="text-amber-400" />

          <span className="text-2xl font-bold text-slate-950 dark:text-white">
            {average.toFixed(1)}
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Based on {count} {count === 1 ? "review" : "reviews"}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Review form
|--------------------------------------------------------------------------
*/

function ReviewForm({
  editing,
  rating,
  setRating,
  hoveredRating,
  setHoveredRating,
  comment,
  setComment,
  submitting,
  onSubmit,
  onCancel,
}) {
  const displayedRating = hoveredRating || rating;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
    >
      <h3 className="font-bold text-slate-950 dark:text-white">
        {editing ? "Edit your review" : "Write a review"}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        You can review this product after it has been delivered.
      </p>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Your rating
        </legend>

        <div
          className="mt-2 flex gap-1"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              aria-label={`${value} star rating`}
              className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Star
                size={25}
                fill={value <= displayedRating ? "currentColor" : "none"}
                className={
                  value <= displayedRating
                    ? "text-amber-400"
                    : "text-slate-300 dark:text-slate-700"
                }
              />
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label
          htmlFor="review-comment"
          className="text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          Your review
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          maxLength={1000}
          placeholder="Share your experience with this product..."
          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />

        <p className="mt-1 text-right text-[11px] text-slate-400">
          {comment.length}/1000
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting || rating < 1 || comment.trim().length < 3}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <LoaderCircle size={16} className="animate-spin" />
              Saving...
            </>
          ) : editing ? (
            "Update review"
          ) : (
            "Submit review"
          )}
        </button>
      </div>
    </form>
  );
}

/*
|--------------------------------------------------------------------------
| Logged-in user's review
|--------------------------------------------------------------------------
*/

function MyReviewCard({ review, deleting, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Your review
          </p>

          <Rating value={review.rating} />
        </div>

        {review.isVerifiedPurchase && <VerifiedBadge />}
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {review.comment}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {formatDate(review.updatedAt || review.createdAt)}
      </p>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onEdit}
          disabled={deleting}
          className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-500 disabled:opacity-50 dark:border-red-500/20 dark:bg-slate-900"
        >
          {deleting ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}

          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Review list item
|--------------------------------------------------------------------------
*/

function ReviewItem({ review }) {
  const userName = review.user?.name || "Customer";

  return (
    <article className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          {getInitials(userName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {userName}
            </p>

            {review.isVerifiedPurchase && <VerifiedBadge />}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <Rating value={review.rating} />

            <span className="text-xs text-slate-400">
              {formatDate(review.createdAt)}
            </span>
          </div>

          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
            {review.comment}
          </p>
        </div>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Shared review UI
|--------------------------------------------------------------------------
*/

function Rating({ value }) {
  const numericValue = Number(value) || 0;

  return (
    <div
      className="mt-1 flex items-center gap-0.5"
      aria-label={`${numericValue} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          fill={star <= numericValue ? "currentColor" : "none"}
          className={
            star <= numericValue
              ? "text-amber-400"
              : "text-slate-300 dark:text-slate-700"
          }
        />
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
      <ShieldCheck size={11} />
      Verified purchase
    </span>
  );
}

function Message({ type, message }) {
  const success = type === "success";

  return (
    <div
      role={success ? "status" : "alert"}
      className={`mt-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
      }`}
    >
      {success && <CheckCircle2 size={15} className="mt-0.5 shrink-0" />}

      {message}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Special states
|--------------------------------------------------------------------------
*/

function LoginToReview({ onLogin }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 text-center dark:border-slate-800">
      <MessageSquare
        size={28}
        className="mx-auto text-slate-300 dark:text-slate-700"
      />

      <h3 className="mt-3 font-bold text-slate-900 dark:text-white">
        Share your experience
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        Log in to review a product you have purchased and received.
      </p>

      <button
        type="button"
        onClick={onLogin}
        className="mt-4 h-10 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Log in to review
      </button>
    </div>
  );
}

function ReviewFormLoading() {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800">
      <LoaderCircle size={25} className="animate-spin text-emerald-600" />
    </div>
  );
}

function ReviewsLoading() {
  return (
    <div className="mt-5 flex min-h-48 items-center justify-center">
      <LoaderCircle size={28} className="animate-spin text-emerald-600" />
    </div>
  );
}

function ReviewsError({ message, onRetry }) {
  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-500/20 dark:bg-red-500/10">
      <p className="text-sm font-medium text-red-600 dark:text-red-400">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-3 text-xs font-semibold text-red-700 underline dark:text-red-400"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyReviews() {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center dark:border-slate-800">
      <MessageSquare
        size={30}
        className="mx-auto text-slate-300 dark:text-slate-700"
      />

      <h3 className="mt-3 font-bold text-slate-900 dark:text-white">
        No reviews yet
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Be the first verified customer to review this product.
      </p>
    </div>
  );
}
