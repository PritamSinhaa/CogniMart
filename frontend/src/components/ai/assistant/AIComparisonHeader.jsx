import { Scale, Sparkles } from "lucide-react";

export default function AIComparisonHeader({
  title = "Product comparison",
  description = "Here's how these products compare based on the features that matter.",
}) {
  return (
    <div className="mb-5">
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
          <Scale size={18} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h3>

            <Sparkles
              size={14}
              className="text-emerald-500"
            />
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}