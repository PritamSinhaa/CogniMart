import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const SaleProductCard = ({ product }) => {
  const Icon = product.icon;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative flex h-48 items-center justify-center bg-gray-50">
        <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
          -{product.discount}%
        </span>

        <Icon
          size={90}
          strokeWidth={1.2}
          className="text-blue-600"
        />
      </div>

      {/* Product Details */}
      <div className="p-5">
        <p className="text-sm text-gray-400">
          {product.category}
        </p>

        <h3 className="mt-1 font-bold">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <span className="text-sm text-gray-400 line-through">
            ₹{product.oldPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Stock */}
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-gray-500">
              Only {product.stock} left
            </span>

            <span className="font-medium text-red-500">
              Hurry!
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-red-500"
              style={{
                width: `${Math.min(product.stock * 4, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Button */}
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default SaleProductCard;