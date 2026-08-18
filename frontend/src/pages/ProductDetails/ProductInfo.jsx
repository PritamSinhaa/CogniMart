import { Check, Star } from "lucide-react";

export default function ProductInfo({ product }) {
  return (
    <div>
      {/* Category */}

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
        {product.category}
      </p>

      {/* Name */}

      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl dark:text-white">
        {product.name}
      </h1>

      {/* Brand */}

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        Brand:{" "}
        <span className="font-medium text-slate-900 dark:text-slate-200">
          {product.brand}
        </span>
      </p>

      {/* Rating */}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 dark:bg-amber-950/30">
          <Star
            size={15}
            className="fill-amber-400 text-amber-400"
          />

          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            {product.rating}
          </span>
        </div>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          {product.reviews.toLocaleString()} reviews
        </span>
      </div>

      {/* Price */}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-bold text-slate-950 dark:text-white">
          ₹{product.price.toLocaleString("en-IN")}
        </span>

        <span className="text-base text-slate-400 line-through">
          ₹{product.originalPrice.toLocaleString("en-IN")}
        </span>

        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          {product.discount}% OFF
        </span>
      </div>

      {/* Description */}

      <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-400">
        {product.description}
      </p>

      {/* Features */}

      <div className="mt-7">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Key features
        </h2>

        <ul className="mt-4 space-y-3">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Check size={12} strokeWidth={3} />
              </span>

              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}