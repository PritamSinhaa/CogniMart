import {
  Bot,
  Heart,
  Home,
  Menu,
  Moon,
  ShoppingCart,
  Shapes,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function MobileMenu() {
  const navigation = [
    {
      title: "Home",
      path: "/",
      icon: Home,
    },
    {
      title: "Products",
      path: "/products",
      icon: ShoppingCart,
    },
    {
      title: "Categories",
      path: "/categories",
      icon: Shapes,
    },
  ];

  const actions = [
    {
      title: "Wishlist",
      path: "/wishlist",
      icon: Heart,
    },
    {
      title: "AI Assistant",
      path: "/ai",
      icon: Bot,
    },
    {
      title: "Login",
      path: "/login",
      icon: User,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-[300px] flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="border-b px-6 py-6 text-left">
          <SheetTitle className="text-3xl font-bold text-primary">
            CogniMart
          </SheetTitle>

          <p className="text-sm text-muted-foreground">
            AI Powered Shopping
          </p>
        </SheetHeader>

        {/* Search */}
        

        {/* Navigation */}
        <div className="px-3 py-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-accent"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="mx-4 border-t" />

        {/* Actions */}
        <div className="flex-1 px-3 py-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account
          </p>

          <div className="space-y-1">
            {actions.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-accent"
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <Moon className="h-5 w-5" />
            Dark Mode
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;