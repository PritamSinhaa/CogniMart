import {
  ArrowUpRight,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
} from "react-router-dom";

const FALLBACK_IMAGE =
  "/product-placeholder.svg";

export default function CategoryCard({
  category,
  index = 0,
}) {
  const {
    name,
    description,
    image,
  } = category;

  const handleImageError = (
    event,
  ) => {
    event.currentTarget.onerror =
      null;

    event.currentTarget.src =
      FALLBACK_IMAGE;
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.5,
        delay: Math.min(
          index * 0.07,
          0.35,
        ),
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      whileHover={{
        y: -5,
      }}
    >
      <Link
        to={`/products?category=${encodeURIComponent(
          name,
        )}`}
        aria-label={`Browse ${name} products`}
        className="group relative block min-h-[210px] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-shadow duration-300 hover:shadow-lg"
      >
        <img
          src={
            image ||
            FALLBACK_IMAGE
          }
          alt={name}
          loading="lazy"
          onError={
            handleImageError
          }
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

        <div className="absolute right-4 top-4 flex h-9 w-9 translate-x-2 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
          <ArrowUpRight
            size={17}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-lg font-bold text-white">
            {name}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80">
            {description ||
              `Explore products in ${name}.`}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}