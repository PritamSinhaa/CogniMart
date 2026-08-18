import { motion } from "motion/react";

import HeroContent from "./HeroContent";
import HeroRobot from "./HeroRobot";
import FloatingElements from "./FloatingElements";

export default function Hero() {
  return (
    <section
      id="home"
      className="
        relative
        isolate
        overflow-hidden
        bg-white
        dark:bg-slate-950
      "
    >
      {/* Background gradient */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-[radial-gradient(circle_at_75%_45%,rgba(16,185,129,0.12),transparent_35%)]
          dark:bg-[radial-gradient(circle_at_75%_45%,rgba(16,185,129,0.10),transparent_35%)]
        "
      />

      {/* Decorative grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          opacity-[0.025]
          dark:opacity-[0.04]
          [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]
          [background-size:48px_48px]
        "
      />

      <div
        className="
          mx-auto
          grid
          min-h-[calc(100vh-4rem)]
          max-w-[1600px]
          items-center
          gap-10
          px-5
          py-16
          sm:px-8
          lg:grid-cols-[1fr_0.9fr]
          lg:px-12
          lg:py-20
          xl:px-16
        "
      >
        {/* Left side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          <HeroContent />
        </motion.div>

        {/* Right side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative"
        >
          <FloatingElements />

          <HeroRobot />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-24
          bg-gradient-to-t
          from-white
          to-transparent
          dark:from-slate-950
        "
      />
    </section>
  );
}