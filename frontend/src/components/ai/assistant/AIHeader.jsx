import { MessageSquarePlus, Sparkles } from "lucide-react";

export default function AIHeader({
  onNewConversation,
  hasConversation = false,
}) {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-slate-200
        bg-slate-50/95
        backdrop-blur-xl
        dark:border-slate-800
        dark:bg-slate-950/95
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-14
          w-full
          max-w-5xl
          items-center
          justify-between
          gap-3
          px-4
          sm:min-h-16
          sm:px-6
          lg:px-8
        "
      >
        {/* ============================================================
            AI IDENTITY
        ============================================================ */}

        <div className="flex min-w-0 items-center gap-3">
          {/* AI icon */}

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
              ring-1
              ring-emerald-100
              dark:bg-emerald-950/50
              dark:text-emerald-400
              dark:ring-emerald-900/50
            "
          >
            <Sparkles size={17} strokeWidth={1.9} aria-hidden="true" />
          </div>

          {/* Name + status */}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="
                  truncate
                  text-sm
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                CogniMart AI
              </h1>

              <span
                className="
                  hidden
                  rounded-full
                  bg-emerald-50
                  px-2
                  py-0.5
                  text-[9px]
                  font-semibold
                  text-emerald-700
                  sm:inline-flex
                  dark:bg-emerald-950/50
                  dark:text-emerald-400
                "
              >
                Shopping Assistant
              </span>
            </div>

            {/* Status */}

            <div
              className="
                mt-0.5
                flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-500
                "
                aria-hidden="true"
              />

              <span
                className="
                  text-[10px]
                  text-slate-400
                "
              >
                Ready to help
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            ACTIONS
        ============================================================ */}

        {hasConversation && (
          <button
            type="button"
            onClick={onNewConversation}
            className="
              inline-flex
              h-9
              shrink-0
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-xs
              font-semibold
              text-slate-600
              shadow-sm
              transition-colors
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-700
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500
              focus-visible:ring-offset-2
              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:border-emerald-900
              dark:hover:bg-emerald-950/30
              dark:hover:text-emerald-400
              dark:focus-visible:ring-offset-slate-950
            "
          >
            <MessageSquarePlus size={15} aria-hidden="true" />

            <span className="hidden sm:inline">New conversation</span>

            <span className="sm:hidden">New</span>
          </button>
        )}
      </div>
    </header>
  );
}
