import { Bot } from "lucide-react";

import { NavLink } from "react-router-dom";

const NAVIGATION_LINKS = [
  {
    label: "Home",
    to: "/",
    end: true,
  },
  {
    label: "Products",
    to: "/products",
  },
  {
    label: "Categories",
    to: "/categories",
  },
  {
    label: "Deals",
    to: "/deals",
  },
];

export default function DesktopNav() {
  return (
    <div className="flex h-full items-center gap-7">
      {NAVIGATION_LINKS.map((link) => (
        <NavigationLink key={link.to} {...link} />
      ))}

      <NavLink
        to="/ai-assistant"
        className={({ isActive }) =>
          `group relative flex h-full items-center gap-1.5 text-xs font-semibold transition-colors ${
            isActive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors ${
                isActive
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-500/10 dark:group-hover:text-emerald-400"
              }`}
            >
              <Bot size={12} strokeWidth={2} />
            </span>

            <span>AI Assistant</span>

            {isActive && <ActiveIndicator />}
          </>
        )}
      </NavLink>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Navigation link
|--------------------------------------------------------------------------
*/

function NavigationLink({ label, to, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative flex h-full items-center text-xs font-semibold transition-colors ${
          isActive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {label}

          {isActive && <ActiveIndicator />}
        </>
      )}
    </NavLink>
  );
}

/*
|--------------------------------------------------------------------------
| Active underline
|--------------------------------------------------------------------------
*/

function ActiveIndicator() {
  return (
    <span
      aria-hidden="true"
      className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-emerald-600 dark:bg-emerald-400"
    />
  );
}
