import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const Icon = product.icon;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-xl"
    >
      {/* Product Image */}
      <div className="relative flex h-64 items-center justify-center bg-gray-50">
        <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {product.badge}
        </span>

        <button className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-sm transition hover:text-red-500">
          <Heart size={18} />
        </button>

        <Icon
          size={110}
          strokeWidth={1.2}
          className="text-blue-600 transition duration-300 group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm text-gray-400">
            {product.category}
          </p>

          <h3 className="mt-1 text-lg font-bold">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-semibold">
              {product.rating}
            </span>
          </div>

          <span className="text-sm text-gray-400">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <span className="text-sm text-gray-400 line-through">
            ₹{product.oldPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Add to Cart */}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;