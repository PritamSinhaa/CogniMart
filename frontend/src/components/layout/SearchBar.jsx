import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="flex items-center gap-2">
      <Search />
      <Input className="flex-1" placeholder={"Search Products..."} />
    </div>
  );
}

export default SearchBar;
