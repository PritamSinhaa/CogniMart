import { Plus } from "lucide-react";

export default function AdminPageHeader({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus,
  children,
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* ============================================================
          TITLE
      ============================================================ */}

      <div className="min-w-0">
        <h1
          className="
            text-2xl
            font-bold
            tracking-tight
            text-slate-950
            sm:text-3xl
            dark:text-white
          "
        >
          {title}
        </h1>

        {description && (
          <p
            className="
              mt-1.5
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            {description}
          </p>
        )}
      </div>

      {/* ============================================================
          ACTIONS
      ============================================================ */}

      <div className="flex shrink-0 items-center gap-2">
        {children}

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              hover:bg-emerald-700
              active:scale-[0.98]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500
              focus-visible:ring-offset-2
            "
          >
            <ActionIcon size={16} />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
