import { ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: "1",
    name: "Sony WH-1000XM5",
    category: "Headphones",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80",
    sold: 248,
    revenue: "₹8,92,000",
  },
  {
    id: "2",
    name: "Mechanical Gaming Keyboard",
    category: "Keyboards",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&q=80",
    sold: 196,
    revenue: "₹4,86,000",
  },
  {
    id: "3",
    name: "Apple AirPods Pro",
    category: "Earbuds",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=200&q=80",
    sold: 174,
    revenue: "₹4,35,000",
  },
  {
    id: "4",
    name: "Logitech MX Master 3S",
    category: "Mouse",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=200&q=80",
    sold: 142,
    revenue: "₹1,84,000",
  },
  {
    id: "5",
    name: "Samsung 27-inch Monitor",
    category: "Monitors",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=200&q=80",
    sold: 118,
    revenue: "₹2,95,000",
  },
];

export default function AdminTopProducts() {
  const navigate = useNavigate();

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-b
          border-slate-100
          px-4
          py-4
          sm:px-5
          dark:border-slate-800
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-emerald-50
                text-emerald-600
                dark:bg-emerald-950/40
                dark:text-emerald-400
              "
            >
              <TrendingUp size={16} />
            </div>

            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Top Selling Products
            </h2>
          </div>

          <p className="mt-1 text-[11px] text-slate-400">
            Best performing products this month
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="
            inline-flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-emerald-600
            hover:text-emerald-700
            dark:text-emerald-400
          "
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Products */}

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            onClick={() => navigate(`/admin/products/${product.id}`)}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              transition-colors
              hover:bg-slate-50
              sm:px-5
              dark:hover:bg-slate-800/40
            "
          >
            {/* Rank */}

            <span
              className="
                w-5
                shrink-0
                text-center
                text-xs
                font-bold
                text-slate-400
              "
            >
              {index + 1}
            </span>

            {/* Image */}

            <div
              className="
                h-11
                w-11
                shrink-0
                overflow-hidden
                rounded-xl
                bg-slate-100
                dark:bg-slate-800
              "
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Product */}

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                {product.name}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {product.category}
              </p>
            </div>

            {/* Sales */}

            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {product.sold} sold
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {product.revenue}
              </p>
            </div>

            {/* Mobile revenue */}

            <div className="text-right sm:hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {product.revenue}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {product.sold} sold
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
