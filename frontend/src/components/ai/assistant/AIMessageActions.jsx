import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

export default function AIMessageActions({
  content,
  onHelpful,
  onNotHelpful,
}) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = async () => {
    if (!content) {
      return;
    }

    try {
      await navigator.clipboard.writeText(content);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy AI response:", error);
    }
  };

  const handleHelpful = () => {
    setFeedback("helpful");
    onHelpful?.();
  };

  const handleNotHelpful = () => {
    setFeedback("not-helpful");
    onNotHelpful?.();
  };

  return (
    <div
      className="
        mt-2
        flex
        flex-wrap
        items-center
        gap-1
      "
    >
      {/* Copy */}

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied response" : "Copy response"}
        className="
          inline-flex
          h-8
          items-center
          gap-1.5
          rounded-lg
          px-2
          text-[11px]
          font-medium
          text-slate-400
          transition-colors
          hover:bg-slate-100
          hover:text-slate-700
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-emerald-500
          dark:hover:bg-slate-900
          dark:hover:text-slate-200
        "
      >
        {copied ? (
          <Check size={13} aria-hidden="true" />
        ) : (
          <Copy size={13} aria-hidden="true" />
        )}

        <span>{copied ? "Copied" : "Copy"}</span>
      </button>

      {/* Helpful */}

      <button
        type="button"
        onClick={handleHelpful}
        aria-label="Mark response as helpful"
        aria-pressed={feedback === "helpful"}
        className={`
          inline-flex
          h-8
          items-center
          gap-1.5
          rounded-lg
          px-2
          text-[11px]
          font-medium
          transition-colors
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-emerald-500
          ${
            feedback === "helpful"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          }
        `}
      >
        <ThumbsUp size={13} aria-hidden="true" />
        <span>Helpful</span>
      </button>

      {/* Not helpful */}

      <button
        type="button"
        onClick={handleNotHelpful}
        aria-label="Mark response as not helpful"
        aria-pressed={feedback === "not-helpful"}
        className={`
          inline-flex
          h-8
          items-center
          gap-1.5
          rounded-lg
          px-2
          text-[11px]
          font-medium
          transition-colors
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-emerald-500
          ${
            feedback === "not-helpful"
              ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          }
        `}
      >
        <ThumbsDown size={13} aria-hidden="true" />
        <span>Not helpful</span>
      </button>
    </div>
  );
}