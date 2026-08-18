import {
  ChevronRight,
  Heart,
  Lock,
  LogOut,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    label: "Profile",
    icon: User,
    to: "/account/profile",
    active: true,
  },
  {
    label: "Orders",
    icon: Package,
    to: "/orders",
  },
  {
    label: "Wishlist",
    icon: Heart,
    to: "/wishlist",
  },
  {
    label: "Addresses",
    icon: MapPin,
    to: "/account/addresses",
  },
  {
    label: "Security",
    icon: Lock,
    to: "/account/security",
  },
];

export default function AccountSidebar() {
  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon size={17} />

              <span className="flex-1">{item.label}</span>

              <ChevronRight size={14} />
            </Link>
          );
        })}
      </div>

      <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
      >
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  );
}