import { Gift, Headphones, Laptop, Sparkles } from "lucide-react";

import AIBadge from "../shared/AIBadge";
import AISuggestionChip from "./AISuggestionChip";

const suggestions = [
  {
    id: "headphones",
    icon: Headphones,
    label: "Find the best headphones",
    prompt: "Find me the best headphones for my needs.",
  },
  {
    id: "laptop",
    icon: Laptop,
    label: "Help me choose a laptop",
    prompt: "Help me choose the right laptop.",
  },
  {
    id: "gift",
    icon: Gift,
    label: "Help me find a gift",
    prompt: "Help me find a great gift.",
  },
];

export default function AIWelcome({ onSuggestion }) {
  return (
    <section
      aria-labelledby="ai-welcome-title"
      className="
        w-full
        px-4
        pb-8
        pt-8
        sm:px-6
        sm:pb-10
        sm:pt-12
        lg:pt-14
      "
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* ============================================================
            HERO
        ============================================================ */}

        <div className="flex flex-col items-center text-center">
          {/* AI Icon */}

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-emerald-50
              text-emerald-600
              shadow-sm
              ring-1
              ring-emerald-100
              sm:h-16
              sm:w-16
              dark:bg-emerald-950/50
              dark:text-emerald-400
              dark:ring-emerald-900/50
            "
          >
            <Sparkles
              size={26}
              strokeWidth={1.8}
              className="sm:h-7 sm:w-7"
              aria-hidden="true"
            />
          </div>

          {/* AI Badge */}

          <div className="mt-4 sm:mt-5">
            <AIBadge />
          </div>

          {/* Heading */}

          <h1
            id="ai-welcome-title"
            className="
              mt-4
              max-w-2xl
              text-2xl
              font-bold
              tracking-tight
              text-slate-950
              sm:mt-5
              sm:text-3xl
              md:text-4xl
              dark:text-white
            "
          >
            What can I help you find?
          </h1>

          {/* Description */}

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-slate-500
              sm:text-base
              dark:text-slate-400
            "
          >
            Tell me what you're looking for and I'll help you discover, compare,
            and choose the right products.
          </p>
        </div>

        {/* ============================================================
            SUGGESTIONS
        ============================================================ */}

        <div className="mt-7 sm:mt-8">
          <p
            className="
              mb-3
              text-center
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-slate-400
            "
          >
            Try asking me
          </p>

          <div
            className="
              grid
              grid-cols-1
              gap-2.5
              sm:grid-cols-3
              sm:gap-3
            "
          >
            {suggestions.map((suggestion) => (
              <AISuggestionChip
                key={suggestion.id}
                icon={suggestion.icon}
                onClick={() => onSuggestion?.(suggestion.prompt)}
              >
                {suggestion.label}
              </AISuggestionChip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
