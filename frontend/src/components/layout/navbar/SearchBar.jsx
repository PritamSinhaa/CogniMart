import { ChevronDown, Search, X } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import useCategories from "../../../hooks/useCategories";

export default function SearchBar() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { categories, loading: categoriesLoading } = useCategories();

  const urlSearch = searchParams.get("search") || "";

  const urlCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(urlSearch);

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);

  /*
  |--------------------------------------------------------------------------
  | Synchronize with URL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  /*
  |--------------------------------------------------------------------------
  | Submit search
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextParams = new URLSearchParams();

    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      nextParams.set("search", trimmedQuery);
    }

    if (selectedCategory) {
      nextParams.set("category", selectedCategory);
    }

    const queryString = nextParams.toString();

    navigate(queryString ? `/products?${queryString}` : "/products");
  };

  /*
  |--------------------------------------------------------------------------
  | Clear search text
  |--------------------------------------------------------------------------
  */

  const handleClearSearch = () => {
    setQuery("");

    const nextParams = new URLSearchParams();

    if (selectedCategory) {
      nextParams.set("category", selectedCategory);
    }

    const queryString = nextParams.toString();

    navigate(queryString ? `/products?${queryString}` : "/products");
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mx-auto flex h-10 w-full max-w-3xl items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:bg-slate-900"
    >
      {/* Search input */}

      <div className="flex min-w-0 flex-1 items-center px-3">
        <Search size={16} className="mr-2 shrink-0 text-slate-400" />

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for products..."
          aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />

        {query && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Divider */}

      <div className="h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />

      {/* Category selector */}

      <div className="relative hidden h-full w-44 shrink-0 items-center md:flex">
        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          disabled={categoriesLoading}
          aria-label="Product category"
          className="h-full w-full cursor-pointer appearance-none bg-transparent pl-4 pr-9 text-xs font-semibold text-slate-600 outline-none disabled:cursor-wait disabled:opacity-60 dark:text-slate-300"
        >
          <option value="">
            {categoriesLoading ? "Loading..." : "All categories"}
          </option>

          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 text-slate-400"
        />
      </div>

      {/* Submit */}

      <button
        type="submit"
        aria-label="Search products"
        className="flex h-full w-11 shrink-0 items-center justify-center bg-emerald-600 text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      >
        <Search size={16} />
      </button>
    </form>
  );
}
