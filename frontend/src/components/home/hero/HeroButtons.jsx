import { ArrowRight, Bot } from "lucide-react";
import { motion } from "framer-motion";

const HeroButtons = () => {
  return (
    <div className="flex flex-wrap gap-5">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: .95 }}
        className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg"
      >
        <div className="flex items-center gap-2">
          Shop Now
          <ArrowRight size={18} />
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: .95 }}
        className="rounded-xl border px-8 py-4 font-semibold"
      >
        <div className="flex items-center gap-2">
          <Bot size={18}/>
          Ask AI Assistant
        </div>
      </motion.button>
    </div>
  );
};

export default HeroButtons;