import { motion } from "framer-motion";

const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
    >
      <div
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg}`}
      >
        <Icon className={feature.color} size={30} />
      </div>

      <h3 className="mb-3 text-xl font-bold">
        {feature.title}
      </h3>

      <p className="leading-7 text-gray-500">
        {feature.description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;