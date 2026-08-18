export default function AIComparisonRow({
  label,
  values = [],
  highlightIndex = null,
}) {
  return (
    <div
      className="
        grid
        grid-cols-[110px_repeat(var(--comparison-columns),minmax(130px,1fr))]
        border-t
        border-slate-200
        dark:border-slate-800
      "
      style={{
        "--comparison-columns": values.length,
      }}
    >
      {/* Attribute */}
      <div
        className="
          flex
          items-center
          px-3
          py-3.5
          text-xs
          font-semibold
          text-slate-500
          dark:text-slate-400
        "
      >
        {label}
      </div>

      {/* Values */}
      {values.map((value, index) => (
        <div
          key={`${label}-${index}`}
          className={`
            flex
            items-center
            px-3
            py-3.5
            text-xs
            ${
              highlightIndex === index
                ? "font-semibold text-emerald-700 dark:text-emerald-400"
                : "text-slate-700 dark:text-slate-300"
            }
          `}
        >
          {value}
        </div>
      ))}
    </div>
  );
}