import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WishlistContext = createContext(null);

const STORAGE_KEY = "cognimart-wishlist";

/* =====================================================
   WISHLIST PROVIDER
===================================================== */

export function WishlistProvider({ children }) {
  /* =====================================================
     LOAD FROM LOCAL STORAGE
  ===================================================== */

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      console.log("📥 INITIAL LOCAL STORAGE:", saved);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        console.warn(
          "⚠️ Wishlist data is not an array"
        );

        return [];
      }

      console.log(
        "📦 INITIAL WISHLIST:",
        parsed
      );

      return parsed;
    } catch (error) {
      console.error(
        "❌ Failed to load wishlist:",
        error
      );

      return [];
    }
  });

  /* =====================================================
     SAVE TO LOCAL STORAGE
  ===================================================== */

  useEffect(() => {
    try {
      const serializedWishlist =
        JSON.stringify(wishlistItems);

      localStorage.setItem(
        STORAGE_KEY,
        serializedWishlist
      );

      console.log(
        "💾 SAVED TO LOCAL STORAGE:",
        serializedWishlist
      );
    } catch (error) {
      console.error(
        "❌ Failed to save wishlist:",
        error
      );
    }
  }, [wishlistItems]);

  /* =====================================================
     ADD TO WISHLIST
  ===================================================== */

  const addToWishlist = (product) => {
    if (!product || product.id === undefined) {
      console.error(
        "❌ Invalid product:",
        product
      );

      return;
    }

    setWishlistItems((currentItems) => {
      const exists = currentItems.some(
        (item) =>
          String(item.id) ===
          String(product.id)
      );

      if (exists) {
        console.log(
          "⚠️ Product already in wishlist"
        );

        return currentItems;
      }

      const updatedItems = [
        ...currentItems,
        product,
      ];

      console.log(
        "❤️ ADDING PRODUCT:",
        updatedItems
      );

      return updatedItems;
    });
  };

  /* =====================================================
     REMOVE FROM WISHLIST
  ===================================================== */

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) => {
      const updatedItems =
        currentItems.filter(
          (item) =>
            String(item.id) !==
            String(productId)
        );

      console.log(
        "💔 REMOVED PRODUCT:",
        updatedItems
      );

      return updatedItems;
    });
  };

  /* =====================================================
     TOGGLE WISHLIST
  ===================================================== */

  const toggleWishlist = (product) => {
    if (!product || product.id === undefined) {
      console.error(
        "❌ Cannot toggle invalid product:",
        product
      );

      return;
    }

    console.log(
      "🔥 TOGGLE CALLED:",
      product.id
    );

    setWishlistItems((currentItems) => {
      console.log(
        "📦 CURRENT ITEMS:",
        currentItems
      );

      const exists = currentItems.some(
        (item) =>
          String(item.id) ===
          String(product.id)
      );

      console.log(
        "🔎 PRODUCT EXISTS:",
        exists
      );

      let updatedItems;

      if (exists) {
        updatedItems =
          currentItems.filter(
            (item) =>
              String(item.id) !==
              String(product.id)
          );

        console.log(
          "💔 REMOVING FROM WISHLIST"
        );
      } else {
        updatedItems = [
          ...currentItems,
          product,
        ];

        console.log(
          "❤️ ADDING TO WISHLIST"
        );
      }

      console.log(
        "✅ NEW WISHLIST:",
        updatedItems
      );

      return updatedItems;
    });
  };

  /* =====================================================
     CHECK WISHLIST
  ===================================================== */

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) =>
        String(item.id) ===
        String(productId)
    );
  };

  /* =====================================================
     CLEAR WISHLIST
  ===================================================== */

  const clearWishlist = () => {
    console.log(
      "🗑️ CLEARING WISHLIST"
    );

    setWishlistItems([]);
  };

  /* =====================================================
     COUNT
  ===================================================== */

  const wishlistCount = useMemo(
    () => wishlistItems.length,
    [wishlistItems]
  );

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {
    wishlistItems,
    wishlistCount,

    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/* =====================================================
   CUSTOM HOOK
===================================================== */

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}