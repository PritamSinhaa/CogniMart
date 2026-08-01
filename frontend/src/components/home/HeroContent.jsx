import { Sparkles } from "lucide-react";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";

function HeroContent() {
  return (
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

      <HeroStats />
    </div>
  );
}

export default HeroContent;