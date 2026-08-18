import { Bot } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Deals", to: "/deals" },
];

export default function DesktopNav() {
  return (
    <div className="hidden items-center gap-6 lg:flex">
      {links.map((link) => (
        <NavLink
          key={link.label}
          to={link.to}
          end={link.to === "/"}
          className={({ isActive }) =>
            `relative py-5 text-[13px] font-medium transition-colors ${
              isActive
                ? "text-emerald-600"
                : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {link.label}

              {isActive && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-emerald-600" />
              )}
            </>
          )}
        </NavLink>
      ))}

      <NavLink
        to="/ai-assistant"
        className={({ isActive }) =>
          `flex items-center gap-1.5 text-[13px] font-medium transition-colors ${
            isActive
              ? "text-emerald-600"
              : "text-slate-600 hover:text-emerald-600 dark:text-slate-300"
          }`
        }
      >
        <Bot size={15} />
        AI Assistant
      </NavLink>
    </div>
  );
}