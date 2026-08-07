import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import HeroButtons from "./HeroButtons";

const HeroContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -70 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col justify-center"
    >
      {/* Badge */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-medium text-blue-600">
          <Sparkles size={16} />
          AI Powered Shopping
        </span>
      </motion.div>

      {/* Heading */}

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="max-w-xl text-6xl font-extrabold leading-[1.05] tracking-tight lg:text-7xl"
      >
        Shop Smarter
        <br />

        with{" "}

        <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          Artificial
          <br />
          Intelligence
        </span>
      </motion.h1>

      {/* Description */}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground"
      >
        Discover products faster using AI recommendations,
        compare prices, read AI summaries, and receive
        personalized shopping suggestions—all in one place.
      </motion.p>

      {/* Buttons */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-10"
      >
        <HeroButtons />
      </motion.div>

      {/* Stats */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-16 flex gap-12"
      >
        <div>
          <h3 className="text-3xl font-bold text-foreground">
            20K+
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Happy Customers
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-foreground">
            5K+
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Products
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-foreground">
            24/7
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            AI Assistant
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;