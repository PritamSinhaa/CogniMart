import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href="/products"
        className="
          group
          inline-flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-full
          bg-emerald-600
          px-6
          text-sm
          font-semibold
          text-white
          shadow-lg
          shadow-emerald-600/20
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-emerald-700
          hover:shadow-xl
          hover:shadow-emerald-600/25
        "
      >
        Start Shopping

        <ArrowRight
          size={16}
          className="
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        />
      </a>

      <a
        href="/ai-assistant"
        className="
          inline-flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-full
          border
          border-slate-200
          bg-white
          px-6
          text-sm
          font-semibold
          text-slate-700
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-emerald-300
          hover:text-emerald-700
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-200
          dark:hover:border-emerald-700
          dark:hover:text-emerald-400
        "
      >
        <Sparkles size={16} />

        Ask AI
      </a>
    </div>
  );
}