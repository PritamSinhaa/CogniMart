import { Heart, ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";

const HeaderActions = () => {
  return (
    <div className="flex items-center gap-6">

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart className="h-6 w-6 text-gray-700 hover:text-red-500 transition-colors" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors" />

        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
          0
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <User className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors" />
      </motion.button>

    </div>
  );
};

export default HeaderActions;