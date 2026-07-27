import { NavLink } from "react-router-dom";

function NavLinks() {
  const links = [
    { path: "/", text: "Home" },
    { path: "/products", text: "Products" },
    { path: "/categories", text: "Categories" },
  ];

  return (
    <div className="flex items-center gap-8">
      {links.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            `relative pb-1 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-muted-foreground hover:border-primary/50 hover:text-primary"
            }`
          }
        >
          {item.text}
        </NavLink>
      ))}
    </div>
  );
}

export default NavLinks;