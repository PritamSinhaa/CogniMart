import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="mx-auto hidden max-w-xl flex-1 md:block">
      <div className="group flex h-9 items-center rounded-full border border-slate-200 bg-slate-50 px-3 transition-all duration-300 focus-within:border-emerald-400 focus-within:bg-white focus-within:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:focus-within:bg-slate-800">
        <Search
          size={15}
          className="mr-2 shrink-0 text-slate-400 transition-colors group-focus-within:text-emerald-600"
        />

        <input
          type="search"
          placeholder="Search for products, brands and more..."
          className="min-w-0 flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          aria-label="Search products"
        />

        <button
          type="button"
          aria-label="Search"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-all duration-200 hover:scale-105 hover:bg-emerald-700"
        >
          <Search size={12} />
        </button>
      </div>
    </div>
  );
}
