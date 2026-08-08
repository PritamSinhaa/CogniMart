import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const BrandCard = ({ brand }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-blue-200 hover:shadow-lg"
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-2xl font-black text-gray-800 transition group-hover:bg-blue-600 group-hover:text-white">
        {brand.shortName}
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {brand.name}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {brand.description}
      </p>

      <div className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
        Explore
        <ArrowUpRight size={16} />
      </div>
    </motion.div>
  );
};

export default BrandCard;