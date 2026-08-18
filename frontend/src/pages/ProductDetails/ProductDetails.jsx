import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductPurchaseCard from "./ProductPurchaseCard";

import { getProductById } from "../../data/products";

export default function ProductDetails() {
  const { id } = useParams();

  const product = getProductById(id);

  const [quantity, setQuantity] = useState(1);

  /* Product doesn't exist */

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The product you're looking for doesn't exist.
          </p>

          <Link
            to="/products"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-emerald-700
            "
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}

      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-[1600px] px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
          <Link
            to="/products"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition-colors
              hover:text-emerald-600
              dark:text-slate-400
              dark:hover:text-emerald-400
            "
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>
        </div>
      </div>

      {/* Product */}

      <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12 xl:px-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(400px,0.9fr)] xl:gap-16">
          {/* Gallery */}

          <ProductGallery
            images={product.images}
            productName={product.name}
          />

          {/* Information */}

          <div className="space-y-8">
            <ProductInfo product={product} />

            <ProductPurchaseCard
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>
        </div>
      </main>
    </div>
  );
}