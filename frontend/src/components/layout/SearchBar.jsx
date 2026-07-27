import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        type="search"
        placeholder="Search products..."
        className="h-11 rounded-full border-border bg-card pl-10 focus-visible:ring-primary"
      />
    </div>
  );
}

export default SearchBar;
