import { motion } from "framer-motion";

const FloatingCard = ({
  image,
  title,
  subtitle,
  price,
  className = "",
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 4,
      }}
      className={`absolute rounded-2xl bg-background p-4 shadow-2xl ${className}`}
    >
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt=""
          className="h-16 w-16 rounded-xl object-cover"
        />

        <div>
          <h4 className="font-semibold">
            {title}
          </h4>

          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>

          <p className="mt-1 font-bold text-blue-600">
            {price}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingCard;