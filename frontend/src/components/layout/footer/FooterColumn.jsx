export default function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="
                text-sm
                text-slate-500
                transition-colors
                duration-200
                hover:text-emerald-600
                dark:text-slate-400
                dark:hover:text-emerald-400
              "
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}