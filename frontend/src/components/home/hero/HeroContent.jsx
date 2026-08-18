import { Sparkles } from "lucide-react";

import AnimatedHeadline from "./AnimatedHeadline";
import HeroActions from "./HeroActions";

export default function HeroContent() {
  return (
    <div className="relative z-20 max-w-2xl">
      {/* Badge */}
      <div
        className="
          mb-6
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-emerald-200
          bg-emerald-50
          px-3
          py-1.5
          text-xs
          font-semibold
          text-emerald-700
          dark:border-emerald-900
          dark:bg-emerald-950/40
          dark:text-emerald-400
        "
      >
        <Sparkles size={13} />

        AI-Powered Shopping
      </div>

      {/* Animated headline */}
      <AnimatedHeadline />

      {/* Description */}
      <p
        className="
          mt-5
          max-w-xl
          text-base
          leading-7
          text-slate-600
          sm:text-lg
          dark:text-slate-300
        "
      >
        Discover smarter ways to shop with personalized
        recommendations, intelligent product discovery,
        and your own AI shopping assistant.
      </p>

      {/* Buttons */}
      <div className="mt-8">
        <HeroActions />
      </div>

      {/* Small trust information */}
      <div
        className="
          mt-8
          flex
          flex-wrap
          items-center
          gap-x-6
          gap-y-3
          text-xs
          font-medium
          text-slate-500
          dark:text-slate-400
        "
      >
        <span>✦ Personalized recommendations</span>

        <span>✦ AI-powered discovery</span>

        <span>✦ Secure checkout</span>
      </div>
    </div>
  );
}