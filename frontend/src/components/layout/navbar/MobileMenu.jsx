import { AnimatePresence, motion } from "motion/react";
import { Bot, Heart, Search, User } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
];

export default function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
          className="overflow-hidden border-t border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="space-y-1 px-4 py-4">
            <div className="mb-4 flex h-10 items-center rounded-full border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-900">
              <Search size={16} className="mr-2 text-slate-400" />

              <input
                type="search"
                placeholder="Search products..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {links.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`block rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  index === 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                }`}
              >
                {link.label}
              </a>
            ))}

            <a
              href="/ai-assistant"
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <Bot size={17} />
              AI Assistant
            </a>

            <div className="my-2 border-t border-slate-200 dark:border-slate-800" />

            <a
              href="/wishlist"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <Heart size={17} />
              Wishlist
            </a>

            <a
              href="/login"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <User size={17} />
              Login
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
