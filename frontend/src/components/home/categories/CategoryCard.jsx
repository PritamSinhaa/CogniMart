import { motion } from "framer-motion";

const CategoryCard = ({ category }) => {
  const Icon = category.icon;

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
    >
      <div
        className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${category.color}`}
      >
        <Icon size={30} />
      </div>

      <h3 className="text-lg font-semibold">
        {category.title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {category.products}
      </p>
    </motion.div>
  );
};

export default CategoryCard;