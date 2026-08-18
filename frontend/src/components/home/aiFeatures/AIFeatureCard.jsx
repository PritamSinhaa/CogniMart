import { motion } from "motion/react";

export default function AIFeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        transition-shadow
        duration-300
        hover:shadow-lg
        hover:shadow-slate-900/5
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:shadow-black/20
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-emerald-50
            text-emerald-600
            transition-transform
            duration-300
            group-hover:scale-105
            dark:bg-emerald-950/40
            dark:text-emerald-400
          "
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}