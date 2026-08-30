import {
  useEffect,
  useState,
} from "react";

import { getProducts } from "../api/products.api";
import { mapProducts } from "../lib/productMapper";

function extractProducts(response) {
  return (
    response?.data?.products ||
    response?.products ||
    response?.data ||
    []
  );
}

export default function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts(
          params,
          {
            signal: controller.signal,
          },
        );

        const rawProducts =
          extractProducts(response);

        setProducts(
          mapProducts(rawProducts),
        );
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setError(
          error?.data?.message ||
            error?.message ||
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
  }, []);

  return {
    products,
    loading,
    error,
  };
}