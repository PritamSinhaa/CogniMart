import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      aria-label="Go to CogniMart homepage"
      className="flex shrink-0 items-center gap-2"
    >
      <img
        src="/cognimart-logo.png"
        alt=""
        className="h-9 w-9 object-contain"
      />

      <span className="text-lg font-bold text-slate-900 dark:text-white">
        Cogni<span className="text-emerald-600">Mart</span>
      </span>
    </Link>
  );
}