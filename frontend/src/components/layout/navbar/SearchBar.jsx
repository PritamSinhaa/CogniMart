import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";

  const [query, setQuery] = useState(urlSearch);

  /* =========================
     SYNC WITH URL
  ========================== */

  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  /* =========================
     PERFORM SEARCH
  ========================== */

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(trimmedQuery)}`,
    );
  };

  /* =========================
     KEYBOARD SEARCH
  ========================== */

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }

    if (event.key === "Escape") {
      setQuery("");
    }
  };

  /* =========================
     CLEAR SEARCH
  ========================== */

  const handleClear = () => {
    setQuery("");

    if (urlSearch) {
      navigate("/products");
    }
  };

  return (
    <div className="mx-auto hidden max-w-xl flex-1 md:block">
      <div
        className="
          group
          flex
          h-9
          items-center
          rounded-full
          border
          border-slate-200
          bg-slate-50
          px-3
          transition-all
          duration-300
          focus-within:border-emerald-400
          focus-within:bg-white
          focus-within:shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          dark:focus-within:bg-slate-800
        "
      >
        {/* Search Icon */}

        <Search
          size={15}
          className="
            mr-2
            shrink-0
            text-slate-400
            transition-colors
            group-focus-within:text-emerald-600
          "
        />

        {/* Input */}

        <input
          type="search"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Search for products, brands and more..."
          className="
            min-w-0
            flex-1
            bg-transparent
            text-xs
            text-slate-900
            outline-none
            placeholder:text-slate-400
            dark:text-white
          "
          aria-label="Search products"
        />

        {/* Clear */}

        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="
              mr-1
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-full
              text-slate-400
              transition-colors
              hover:bg-slate-200
              hover:text-slate-700
              dark:hover:bg-slate-700
              dark:hover:text-slate-200
            "
          >
            <X size={12} />
          </button>
        )}

        {/* Search Button */}

        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search"
          className="
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-emerald-600
            text-white
            transition-all
            duration-200
            hover:scale-105
            hover:bg-emerald-700
            active:scale-95
          "
        >
          <Search size={12} />
        </button>
      </div>
    </div>
  );
}