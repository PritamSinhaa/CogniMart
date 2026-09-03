import {
  Check,
  Heart,
  LoaderCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { motion } from "motion/react";

import { useCart } from "../../context/CartContext";

import { useWishlist } from "../../context/WishlistContext";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

function getErrorMessage(error, fallback) {
  return error?.data?.message || error?.message || fallback;
}

export default function ProductPurchaseCard({
  product,
  quantity,
  setQuantity,
}) {
  const navigate = useNavigate();

  const location = useLocation();

  const addedTimerRef = useRef(null);

  const [addingToCart, setAddingToCart] = useState(false);

  const [buyingNow, setBuyingNow] = useState(false);

  const [addedToCart, setAddedToCart] = useState(false);

  const [cartError, setCartError] = useState("");

  const [wishlistError, setWishlistError] = useState("");

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
    updatingProductId: wishlistUpdatingProductId,
  } = useWishlist();

  /*
  |--------------------------------------------------------------------------
  | Null-safe product information
  |--------------------------------------------------------------------------
  */

  const productId = product?._id || product?.id;

  const stock = Math.max(Number(product?.stock) || 0, 0);

  /*
   * product.price is already mapped
   * to the discounted selling price.
   */
  const price = Math.max(Number(product?.price) || 0, 0);

  const originalPrice = Math.max(Number(product?.originalPrice) || price, 0);

  const isActive = product?.isActive !== false;

  const isOutOfStock = !isActive || stock <= 0;

  const isLowStock = !isOutOfStock && stock <= 5;

  const isWishlisted = Boolean(productId) && isInWishlist(productId);

  const wishlistUpdating =
    Boolean(productId) &&
    String(wishlistUpdatingProductId) === String(productId);

  const cartUpdating = addingToCart || buyingNow;

  /*
  |--------------------------------------------------------------------------
  | Timer cleanup
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Keep quantity within stock
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!product) {
      return;
    }

    if (isOutOfStock) {
      setQuantity(1);
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(Math.max(Number(currentQuantity) || 1, 1), stock),
    );
  }, [product, stock, isOutOfStock, setQuantity]);

  /*
   * This return must remain after
   * every React hook.
   */
  if (!product) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Authentication redirect
  |--------------------------------------------------------------------------
  */

  const redirectToLogin = (message) => {
    navigate("/login", {
      state: {
        from: location.pathname,
        message,
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Quantity controls
  |--------------------------------------------------------------------------
  */

  const increaseQuantity = () => {
    if (isOutOfStock || quantity >= stock || cartUpdating) {
      return;
    }

    setQuantity((currentQuantity) => Math.min(currentQuantity + 1, stock));
  };

  const decreaseQuantity = () => {
    if (cartUpdating) {
      return;
    }

    setQuantity((currentQuantity) => Math.max(currentQuantity - 1, 1));
  };

  /*
  |--------------------------------------------------------------------------
  | Add to cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = async () => {
    if (isOutOfStock || !productId || cartUpdating) {
      return;
    }

    if (addedTimerRef.current) {
      window.clearTimeout(addedTimerRef.current);
    }

    setAddingToCart(true);
    setAddedToCart(false);
    setCartError("");

    try {
      await addToCart(
        {
          ...product,
          id: productId,
          _id: productId,
        },
        quantity,
      );

      setAddedToCart(true);

      addedTimerRef.current = window.setTimeout(() => {
        setAddedToCart(false);
      }, 1800);
    } catch (error) {
      if (error?.status === 401) {
        redirectToLogin("Please log in to add products to your cart.");

        return;
      }

      setCartError(
        getErrorMessage(error, "Unable to add this product to your cart."),
      );
    } finally {
      setAddingToCart(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Buy now
  |--------------------------------------------------------------------------
  */

  const handleBuyNow = async () => {
    if (isOutOfStock || !productId || cartUpdating) {
      return;
    }

    setBuyingNow(true);
    setCartError("");

    try {
      /*
       * Wait for MongoDB to confirm
       * the cart update before
       * navigating.
       */
      await addToCart(
        {
          ...product,
          id: productId,
          _id: productId,
        },
        quantity,
      );

      navigate("/cart");
    } catch (error) {
      if (error?.status === 401) {
        redirectToLogin("Please log in to buy this product.");

        return;
      }

      setCartError(
        getErrorMessage(error, "Unable to continue with this product."),
      );
    } finally {
      setBuyingNow(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Wishlist
  |--------------------------------------------------------------------------
  */

  const handleWishlist = async () => {
    if (!productId || wishlistUpdating) {
      return;
    }

    setWishlistError("");

    try {
      await toggleWishlist({
        ...product,
        id: productId,
        _id: productId,
      });
    } catch (error) {
      if (error?.status === 401) {
        redirectToLogin("Please log in to save products to your wishlist.");

        return;
      }

      setWishlistError(
        getErrorMessage(error, "Unable to update your wishlist."),
      );
    }
  };

  const totalPrice = price * quantity;

  const originalTotal = originalPrice * quantity;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <StockStatus
          stock={stock}
          isOutOfStock={isOutOfStock}
          isLowStock={isLowStock}
        />

        <button
          type="button"
          onClick={handleWishlist}
          disabled={!productId || wishlistUpdating}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
            isWishlisted
              ? "border-red-200 bg-red-50 text-red-500 dark:border-red-500/20 dark:bg-red-500/10"
              : "border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900 dark:hover:text-red-400"
          }`}
        >
          {wishlistUpdating ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          )}
        </button>
      </div>

      {wishlistError && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
        >
          {wishlistError}
        </p>
      )}

      <DeliveryInformation />

      <QuantitySelector
        quantity={quantity}
        stock={stock}
        isOutOfStock={isOutOfStock}
        cartUpdating={cartUpdating}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
      />

      <PriceTotal totalPrice={totalPrice} originalTotal={originalTotal} />

      {cartError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
        >
          {cartError}
        </p>
      )}

      <PurchaseActions
        addingToCart={addingToCart}
        addedToCart={addedToCart}
        buyingNow={buyingNow}
        isOutOfStock={isOutOfStock}
        cartUpdating={cartUpdating}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <PurchaseInformation />
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Delivery information
|--------------------------------------------------------------------------
*/

function DeliveryInformation() {
  return (
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
  );
}

/*
|--------------------------------------------------------------------------
| Quantity
|--------------------------------------------------------------------------
*/

function QuantitySelector({
  quantity,
  stock,
  isOutOfStock,
  cartUpdating,
  onIncrease,
  onDecrease,
}) {
  return (
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
          onClick={onDecrease}
          disabled={quantity <= 1 || isOutOfStock || cartUpdating}
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
          onClick={onIncrease}
          disabled={quantity >= stock || isOutOfStock || cartUpdating}
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
  );
}

/*
|--------------------------------------------------------------------------
| Price total
|--------------------------------------------------------------------------
*/

function PriceTotal({ totalPrice, originalTotal }) {
  return (
    <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
      <span className="text-sm text-slate-500 dark:text-slate-400">Total</span>

      <div className="text-right">
        <span className="block text-lg font-bold text-slate-950 dark:text-white">
          {formatPrice(totalPrice)}
        </span>

        {originalTotal > totalPrice && (
          <span className="block text-xs text-slate-400 line-through">
            {formatPrice(originalTotal)}
          </span>
        )}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

function PurchaseActions({
  addingToCart,
  addedToCart,
  buyingNow,
  isOutOfStock,
  cartUpdating,
  onAddToCart,
  onBuyNow,
}) {
  return (
    <div className="mt-5 grid gap-3">
      <motion.button
        type="button"
        whileTap={{
          scale: 0.98,
        }}
        onClick={onAddToCart}
        disabled={isOutOfStock || cartUpdating}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
      >
        {addingToCart ? (
          <>
            <LoaderCircle size={17} className="animate-spin" />
            Adding...
          </>
        ) : addedToCart ? (
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
        onClick={onBuyNow}
        disabled={isOutOfStock || cartUpdating}
        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 transition-all hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-emerald-700 dark:hover:text-emerald-400"
      >
        {buyingNow ? (
          <>
            <LoaderCircle size={17} className="animate-spin" />
            Preparing...
          </>
        ) : (
          <>
            <Zap size={17} />
            Buy Now
          </>
        )}
      </motion.button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Purchase information
|--------------------------------------------------------------------------
*/

function PurchaseInformation() {
  return (
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
  );
}

/*
|--------------------------------------------------------------------------
| Stock status
|--------------------------------------------------------------------------
*/

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
