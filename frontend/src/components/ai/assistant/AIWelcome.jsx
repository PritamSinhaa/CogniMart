import {
  Gift,
  Headphones,
  Laptop,
  Sparkles,
} from "lucide-react";

import AIBadge from "../shared/AIBadge";
import AISuggestionChip from "./AISuggestionChip";

const suggestions = [
  {
    id: "headphones",
    icon: Headphones,
    label: "Find the best headphones",
    prompt:
      "Find me the best headphones for my needs.",
  },
  {
    id: "laptop",
    icon: Laptop,
    label: "Help me choose a laptop",
    prompt:
      "Help me choose the right laptop.",
  },
  {
    id: "gift",
    icon: Gift,
    label: "Help me find a gift",
    prompt:
      "Help me find a great gift.",
  },
];

export default function AIWelcome({
  onSuggestion,
}) {
  return (
    <section className="px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14">
      <div className="mx-auto w-full max-w-3xl">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-emerald-50
              text-emerald-600
              shadow-sm
              ring-1
              ring-emerald-100
              dark:bg-emerald-950/50
              dark:text-emerald-400
              dark:ring-emerald-900/50
            "
          >
            <Sparkles size={28} strokeWidth={1.8} />
          </div>

          <div className="mt-5">
            <AIBadge />
          </div>

          <h1
            className="
              mt-5
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
              sm:text-4xl
              dark:text-white
            "
          >
            What can I help you find?
          </h1>

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
            Tell me what you're looking for and I'll help
            you discover, compare, and choose the right
            products.
          </p>
        </div>

        {/* Suggestions */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {suggestions.map((suggestion) => (
            <AISuggestionChip
              key={suggestion.id}
              icon={suggestion.icon}
              onClick={() =>
                onSuggestion?.(suggestion.prompt)
              }
            >
              {suggestion.label}
            </AISuggestionChip>
          ))}
        </div>
      </div>
    </section>
  );
}