import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex h-12 w-full overflow-hidden rounded-xl border border-gray-300 bg-white">

      <select className="border-r border-gray-300 px-4 text-sm outline-none">
        <option>All</option>
        <option>Electronics</option>
        <option>Fashion</option>
        <option>Mobiles</option>
        <option>Groceries</option>
      </select>

      <input
        type="text"
        placeholder="Search products..."
        className="flex-1 px-4 outline-none"
      />

      <button className="flex w-14 items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition">
        <Search size={20} />
      </button>

    </div>
  );
};

export default SearchBar;
