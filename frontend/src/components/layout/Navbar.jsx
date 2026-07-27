import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import ActionButtons from "./ActionButtons";
import MobileMenu from "./MobileMenu";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">

        {/* Logo */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="ml-10 hidden lg:block">
          <NavLinks />
        </div>

        {/* Desktop Search */}
        <div className="mx-8 hidden flex-1 md:flex">
          <SearchBar />
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex">
          <ActionButtons />
        </div>

        {/* Mobile Menu */}
        <div className="ml-auto lg:hidden">
          <MobileMenu />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="border-t px-4 py-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}

export default Navbar;
