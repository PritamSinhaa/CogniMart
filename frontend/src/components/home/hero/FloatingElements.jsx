import { motion } from "motion/react";
import { Sparkles, Zap, ShoppingBag } from "lucide-react";

const floatingItems = [
  {
    icon: Sparkles,
    className: "left-2 top-12",
    delay: 0,
  },
  {
    icon: Zap,
    className: "right-8 top-20",
    delay: 0.8,
  },
  {
    icon: ShoppingBag,
    className: "bottom-20 left-10",
    delay: 1.4,
  },
];

export default function FloatingElements() {
  return (
    <>
      {floatingItems.map(
        ({ icon: Icon, className, delay }, index) => (
          <motion.div
            key={index}
            className={`absolute ${className} hidden sm:flex`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1, 0.9],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-2xl
                border
                border-white/60
                bg-white/80
                text-emerald-600
                shadow-lg
                shadow-slate-900/5
                backdrop-blur-sm
                dark:border-slate-700
                dark:bg-slate-900/80
              "
            >
              <Icon size={17} />
            </div>
          </motion.div>
        ),
      )}
    </>
  );
}