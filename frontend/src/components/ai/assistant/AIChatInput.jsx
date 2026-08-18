import {
  ArrowUp,
  Paperclip,
} from "lucide-react";
import { useState } from "react";

export default function AIChatInput({
  onSubmit,
  disabled = false,
  placeholder = "Ask CogniMart AI anything...",
}) {
  const [value, setValue] = useState("");

  const submitMessage = () => {
    const message = value.trim();

    if (!message || disabled) {
      return;
    }

    onSubmit?.(message);
    setValue("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
      <div className="mx-auto w-full max-w-3xl">
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-2
            shadow-lg
            shadow-slate-200/40
            transition-all
            focus-within:border-emerald-300
            focus-within:ring-4
            focus-within:ring-emerald-500/10
            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/20
            dark:focus-within:border-emerald-800
          "
        >
          <div className="flex items-end gap-2">
            {/* Attachment */}
            <button
              type="button"
              disabled={disabled}
              aria-label="Attach file"
              className="
                mb-0.5
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-slate-400
                transition-colors
                hover:bg-slate-100
                hover:text-slate-700
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:hover:bg-slate-800
                dark:hover:text-slate-200
              "
            >
              <Paperclip size={18} />
            </button>

            {/* Input */}
            <textarea
              value={value}
              onChange={(event) =>
                setValue(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={disabled}
              rows={1}
              placeholder={placeholder}
              className="
                max-h-32
                min-h-10
                flex-1
                resize-none
                border-0
                bg-transparent
                px-1
                py-2.5
                text-sm
                leading-5
                text-slate-900
                outline-none
                placeholder:text-slate-400
                disabled:cursor-not-allowed
                dark:text-white
                dark:placeholder:text-slate-500
              "
            />

            {/* Send */}
            <button
              type="button"
              onClick={submitMessage}
              disabled={!value.trim() || disabled}
              aria-label="Send message"
              className="
                mb-0.5
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-600
                text-white
                shadow-sm
                transition-all
                hover:bg-emerald-700
                active:scale-95
                disabled:cursor-not-allowed
                disabled:bg-slate-200
                disabled:text-slate-400
                dark:disabled:bg-slate-800
                dark:disabled:text-slate-600
              "
            >
              <ArrowUp size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
          CogniMart AI can make mistakes. Check important
          information before making a purchase.
        </p>
      </div>
    </div>
  );
}