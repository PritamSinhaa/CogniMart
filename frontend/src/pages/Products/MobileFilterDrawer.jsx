import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import ProductFilters from "./ProductFilters";

export default function MobileFilterDrawer({
  open,
  onClose,
  filters,
  updateFilter,
  clearFilters,
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* ================= BACKDROP ================= */}

          <motion.button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="
              absolute
              inset-0
              h-full
              w-full
              cursor-default
              bg-slate-950/40
              backdrop-blur-sm
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* ================= DRAWER ================= */}

          <motion.aside
            initial={{
              x: "-100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "-100%",
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              bottom-0
              left-0
              top-0
              flex
              w-[88%]
              max-w-sm
              flex-col
              bg-white
              shadow-2xl
              dark:bg-slate-950
            "
          >
            {/* Header */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-slate-200
                px-5
                py-4
                dark:border-slate-800
              "
            >
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Filters
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Refine your results
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-slate-600
                  transition-colors
                  hover:bg-slate-200
                  dark:bg-slate-900
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* Filters */}

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <ProductFilters
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
              />
            </div>

            {/* Bottom action */}

            <div
              className="
                shrink-0
                border-t
                border-slate-200
                bg-white
                p-4
                dark:border-slate-800
                dark:bg-slate-950
              "
            >
              <button
                type="button"
                onClick={onClose}
                className="
                  h-11
                  w-full
                  rounded-xl
                  bg-emerald-600
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-emerald-700
                "
              >
                Apply Filters
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}