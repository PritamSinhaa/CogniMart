import Container from "@/components/common/Container";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import HeaderActions from "./HeaderActions";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container>
        <div className="flex h-20 items-center gap-8">

          <Logo />

          <div className="flex-1">
            <SearchBar />
          </div>

          <HeaderActions />

        </div>
      </Container>
    </header>
  );
};

export default Header;