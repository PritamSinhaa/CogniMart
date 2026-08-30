function createInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function UserAvatar({
  user,
  size = "md",
}) {
  const initials =
    createInitials(user?.name) ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
        ? "h-16 w-16 text-xl"
        : "h-9 w-9 text-sm";

  return (
    <div
      className={`
        flex
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-emerald-100
        font-bold
        text-emerald-700
        ring-2
        ring-emerald-600/10
        dark:bg-emerald-500/10
        dark:text-emerald-400
        ${sizeClass}
      `}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}