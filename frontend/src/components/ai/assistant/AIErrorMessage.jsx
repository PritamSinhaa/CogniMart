import { AlertCircle, RefreshCw } from "lucide-react";

export default function AIErrorMessage({
  message = "Something went wrong while processing your request.",
  onRetry,
}) {
  return (
    <div className="flex items-start gap-3">
      {/* AI avatar / error icon */}

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-red-50
          text-red-500
          dark:bg-red-950/40
          dark:text-red-400
        "
      >
        <AlertCircle
          size={17}
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>

      {/* Error content */}

      <div
        className="
          min-w-0
          max-w-xl
          rounded-2xl
          rounded-tl-md
          border
          border-red-200
          bg-white
          px-4
          py-3
          shadow-sm
          dark:border-red-900/60
          dark:bg-slate-900
        "
        role="alert"
      >
        <p
          className="
            text-sm
            font-medium
            text-slate-800
            dark:text-slate-200
          "
        >
          {message}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          Please try again. If the problem continues,
          you can start a new conversation.
        </p>

        {/* Retry */}

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="
              mt-3
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              px-2.5
              py-1.5
              text-xs
              font-semibold
              text-emerald-700
              transition-colors
              hover:bg-emerald-50
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500
              focus-visible:ring-offset-2
              dark:text-emerald-400
              dark:hover:bg-emerald-950/40
              dark:focus-visible:ring-offset-slate-900
            "
          >
            <RefreshCw
              size={13}
              aria-hidden="true"
            />

            Try again
          </button>
        )}
      </div>
    </div>
  );
}