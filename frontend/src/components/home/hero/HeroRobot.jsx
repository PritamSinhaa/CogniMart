import { motion } from "motion/react";

const HERO_IMAGE = "/images/cognimart-ai-commerce.png";

export default function HeroRobot() {
  return (
    <div className="relative mx-auto flex w-full max-w-2xl items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute h-[70%] w-[70%] rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10"
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
          y: 18,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full"
      >
        <img
          src={HERO_IMAGE}
          alt="CogniMart intelligent multi-agent shopping platform"
          draggable="false"
          className="h-auto w-full select-none object-contain drop-shadow-[0_24px_35px_rgba(5,150,105,0.16)]"
        />
      </motion.div>
    </div>
  );
}
