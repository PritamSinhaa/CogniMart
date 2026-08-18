import { ArrowUpRight } from "lucide-react";

export default function AISuggestionChip({
  icon: Icon,
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-3.5
        text-left
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-emerald-200
        hover:bg-emerald-50/60
        hover:shadow-md
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-emerald-500
        focus-visible:ring-offset-2
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-emerald-900
        dark:hover:bg-emerald-950/30
      "
    >
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
          dark:bg-emerald-950/50
          dark:text-emerald-400
        "
      >
        {Icon && <Icon size={18} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900 dark:text-white">
          {children}
        </span>
      </span>

      <ArrowUpRight
        size={16}
        className="
          shrink-0
          text-slate-400
          transition-all
          duration-200
          group-hover:-translate-y-0.5
          group-hover:translate-x-0.5
          group-hover:text-emerald-600
          dark:group-hover:text-emerald-400
        "
      />
    </button>
  );
}