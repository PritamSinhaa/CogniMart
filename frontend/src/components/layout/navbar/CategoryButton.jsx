import { Menu } from "lucide-react";

const CategoryButton = () => {
  return (
    <button className="flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600">
      <Menu size={20} />
      <span>All Categories</span>
    </button>
  );
};

export default CategoryButton;