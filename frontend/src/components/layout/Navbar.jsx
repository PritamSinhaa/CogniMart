import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import ActionButtons from "./ActionButtons";

function Navbar() {
  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Logo />

        <div className="hidden md:flex items-center gap-6">
  <NavLinks />
</div>

        <div className="flex-1 max-w-lg">
          <SearchBar />
        </div>

        <ActionButtons />
      </div>
    </nav>
  );
}

export default Navbar;
