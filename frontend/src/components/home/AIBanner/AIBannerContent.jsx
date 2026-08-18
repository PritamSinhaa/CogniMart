import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function AIBannerContent() {
  return (
    <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          <Sparkles size={13} />
          Your AI Shopping Assistant
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Shop smarter with AI
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
          Get personalized recommendations, compare products,
          analyze reviews, and find the best products for your needs.
        </p>
      </div>

      <motion.a
        href="/ai-assistant"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="
          inline-flex
          h-11
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-full
          bg-white
          px-6
          text-sm
          font-semibold
          text-slate-950
          shadow-lg
          transition-shadow
          hover:shadow-xl
        "
      >
        Ask AI Assistant
        <ArrowRight size={16} />
      </motion.a>
    </div>
  );
}