import { Button } from "@/components/ui/button";
import { ArrowRight, Bot } from "lucide-react";

function HeroButtons() {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
      <Button
        size="lg"
        className="group px-8 font-semibold shadow-lg shadow-primary/20"
      >
        Shop Now

        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="px-8 font-semibold"
      >
        <Bot className="mr-2 h-5 w-5" />
        Try AI Assistant
      </Button>
    </div>
  );
}

export default HeroButtons;