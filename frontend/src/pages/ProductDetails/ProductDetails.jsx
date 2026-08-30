import {
  useState,
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  PackageSearch,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductPurchaseCard from "./ProductPurchaseCard";

import useProduct from "../../hooks/useProduct";

export default function ProductDetails() {
  const { id } = useParams();

  const {
    product,
    loading,
    error,
    notFound,
  } = useProduct(id);

  const [quantity, setQuantity] =
    useState(1);

  if (loading) {
    return <ProductDetailsLoading />;
  }

  if (notFound) {
    return <ProductNotFound />;
  }

  if (error) {
    return (
      <ProductDetailsError
        message={error}
      />
    );
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ProductDetailsNavigation />

      <section className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12 xl:px-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(400px,0.9fr)] xl:gap-16">
          <ProductGallery
            images={product.images}
            productName={
              product.name
            }
          />

          <div className="space-y-8">
            <ProductInfo
              product={product}
            />

            <ProductPurchaseCard
              product={product}
              quantity={quantity}
              setQuantity={
                setQuantity
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductDetailsNavigation() {
  return (
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
  );
}

function ProductDetailsLoading() {
  return (
    <div
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div
          className="
            mx-auto
            h-9
            w-9
            animate-spin
            rounded-full
            border-2
            border-emerald-600
            border-t-transparent
          "
        />

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Loading product...
        </p>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5 dark:bg-slate-950">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900">
          <PackageSearch size={27} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">
          Product not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          This product may have been removed,
          deactivated or does not exist.
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

          Back to products
        </Link>
      </div>
    </div>
  );
}

function ProductDetailsError({
  message,
}) {
  return (
    <div
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5 dark:bg-slate-950"
      role="alert"
    >
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10">
          <AlertCircle size={27} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">
          Unable to load product
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {message}
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

          Back to products
        </Link>
      </div>
    </div>
  );
}