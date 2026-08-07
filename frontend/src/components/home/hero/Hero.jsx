import Container from "@/components/common/Container";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <Container>
        <div className="grid min-h-[calc(100vh-210px)] items-center gap-20 lg:grid-cols-2">
          <HeroContent />
          <HeroImage />
        </div>
      </Container>
    </section>
  );
};

export default Hero;