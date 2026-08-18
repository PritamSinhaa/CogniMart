import { ArrowUpRight } from "lucide-react";

export default function AISuggestionChip({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        min-h-14
        w-full
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-3.5
        text-left
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-emerald-200
        hover:bg-emerald-50/60
        hover:shadow-md
        active:translate-y-0
        active:scale-[0.99]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-emerald-500
        focus-visible:ring-offset-2
        disabled:pointer-events-none
        disabled:opacity-50
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-emerald-900
        dark:hover:bg-emerald-950/30
        dark:focus-visible:ring-offset-slate-950
      "
    >
      {/* ============================================================
          ICON
      ============================================================ */}

      <span
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
          transition-colors
          duration-200
          group-hover:bg-emerald-100
          dark:bg-emerald-950/50
          dark:text-emerald-400
          dark:group-hover:bg-emerald-950
        "
      >
        {Icon && <Icon size={18} strokeWidth={2} aria-hidden="true" />}
      </span>

      {/* ============================================================
          LABEL
      ============================================================ */}

      <span className="min-w-0 flex-1">
        <span
          className="
            block
            truncate
            text-sm
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          {children}
        </span>
      </span>

      {/* ============================================================
          ARROW
      ============================================================ */}

      <span
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-slate-400
          transition-all
          duration-200
          group-hover:bg-white
          group-hover:text-emerald-600
          dark:group-hover:bg-slate-800
          dark:group-hover:text-emerald-400
        "
      >
        <ArrowUpRight
          size={16}
          strokeWidth={2}
          className="
            transition-transform
            duration-200
            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
          "
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
