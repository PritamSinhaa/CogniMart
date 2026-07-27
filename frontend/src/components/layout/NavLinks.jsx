import { NavLink } from "react-router-dom";

function NavLinks() {
  const links = [
    { path: "/", text: "Home" },
    { path: "/products", text: "Products" },
    { path: "/categories", text: "Categories" },
  ];

  return (
    <>
      {links.map((item) => (
        <NavLink key={item.path} to={item.path}>
          {item.text}
        </NavLink>
      ))}
    </>
  );
}

export default NavLinks;