import HeroButtons from "./HeroButtons";
import HeroImage from "./HeroImage";
import { Star, ShieldCheck, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(76,124,86,0.08),transparent_60%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col-reverse items-center gap-16 px-4 py-16 md:px-6 lg:flex-row lg:py-24">
        {/* Left Content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary shadow-sm">
            <Sparkles className="h-4 w-4" />
            AI Powered Shopping
          </span>

          <h1 className="mt-8 max-w-2xl text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
            Find{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Smarter.
            </span>
            <br />
            Shop Better.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Discover products, compare prices, and receive AI-powered
            recommendations tailored specifically to your shopping needs.
          </p>

          <HeroButtons />

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.9 Rating</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-medium">50K+ Products</span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium">500+ Brands</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex flex-1 justify-center">
          <HeroImage />
        </div>
      </div>
    </section>
  );
}

export default Hero;