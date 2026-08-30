import {
  useEffect,
  useState,
} from "react";

import {
  getProductById,
} from "../api/products.api";

import {
  mapProduct,
} from "../lib/productMapper";

function extractProduct(response) {
  return (
    response?.data?.product ||
    response?.product ||
    response?.data ||
    null
  );
}

export default function useProduct(productId) {
  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [notFound, setNotFound] =
    useState(false);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setNotFound(true);
      return undefined;
    }

    const controller =
      new AbortController();

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);

        const response =
          await getProductById(
            productId,
            {
              signal:
                controller.signal,
            },
          );

        const rawProduct =
          extractProduct(response);

        if (!rawProduct) {
          setProduct(null);
          setNotFound(true);
          return;
        }

        setProduct(
          mapProduct(rawProduct),
        );
      } catch (error) {
        if (
          error.name === "AbortError"
        ) {
          return;
        }

        if (error.status === 404) {
          setProduct(null);
          setNotFound(true);
          return;
        }

        setError(
          error?.data?.message ||
            error?.message ||
            "Unable to load this product.",
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      controller.abort();
    };
  }, [productId]);

  return {
    product,
    loading,
    error,
    notFound,
  };
}