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

function calculateFinalPrice(price, discount = 0) {
  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;

  return Number(
    (numericPrice - (numericPrice * numericDiscount) / 100).toFixed(2),
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

      const originalPrice = Number(product.price) || 0;
      const discount = Number(product.discount) || 0;
      const price = calculateFinalPrice(originalPrice, discount);

      return {
        id: product._id || product.id,
        _id: product._id || product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand || "",
        category: product.category?.name || product.category || "",
        image: product.images?.[0] || "/images/product-placeholder.png",
        images: product.images || [],
        originalPrice,
        price,
        discount,
        quantity: Number(item.quantity) || 1,
        availableStock: Number(product.stock) || 0,
        inStock: product.isActive !== false && Number(product.stock) > 0,
        isActive: product.isActive !== false,
      };
    });
}

function extractCart(response) {
  return response?.data?.cart || response?.cart || null;
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

export function CartProvider({ children }) {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Apply backend cart response
  |--------------------------------------------------------------------------
  */

  const applyCartResponse = useCallback((response) => {
    const cart = extractCart(response);

    setCartItems(normalizeCartItems(cart));
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load cart
  |--------------------------------------------------------------------------
  */

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return [];
    }

    setLoading(true);
    setError("");

    try {
      const response = await getCart();
      const cart = extractCart(response);
      const normalizedItems = normalizeCartItems(cart);

      setCartItems(normalizedItems);

      return normalizedItems;
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /*
  |--------------------------------------------------------------------------
  | Restore cart after authentication is restored
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setCartItems([]);
      setError("");
      return;
    }

    let active = true;

    const loadCart = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getCart();

        if (!active) {
          return;
        }

        applyCartResponse(response);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setCartItems([]);
        setError(extractErrorMessage(requestError));
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
  }, [authLoading, user?._id, applyCartResponse]);

  /*
  |--------------------------------------------------------------------------
  | Add product
  |--------------------------------------------------------------------------
  */

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      const authenticationError = new Error(
        "Please log in to add products to your cart",
      );

      authenticationError.status = 401;

      throw authenticationError;
    }

    const productId = product?._id || product?.id;

    if (!productId) {
      throw new Error("Invalid product");
    }

    setUpdatingProductId(String(productId));
    setError("");

    try {
      const response = await addCartItem(productId, quantity);

      applyCartResponse(response);

      return response;
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
      throw requestError;
    } finally {
      setUpdatingProductId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Set an exact quantity
  |--------------------------------------------------------------------------
  */

  const updateQuantity = async (productId, quantity) => {
    const numericQuantity = Number(quantity);

    if (numericQuantity <= 0) {
      return removeFromCart(productId);
    }

    setUpdatingProductId(String(productId));
    setError("");

    try {
      const response = await updateCartItem(productId, numericQuantity);

      applyCartResponse(response);

      return response;
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
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

  const increaseQuantity = async (productId) => {
    const cartItem = cartItems.find(
      (item) => String(item.id) === String(productId),
    );

    if (!cartItem) {
      return;
    }

    if (cartItem.quantity >= cartItem.availableStock) {
      const stockError = new Error(
        `Only ${cartItem.availableStock} units are available`,
      );

      setError(stockError.message);

      throw stockError;
    }

    return updateQuantity(productId, cartItem.quantity + 1);
  };

  /*
  |--------------------------------------------------------------------------
  | Decrease quantity
  |--------------------------------------------------------------------------
  */

  const decreaseQuantity = async (productId) => {
    const cartItem = cartItems.find(
      (item) => String(item.id) === String(productId),
    );

    if (!cartItem) {
      return;
    }

    if (cartItem.quantity <= 1) {
      return removeFromCart(productId);
    }

    return updateQuantity(productId, cartItem.quantity - 1);
  };

  /*
  |--------------------------------------------------------------------------
  | Remove product
  |--------------------------------------------------------------------------
  */

  const removeFromCart = async (productId) => {
    setUpdatingProductId(String(productId));
    setError("");

    try {
      const response = await removeCartItem(productId);

      applyCartResponse(response);

      return response;
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
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
      const response = await clearCartItems();

      applyCartResponse(response);

      return response;
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
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
      (totalQuantity, item) => totalQuantity + item.quantity,
      0,
    );
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (currentSubtotal, item) => currentSubtotal + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  /*
   * These values now match your backend order service.
   */
  const shippingFee = subtotal === 0 || subtotal >= 1000 ? 0 : 50;

  const total = subtotal + shippingFee;

  const value = {
    cartItems,
    cartCount,
    subtotal,

    // Keep both names temporarily for existing components.
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
