import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WishlistContext = createContext(null);

const STORAGE_KEY = "cognimart-wishlist";

const FALLBACK_IMAGE = "/favicon.svg";

function createWishlistItem(product) {
  return {
    id: String(product.id),
    name: product.name || "Unnamed product",
    slug: product.slug || "",
    category: product.category || "Uncategorized",
    brand: product.brand || "",
    price: Number(product.price) || 0,
    originalPrice: Number(product.originalPrice) || 0,
    discount: Number(product.discount) || 0,
    rating: Number(product.rating) || 0,
    reviews: Number(product.reviews) || 0,
    image: product.image || product.images?.[0] || FALLBACK_IMAGE,
    stock: Math.max(Number(product.stock) || 0, 0),
    specifications: product.specifications || {},
  };
}

function loadStoredWishlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && item.id && item.name)
      .map((item) => ({
        ...item,
        id: String(item.id),
        price: Number(item.price) || 0,
        originalPrice: Number(item.originalPrice) || 0,
        rating: Number(item.rating) || 0,
        reviews: Number(item.reviews) || 0,
        stock: Math.max(Number(item.stock) || 0, 0),
        image: item.image || FALLBACK_IMAGE,
      }));
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(loadStoredWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      // Wishlist remains available in memory.
    }
  }, [wishlistItems]);

  const addToWishlist = useCallback((product) => {
    if (!product?.id) {
      return;
    }

    setWishlistItems((currentItems) => {
      const productId = String(product.id);

      const exists = currentItems.some((item) => String(item.id) === productId);

      if (exists) {
        return currentItems;
      }

      return [...currentItems, createWishlistItem(product)];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((currentItems) =>
      currentItems.filter((item) => String(item.id) !== String(productId)),
    );
  }, []);

  const toggleWishlist = useCallback((product) => {
    if (!product?.id) {
      return;
    }

    setWishlistItems((currentItems) => {
      const productId = String(product.id);

      const exists = currentItems.some((item) => String(item.id) === productId);

      if (exists) {
        return currentItems.filter((item) => String(item.id) !== productId);
      }

      return [...currentItems, createWishlistItem(product)];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some(
        (item) => String(item.id) === String(productId),
      );
    },
    [wishlistItems],
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const wishlistCount = wishlistItems.length;

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    }),
    [
      wishlistItems,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
