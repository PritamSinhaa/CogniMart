import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
    >
      <Quote
        className="absolute right-7 top-7 text-blue-100"
        size={42}
        fill="currentColor"
      />

      {/* Rating */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className={
              index < testimonial.rating
                ? "text-yellow-400"
                : "text-gray-200"
            }
            fill={
              index < testimonial.rating
                ? "currentColor"
                : "none"
            }
          />
        ))}
      </div>

      {/* Review */}
      <p className="mt-6 min-h-[120px] leading-7 text-gray-600">
        "{testimonial.review}"
      </p>

      {/* Customer */}
      <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
          {testimonial.initials}
        </div>

        <div>
          <h3 className="font-bold">
            {testimonial.name}
          </h3>

          <p className="text-sm text-gray-400">
            {testimonial.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;