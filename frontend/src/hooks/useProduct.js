import { useEffect, useState } from "react";

import { getProducts } from "../api/products.api";

import { mapProducts } from "../lib/productMapper";

function extractProducts(response) {
  return response?.data?.products || response?.products || response?.data || [];
}

function extractPagination(response) {
  return response?.data?.pagination || response?.pagination || null;
}

export default function useProducts(params = {}) {
  const [products, setProducts] = useState([]);

  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Converts the parameter object into a stable
   * dependency value.
   *
   * This prevents unnecessary API requests when a
   * component passes an object literal such as:
   *
   * useProducts({ limit: 6 })
   */
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    const controller = new AbortController();

    const requestParams = JSON.parse(paramsKey);

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts(requestParams, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        const rawProducts = extractProducts(response);

        setProducts(mapProducts(rawProducts));

        setPagination(extractPagination(response));
      } catch (requestError) {
        if (requestError?.name === "AbortError") {
          return;
        }

        setProducts([]);
        setPagination(null);

        setError(
          requestError?.data?.message ||
            requestError?.message ||
            "Unable to load products.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [paramsKey]);

  return {
    products,
    pagination,
    loading,
    error,
  };
}
