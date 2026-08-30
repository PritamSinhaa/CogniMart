import {
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { motion } from "motion/react";

import { useCart } from "../../context/CartContext";

import { useWishlist } from "../../context/WishlistContext";

export default function ProductPurchaseCard({
  product,
  quantity,
  setQuantity,
}) {
  const navigate = useNavigate();

  const addedTimerRef = useRef(null);

  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();

  const stock = Math.max(Number(product?.stock) || 0, 0);

  const price = Number(product?.price) || 0;

  const isOutOfStock = stock <= 0;

  const isLowStock = stock > 0 && stock <= 5;

  const isWishlisted = isInWishlist(product?.id);

  /*
   * Prevent a pending timer from trying to update
   * the component after the user leaves the page.
   */
  useEffect(() => {
    return () => {
      if (addedTimerRef.current) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  /*
   * Keep quantity valid if the loaded product's
   * stock changes.
   */
  useEffect(() => {
    if (isOutOfStock) {
      setQuantity(1);
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(Math.max(currentQuantity, 1), stock),
    );
  }, [stock, isOutOfStock, setQuantity]);

  const increaseQuantity = () => {
    if (isOutOfStock || quantity >= stock) {
      return;
    }

    setQuantity((currentQuantity) => Math.min(currentQuantity + 1, stock));
  };

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(currentQuantity - 1, 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock || !product?.id) {
      return;
    }

    addToCart(product, quantity);

    setAddedToCart(true);

    if (addedTimerRef.current) {
      window.clearTimeout(addedTimerRef.current);
    }

    addedTimerRef.current = window.setTimeout(() => {
      setAddedToCart(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock || !product?.id) {
      return;
    }

    addToCart(product, quantity);

    navigate("/cart");
  };

  const handleWishlist = () => {
    if (!product?.id) {
      return;
    }

    toggleWishlist(product);
  };

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        sm:p-6
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/*
       * Stock and wishlist
       */}
      <div className="flex items-center justify-between gap-3">
        <StockStatus
          stock={stock}
          isOutOfStock={isOutOfStock}
          isLowStock={isLowStock}
        />

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-200
            hover:scale-105
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-red-400
            focus-visible:ring-offset-2
            dark:focus-visible:ring-offset-slate-900
            ${
              isWishlisted
                ? "border-red-200 bg-red-50 text-red-500 dark:border-red-500/20 dark:bg-red-500/10"
                : "border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900 dark:hover:text-red-400"
            }
          `}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/*
       * Delivery
       */}
      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Truck size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Delivery available
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Final delivery charges will be calculated from your cart total.
            </p>
          </div>
        </div>
      </div>

      {/*
       * Quantity
       */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Quantity
          </p>

          {!isOutOfStock && (
            <span className="text-xs text-slate-400">{stock} available</span>
          )}
        </div>

        <div className="mt-3 flex w-fit items-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || isOutOfStock}
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center text-slate-500 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400"
          >
            <Minus size={15} />
          </button>

          <span className="flex h-11 w-11 items-center justify-center border-x border-slate-200 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= stock || isOutOfStock}
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center text-slate-500 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400"
          >
            <Plus size={15} />
          </button>
        </div>

        {!isOutOfStock && quantity >= stock && (
          <p className="mt-2 text-xs font-medium text-amber-500">
            Maximum available quantity reached.
          </p>
        )}
      </div>

      {/*
       * Total
       */}
      <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Total
        </span>

        <span className="text-lg font-bold text-slate-950 dark:text-white">
          ₹{(price * quantity).toLocaleString("en-IN")}
        </span>
      </div>

      {/*
       * Actions
       */}
      <div className="mt-5 grid gap-3">
        <motion.button
          type="button"
          whileTap={{
            scale: 0.98,
          }}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
        >
          {addedToCart ? (
            <>
              <Check size={17} />
              Added to Cart
            </>
          ) : isOutOfStock ? (
            "Out of stock"
          ) : (
            <>
              <ShoppingCart size={17} />
              Add to Cart
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{
            scale: 0.98,
          }}
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 transition-all hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-emerald-700 dark:hover:text-emerald-400"
        >
          <Zap size={17} />
          Buy Now
        </motion.button>
      </div>

      {/*
       * Information
       */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck
            size={16}
            className="shrink-0 text-emerald-600 dark:text-emerald-400"
          />

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Secure checkout
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Truck
            size={16}
            className="shrink-0 text-emerald-600 dark:text-emerald-400"
          />

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Product price and stock are checked again during checkout.
          </span>
        </div>
      </div>
    </div>
  );
}

function StockStatus({ stock, isOutOfStock, isLowStock }) {
  if (isOutOfStock) {
    return (
      <div className="flex items-center gap-2 text-sm font-semibold text-red-500">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Out of stock
      </div>
    );
  }

  if (isLowStock) {
    return (
      <div className="flex items-center gap-2 text-sm font-semibold text-orange-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
        Only {stock} left
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      In stock
    </div>
  );
}
