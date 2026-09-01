import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../api/wishlist.api";

import { mapProduct } from "../lib/productMapper";

import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function extractWishlist(response) {
  return response?.data?.wishlist || response?.wishlist || null;
}

function normalizeWishlist(response) {
  const wishlist = extractWishlist(response);

  if (!Array.isArray(wishlist?.products)) {
    return [];
  }

  return wishlist.products.filter(Boolean).map(mapProduct).filter(Boolean);
}

function extractErrorMessage(error) {
  return (
    error?.data?.message ||
    error?.message ||
    "Something went wrong with your wishlist"
  );
}

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
*/

export function WishlistProvider({ children }) {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [updatingProductId, setUpdatingProductId] = useState(null);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Apply backend response
  |--------------------------------------------------------------------------
  */

  const applyWishlistResponse = useCallback((response) => {
    const normalizedItems = normalizeWishlist(response);

    setWishlistItems(normalizedItems);

    return normalizedItems;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Refresh wishlist
  |--------------------------------------------------------------------------
  */

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return [];
    }

    setLoading(true);
    setError("");

    try {
      const response = await getWishlist();

      return applyWishlistResponse(response);
    } catch (requestError) {
      setWishlistItems([]);

      setError(extractErrorMessage(requestError));

      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, applyWishlistResponse]);

  /*
  |--------------------------------------------------------------------------
  | Restore wishlist after authentication
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    /*
     * Clear only frontend state when
     * the customer logs out.
     *
     * The MongoDB wishlist remains
     * saved for the next login.
     */
    if (!isAuthenticated) {
      setWishlistItems([]);
      setError("");
      setUpdatingProductId(null);

      return;
    }

    let active = true;

    const loadWishlist = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getWishlist();

        if (!active) {
          return;
        }

        applyWishlistResponse(response);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setWishlistItems([]);

        setError(extractErrorMessage(requestError));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      active = false;
    };
  }, [
    authLoading,
    isAuthenticated,
    user?.id,
    user?._id,
    applyWishlistResponse,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Check whether a product is saved
  |--------------------------------------------------------------------------
  */

  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) {
        return false;
      }

      return wishlistItems.some(
        (item) => String(item.id) === String(productId),
      );
    },
    [wishlistItems],
  );

  /*
  |--------------------------------------------------------------------------
  | Add product
  |--------------------------------------------------------------------------
  */

  const addToWishlist = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        const authenticationError = new Error(
          "Please log in to save products to your wishlist",
        );

        authenticationError.status = 401;

        throw authenticationError;
      }

      const productId = product?._id || product?.id;

      if (!productId) {
        throw new Error("Invalid product");
      }

      /*
       * Avoid unnecessary API calls
       * when the local state already
       * contains this product.
       */
      if (isInWishlist(productId)) {
        return null;
      }

      setUpdatingProductId(String(productId));

      setError("");

      try {
        const response = await addWishlistItem(productId);

        applyWishlistResponse(response);

        return response;
      } catch (requestError) {
        /*
         * A 409 can happen when MongoDB
         * already contains the product
         * but local state was stale.
         */
        if (requestError?.status === 409) {
          await refreshWishlist();

          return null;
        }

        setError(extractErrorMessage(requestError));

        throw requestError;
      } finally {
        setUpdatingProductId(null);
      }
    },
    [isAuthenticated, isInWishlist, applyWishlistResponse, refreshWishlist],
  );

  /*
  |--------------------------------------------------------------------------
  | Remove product
  |--------------------------------------------------------------------------
  */

  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!isAuthenticated) {
        const authenticationError = new Error(
          "Please log in to manage your wishlist",
        );

        authenticationError.status = 401;

        throw authenticationError;
      }

      if (!productId) {
        throw new Error("Product ID is required");
      }

      /*
       * Removing an absent local item
       * can safely do nothing.
       */
      if (!isInWishlist(productId)) {
        return null;
      }

      setUpdatingProductId(String(productId));

      setError("");

      try {
        const response = await removeWishlistItem(productId);

        applyWishlistResponse(response);

        return response;
      } catch (requestError) {
        /*
         * If the item has already been
         * removed from MongoDB, refresh
         * stale frontend state.
         */
        if (requestError?.status === 404) {
          await refreshWishlist();

          return null;
        }

        setError(extractErrorMessage(requestError));

        throw requestError;
      } finally {
        setUpdatingProductId(null);
      }
    },
    [isAuthenticated, isInWishlist, applyWishlistResponse, refreshWishlist],
  );

  /*
  |--------------------------------------------------------------------------
  | Toggle product
  |--------------------------------------------------------------------------
  */

  const toggleWishlist = useCallback(
    async (product) => {
      const productId = product?._id || product?.id;

      if (!productId) {
        throw new Error("Invalid product");
      }

      if (isInWishlist(productId)) {
        return removeFromWishlist(productId);
      }

      return addToWishlist(product);
    },
    [isInWishlist, addToWishlist, removeFromWishlist],
  );

  /*
  |--------------------------------------------------------------------------
  | Clear wishlist
  |--------------------------------------------------------------------------
  |
  | Your backend does not currently
  | provide DELETE /wishlist.
  |
  | Therefore each saved product is
  | removed using the existing endpoint.
  |
  */

  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    if (wishlistItems.length === 0) {
      return;
    }

    const productIds = wishlistItems.map((item) => item.id);

    setLoading(true);
    setError("");

    try {
      await Promise.all(
        productIds.map((productId) => removeWishlistItem(productId)),
      );

      setWishlistItems([]);
    } catch (requestError) {
      setError(extractErrorMessage(requestError));

      /*
       * Some deletions may have
       * succeeded before another one
       * failed. Reload the authoritative
       * MongoDB state.
       */
      try {
        const response = await getWishlist();

        applyWishlistResponse(response);
      } catch {
        // Preserve the original error.
      }

      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, wishlistItems, applyWishlistResponse]);

  const clearWishlistError = useCallback(() => {
    setError("");
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Calculated values
  |--------------------------------------------------------------------------
  */

  const wishlistCount = wishlistItems.length;

  /*
  |--------------------------------------------------------------------------
  | Context value
  |--------------------------------------------------------------------------
  */

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount,

      loading,
      error,
      updatingProductId,

      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      refreshWishlist,
      clearWishlistError,
    }),
    [
      wishlistItems,
      wishlistCount,
      loading,
      error,
      updatingProductId,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      refreshWishlist,
      clearWishlistError,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
