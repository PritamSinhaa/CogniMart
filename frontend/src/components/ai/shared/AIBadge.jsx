import AIIcon from "./AIIcon";

export default function AIBadge({
  children = "CogniMart AI",
}) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-emerald-200
        bg-emerald-50
        px-3
        py-1.5
        text-xs
        font-semibold
        text-emerald-700
        dark:border-emerald-900/60
        dark:bg-emerald-950/40
        dark:text-emerald-400
      "
    >
      <AIIcon size={13} />
      {children}
    </span>
  );
}