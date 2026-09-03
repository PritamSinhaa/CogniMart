import { useEffect, useState } from "react";

import { getProductById } from "../api/products.api";

import { mapProduct } from "../lib/productMapper";

function extractProduct(response) {
  return response?.data?.product || response?.product || response?.data || null;
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to load product.";
}

export default function useProduct(productId) {
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      if (!productId) {
        setProduct(null);
        setError("");
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        setProduct(null);

        const response = await getProductById(productId, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        const rawProduct = extractProduct(response);

        const mappedProduct = mapProduct(rawProduct);

        if (!mappedProduct) {
          setNotFound(true);
          return;
        }

        setProduct(mappedProduct);
      } catch (requestError) {
        if (requestError?.name === "AbortError" || controller.signal.aborted) {
          return;
        }

        setProduct(null);

        if (requestError?.status === 404) {
          setNotFound(true);
          setError("");
          return;
        }

        setNotFound(false);

        setError(getErrorMessage(requestError));
      } finally {
        if (!controller.signal.aborted) {
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
