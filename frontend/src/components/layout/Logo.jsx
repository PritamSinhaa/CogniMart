import { NavLink } from "react-router-dom";

function Logo() {
  return (
    <NavLink
      to="/"
      className="text-2xl font-bold tracking-tight text-foreground transition-colors"
    >
      <span className="text-primary">Cogni</span>Mart
    </NavLink>
  );
}

export default Logo;