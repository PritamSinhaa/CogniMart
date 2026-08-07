import { Menu } from "lucide-react";

const MobileMenu = () => {
  return (
    <button className="lg:hidden">
      <Menu size={24} />
    </button>
  );
};

export default MobileMenu;