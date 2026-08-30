import { useCallback, useEffect, useState } from "react";

import {
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from "../api/products.api";

import { mapProducts } from "../lib/productMapper";

function extractResult(response) {
  return {
    products: response?.data?.products || response?.products || [],

    pagination: response?.data?.pagination || response?.pagination || null,
  };
}

export default function useAdminProducts() {
  const [products, setProducts] = useState([]);

  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const loadProducts = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminProducts(
        {
          page: 1,
          limit: 100,
          sort: "newest",
        },
        {
          signal,
        },
      );

      const result = extractResult(response);

      setProducts(mapProducts(result.products));

      setPagination(result.pagination);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      setError(
        error?.data?.message || error?.message || "Unable to load products.",
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadProducts]);

  const deactivate = async (productId) => {
    try {
      setUpdatingId(productId);
      setError("");

      await deleteProduct(productId);

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                isActive: false,
              }
            : product,
        ),
      );
    } catch (error) {
      setError(
        error?.data?.message ||
          error?.message ||
          "Unable to deactivate product.",
      );

      throw error;
    } finally {
      setUpdatingId(null);
    }
  };

  const activate = async (productId) => {
    try {
      setUpdatingId(productId);
      setError("");

      await updateProduct(productId, {
        isActive: true,
      });

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                isActive: true,
              }
            : product,
        ),
      );
    } catch (error) {
      setError(
        error?.data?.message || error?.message || "Unable to activate product.",
      );

      throw error;
    } finally {
      setUpdatingId(null);
    }
  };

  const refresh = () => {
    loadProducts();
  };

  return {
    products,
    pagination,
    loading,
    error,
    updatingId,
    activate,
    deactivate,
    refresh,
  };
}
