import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 shrink-0"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
        <ShoppingBag size={24} />
      </div>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Cogni
          <span className="text-blue-600">Mart</span>
        </h1>

        <p className="text-xs text-gray-500">
          AI Powered Shopping
        </p>
      </div>
    </Link>
  );
};

export default Logo;