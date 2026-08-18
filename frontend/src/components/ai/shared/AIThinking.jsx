import { Sparkles } from "lucide-react";

export default function AIThinking() {
  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
      role="status"
      aria-live="polite"
      aria-label="CogniMart AI is thinking"
    >
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
          text-emerald-600
          dark:bg-emerald-950/50
          dark:text-emerald-400
        "
      >
        <Sparkles size={17} className="animate-pulse" />
      </div>

      {/* ============================================================
          THINKING BUBBLE
      ============================================================ */}

      <div
        className="
          flex
          min-h-12
          items-center
          gap-3
          rounded-2xl
          rounded-tl-md
          border
          border-slate-200
          bg-white
          px-4
          py-3
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* Label */}

        <span
          className="
            text-xs
            font-medium
            text-slate-500
            dark:text-slate-400
          "
        >
          CogniMart AI is thinking
        </span>

        {/* Animated dots */}

        <div
          className="
            flex
            items-center
            gap-1
          "
          aria-hidden="true"
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-500
              animate-bounce
            "
            style={{
              animationDelay: "0ms",
            }}
          />

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-500
              animate-bounce
            "
            style={{
              animationDelay: "150ms",
            }}
          />

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-500
              animate-bounce
            "
            style={{
              animationDelay: "300ms",
            }}
          />
        </div>
      </div>
    </div>
  );
}
