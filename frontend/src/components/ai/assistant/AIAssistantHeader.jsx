import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIAssistantHeader({
  onNewChat,
}) {
  const navigate = useNavigate();

  return (
    <header
      className="
        sticky
        top-0
        z-20
        border-b
        border-slate-200/80
        bg-white/90
        backdrop-blur-xl
        dark:border-slate-800
        dark:bg-slate-950/90
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-6xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500
              dark:text-slate-400
              dark:hover:bg-slate-900
              dark:hover:text-white
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-emerald-600
                text-white
                shadow-sm
              "
            >
              <Sparkles size={17} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">
                CogniMart AI
              </p>

              <p className="hidden text-[11px] text-slate-500 sm:block dark:text-slate-400">
                Your intelligent shopping assistant
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <button
          type="button"
          onClick={onNewChat}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            py-2
            text-sm
            font-medium
            text-slate-700
            transition-all
            hover:border-emerald-200
            hover:bg-emerald-50
            hover:text-emerald-700
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-emerald-500
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-slate-300
            dark:hover:border-emerald-900
            dark:hover:bg-emerald-950/40
            dark:hover:text-emerald-400
          "
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New chat</span>
        </button>
      </div>
    </header>
  );
}