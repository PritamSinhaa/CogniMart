import Container from "@/components/common/Container";
import CategoryButton from "./CategoryButton";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">

          <CategoryButton />

          <NavLinks />

          <MobileMenu />

        </div>
      </Container>
    </nav>
  );
};

export default Navbar;