import { cn } from "../../lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 sm:mb-10",
        centered && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          {eyebrow}
        </span>
      )}

      <div
        className={cn(
          "flex w-full flex-col gap-4",
          action && "sm:flex-row sm:items-end sm:justify-between"
        )}
      >
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {title}
          </h2>

          {description && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}