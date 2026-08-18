import { motion } from "motion/react";
import robotImage from "../../../assets/images/cognimart-robot.svg";
export default function HeroRobot() {
  return (
    <div className="relative mx-auto flex w-full max-w-xl items-center justify-center">
      {/* Glow */}
      <motion.div
        className="
          absolute
          h-64
          w-64
          rounded-full
          bg-emerald-400/20
          blur-3xl
          sm:h-80
          sm:w-80
        "
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Robot */}
      <motion.div
        className="relative z-10 w-[75%] sm:w-[80%] lg:w-[90%]"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src={robotImage}
          alt="CogniMart AI shopping assistant"
          className="
            h-auto
            w-full
            object-contain
            drop-shadow-2xl
          "
        />
      </motion.div>
    </div>
  );
}