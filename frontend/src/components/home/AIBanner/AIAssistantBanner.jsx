import { motion } from "motion/react";
import { Bot, Sparkles } from "lucide-react";

import AIBannerContent from "./AIBannerContent";

export default function AIAssistantBanner() {
  return (
    <section className="bg-white py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-gradient-to-r
            from-emerald-600
            via-teal-600
            to-cyan-600
            px-6
            py-8
            shadow-xl
            shadow-emerald-600/10
            sm:px-8
            sm:py-10
            lg:px-12
            lg:py-12
          "
        >
          {/* Glow */}
          <motion.div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              bg-white/15
              blur-3xl
            "
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Decorative circles */}
          <div className="pointer-events-none absolute right-20 top-10 hidden h-32 w-32 rounded-full border border-white/10 sm:block" />
          <div className="pointer-events-none absolute right-32 top-20 hidden h-20 w-20 rounded-full border border-white/10 sm:block" />

          {/* Floating icons */}
          <motion.div
            className="
              pointer-events-none
              absolute
              bottom-8
              right-12
              hidden
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-white/20
              bg-white/10
              text-white
              backdrop-blur-md
              lg:flex
            "
            animate={{
              y: [0, -8, 0],
              rotate: [0, 4, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Bot size={21} />
          </motion.div>

          <motion.div
            className="
              pointer-events-none
              absolute
              right-52
              top-8
              hidden
              text-white/60
              lg:block
            "
            animate={{
              y: [0, -6, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={20} />
          </motion.div>

          <AIBannerContent />
        </motion.div>
      </div>
    </section>
  );
}