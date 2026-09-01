import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addCartItem,
  clearCartItems,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart.api";

import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function calculateFinalPrice(
  price,
  discount = 0,
) {
  const numericPrice = Math.max(
    Number(price) || 0,
    0,
  );

  const numericDiscount = Math.min(
    Math.max(
      Number(discount) || 0,
      0,
    ),
    100,
  );

  return Number(
    (
      numericPrice -
      (numericPrice *
        numericDiscount) /
        100
    ).toFixed(2),
  );
}

function normalizeCartItems(cart) {
  if (!Array.isArray(cart?.items)) {
    return [];
  }

  return cart.items
    .filter((item) => item?.product)
    .map((item) => {
      const product = item.product;

      const productId =
        product._id || product.id;

      const originalPrice = Math.max(
        Number(product.price) || 0,
        0,
      );

      const discount = Math.min(
        Math.max(
          Number(product.discount) ||
            0,
          0,
        ),
        100,
      );

      const price =
        calculateFinalPrice(
          originalPrice,
          discount,
        );

      const availableStock =
        Math.max(
          Number(product.stock) || 0,
          0,
        );

      const isActive =
        product.isActive !== false;

      const category =
        typeof product.category ===
        "object"
          ? product.category?.name ||
            ""
          : product.category || "";

      const images =
        Array.isArray(product.images)
          ? product.images.filter(
              Boolean,
            )
          : [];

      return {
        id: productId,
        _id: productId,

        slug:
          product.slug || "",

        name:
          product.name ||
          "Unnamed product",

        brand:
          product.brand || "",

        category,

        image:
          images[0] ||
          "/images/product-placeholder.png",

        images,

        /*
         * originalPrice = backend list price
         * price = discounted selling price
         */
        originalPrice,
        price,
        discount,

        quantity: Math.max(
          Number(item.quantity) || 1,
          1,
        ),

        availableStock,

        inStock:
          isActive &&
          availableStock > 0,

        isActive,
      };
    });
}

function extractCart(response) {
  return (
    response?.data?.cart ||
    response?.cart ||
    null
  );
}

function extractErrorMessage(error) {
  return (
    error?.data?.message ||
    error?.message ||
    "Something went wrong with your cart"
  );
}

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
*/

export function CartProvider({
  children,
}) {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  const [cartItems, setCartItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    updatingProductId,
    setUpdatingProductId,
  ] = useState(null);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Apply backend cart response
  |--------------------------------------------------------------------------
  */

  const applyCartResponse =
    useCallback((response) => {
      const cart =
        extractCart(response);

      setCartItems(
        normalizeCartItems(cart),
      );
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Refresh cart
  |--------------------------------------------------------------------------
  */

  const refreshCart =
    useCallback(async () => {
      if (!isAuthenticated) {
        setCartItems([]);
        return [];
      }

      setLoading(true);
      setError("");

      try {
        const response =
          await getCart();

        const cart =
          extractCart(response);

        const normalizedItems =
          normalizeCartItems(cart);

        setCartItems(
          normalizedItems,
        );

        return normalizedItems;
      } catch (requestError) {
        setError(
          extractErrorMessage(
            requestError,
          ),
        );

        throw requestError;
      } finally {
        setLoading(false);
      }
    }, [isAuthenticated]);

  /*
  |--------------------------------------------------------------------------
  | Load cart after authentication
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setCartItems([]);
      setError("");
      return;
    }

    let active = true;

    const loadCart = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await getCart();

        if (!active) {
          return;
        }

        applyCartResponse(response);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setCartItems([]);

        setError(
          extractErrorMessage(
            requestError,
          ),
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      active = false;
    };
  }, [
    authLoading,
    isAuthenticated,
    user?.id,
    user?._id,
    applyCartResponse,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Add product
  |--------------------------------------------------------------------------
  */

  const addToCart = async (
    product,
    quantity = 1,
  ) => {
    if (!isAuthenticated) {
      const authenticationError =
        new Error(
          "Please log in to add products to your cart",
        );

      authenticationError.status =
        401;

      throw authenticationError;
    }

    const productId =
      product?._id || product?.id;

    if (!productId) {
      throw new Error(
        "Invalid product",
      );
    }

    const numericQuantity =
      Math.max(
        Number(quantity) || 1,
        1,
      );

    setUpdatingProductId(
      String(productId),
    );

    setError("");

    try {
      const response =
        await addCartItem(
          productId,
          numericQuantity,
        );

      applyCartResponse(response);

      return response;
    } catch (requestError) {
      setError(
        extractErrorMessage(
          requestError,
        ),
      );

      throw requestError;
    } finally {
      setUpdatingProductId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Set exact quantity
  |--------------------------------------------------------------------------
  */

  const updateQuantity = async (
    productId,
    quantity,
  ) => {
    const numericQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        numericQuantity,
      )
    ) {
      const quantityError =
        new Error(
          "Quantity must be a whole number",
        );

      setError(
        quantityError.message,
      );

      throw quantityError;
    }

    if (numericQuantity <= 0) {
      return removeFromCart(
        productId,
      );
    }

    setUpdatingProductId(
      String(productId),
    );

    setError("");

    try {
      const response =
        await updateCartItem(
          productId,
          numericQuantity,
        );

      applyCartResponse(response);

      return response;
    } catch (requestError) {
      setError(
        extractErrorMessage(
          requestError,
        ),
      );

      throw requestError;
    } finally {
      setUpdatingProductId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Increase quantity
  |--------------------------------------------------------------------------
  */

  const increaseQuantity = async (
    productId,
  ) => {
    const cartItem =
      cartItems.find(
        (item) =>
          String(item.id) ===
          String(productId),
      );

    if (!cartItem) {
      return;
    }

    if (
      cartItem.quantity >=
      cartItem.availableStock
    ) {
      const stockError =
        new Error(
          `Only ${cartItem.availableStock} units are available`,
        );

      setError(
        stockError.message,
      );

      throw stockError;
    }

    return updateQuantity(
      productId,
      cartItem.quantity + 1,
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Decrease quantity
  |--------------------------------------------------------------------------
  */

  const decreaseQuantity = async (
    productId,
  ) => {
    const cartItem =
      cartItems.find(
        (item) =>
          String(item.id) ===
          String(productId),
      );

    if (!cartItem) {
      return;
    }

    /*
     * Quantity one is removed when the
     * customer presses minus.
     */
    if (cartItem.quantity <= 1) {
      return removeFromCart(
        productId,
      );
    }

    return updateQuantity(
      productId,
      cartItem.quantity - 1,
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Remove product
  |--------------------------------------------------------------------------
  */

  const removeFromCart = async (
    productId,
  ) => {
    setUpdatingProductId(
      String(productId),
    );

    setError("");

    try {
      const response =
        await removeCartItem(
          productId,
        );

      applyCartResponse(response);

      return response;
    } catch (requestError) {
      setError(
        extractErrorMessage(
          requestError,
        ),
      );

      throw requestError;
    } finally {
      setUpdatingProductId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Clear cart
  |--------------------------------------------------------------------------
  */

  const clearCart = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await clearCartItems();

      applyCartResponse(response);

      return response;
    } catch (requestError) {
      setError(
        extractErrorMessage(
          requestError,
        ),
      );

      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const clearCartError = () => {
    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Calculated values
  |--------------------------------------------------------------------------
  */

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (
        totalQuantity,
        item,
      ) =>
        totalQuantity +
        item.quantity,
      0,
    );
  }, [cartItems]);

  /*
   * Number of different products,
   * regardless of quantity.
   */
  const uniqueItemCount =
    cartItems.length;

  /*
   * Original total before product
   * discounts.
   */
  const originalSubtotal =
    useMemo(() => {
      return cartItems.reduce(
        (
          currentSubtotal,
          item,
        ) =>
          currentSubtotal +
          item.originalPrice *
            item.quantity,
        0,
      );
    }, [cartItems]);

  /*
   * Selling-price subtotal after
   * product discounts.
   */
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (
        currentSubtotal,
        item,
      ) =>
        currentSubtotal +
        item.price *
          item.quantity,
      0,
    );
  }, [cartItems]);

  const discount = Math.max(
    originalSubtotal - subtotal,
    0,
  );

  /*
   * Must match the backend order
   * service exactly.
   */
  const shippingFee =
    subtotal === 0 ||
    subtotal >= 1000
      ? 0
      : 50;

  /*
   * Product discount has already
   * been applied inside subtotal.
   */
  const total =
    subtotal + shippingFee;

  /*
  |--------------------------------------------------------------------------
  | Context value
  |--------------------------------------------------------------------------
  */

  const value = {
    cartItems,

    cartCount,
    uniqueItemCount,

    originalSubtotal,
    subtotal,
    discount,

    /*
     * Keep both temporarily because
     * existing components use both
     * property names.
     */
    delivery: shippingFee,
    shippingFee,

    total,

    loading,
    error,
    updatingProductId,

    addToCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    clearCartError,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}