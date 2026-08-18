import { Sparkles } from "lucide-react";

export default function AIIcon({
  size = 18,
  className = "",
}) {
  return (
    <Sparkles
      size={size}
      strokeWidth={2}
      aria-hidden="true"
      className={`text-emerald-600 dark:text-emerald-400 ${className}`}
    />
  );
}