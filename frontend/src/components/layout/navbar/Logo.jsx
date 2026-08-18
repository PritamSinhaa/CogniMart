import { Bot } from "lucide-react";

export default function Logo() {
  return (
    <a
      href="/"
      className="group flex shrink-0 items-center gap-2"
      aria-label="CogniMart home"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
        <Bot size={17} strokeWidth={2.2} />
      </div>

      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        Cogni<span className="text-emerald-600">Mart</span>
      </span>
    </a>
  );
}