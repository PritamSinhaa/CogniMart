import { NavLink } from "react-router-dom";

const links = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Deals", path: "/deals" },
  { name: "Products", path: "/products" },
  { name: "Brands", path: "/brands" },
  { name: "Contact", path: "/contact" },
];

const NavLinks = () => {
  return (
    <div className="hidden items-center gap-8 lg:flex">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `relative font-medium transition ${
              isActive
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
};

export default NavLinks;