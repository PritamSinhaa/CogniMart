import {
  ChevronRight,
  Heart,
  MapPin,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Total orders",
    value: "12",
    icon: Package,
    to: "/orders",
  },
  {
    label: "Wishlist",
    value: "4",
    icon: Heart,
    to: "/wishlist",
  },
  {
    label: "Saved addresses",
    value: "2",
    icon: MapPin,
    to: "/account/addresses",
  },
];

export default function AccountStats() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Link
            key={stat.label}
            to={stat.to}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                <Icon size={18} />
              </div>

              <ChevronRight
                size={16}
                className="text-slate-400 transition-colors group-hover:text-emerald-600"
              />
            </div>

            <p className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {stat.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
}