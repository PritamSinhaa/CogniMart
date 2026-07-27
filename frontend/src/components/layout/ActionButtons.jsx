import { Button } from "@/components/ui/button";
import { Bot, Heart, ShoppingCart, User } from "lucide-react";
import { NavLink } from "react-router-dom";

function ActionButtons() {
  const buttons = [
    {
      icon: Heart,
      path: "/wishlist",
      label: "Wishlist",
    },
    {
      icon: ShoppingCart,
      path: "/cart",
      label: "Cart",
    },
    {
      icon: Bot,
      path: "/ai",
      label: "AI",
    },
    {
      icon: User,
      path: "/login",
      label: "Login",
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {buttons.map((item) => {
        const Icon = item.icon;

        return (
          <Button
            key={item.path}
            variant="ghost"
            asChild
            className="px-3"
          >
            <NavLink
              to={item.path}
              className="flex items-center gap-2"
            >
              <Icon className="h-5 w-5" />

              {/* Show labels only on xl screens */}
              <span className="hidden xl:inline text-sm font-medium">
                {item.label}
              </span>
            </NavLink>
          </Button>
        );
      })}
    </div>
  );
}

export default ActionButtons;