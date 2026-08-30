import {
  useEffect,
  useState,
} from "react";

import {
  getCategories,
} from "../api/categories.api";

import {
  mapCategories,
} from "../lib/categoryMapper";

function extractCategories(response) {
  return (
    response?.data?.categories ||
    response?.categories ||
    response?.data ||
    []
  );
}

export default function useCategories() {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadCategories() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getCategories({
            signal:
              controller.signal,
          });

        const rawCategories =
          extractCategories(response);

        setCategories(
          mapCategories(
            rawCategories,
          ).filter(
            (category) =>
              category.isActive,
          ),
        );
      } catch (error) {
        if (
          error.name === "AbortError"
        ) {
          return;
        }

        setError(
          error?.data?.message ||
            error?.message ||
            "Unable to load categories.",
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    categories,
    loading,
    error,
  };
}