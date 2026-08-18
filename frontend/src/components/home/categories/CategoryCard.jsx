import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function CategoryCard({
  name,
  description,
  image,
  index = 0,
}) {
  const categorySlug = name.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
    >
      <Link
        to={`/products?category=${encodeURIComponent(categorySlug)}`}
        className="
          group
          relative
          block
          min-h-[210px]
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-muted
          shadow-sm
          transition-shadow
          duration-300
          hover:shadow-lg
        "
      >
        {/* Background image */}
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-105
          "
        />

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/80
            via-black/25
            to-transparent
          "
        />

        {/* Arrow */}
        <div
          className="
            absolute
            right-4
            top-4
            flex
            h-9
            w-9
            translate-x-2
            items-center
            justify-center
            rounded-full
            bg-white/90
            text-slate-900
            opacity-0
            shadow-lg
            transition-all
            duration-300
            group-hover:translate-x-0
            group-hover:opacity-100
          "
        >
          <ArrowUpRight size={17} />
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-lg font-bold text-white">
            {name}
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/75">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}