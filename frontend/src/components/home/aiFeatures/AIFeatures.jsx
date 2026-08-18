import {
  Bot,
  Search,
  Sparkles,
  Tags,
} from "lucide-react";

import AIFeatureCard from "./AIFeatureCard";

const features = [
  {
    icon: Bot,
    title: "AI Recommendations",
    description: "Personalized for you",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find exactly what you need",
  },
  {
    icon: Sparkles,
    title: "Review Analysis",
    description: "AI-powered product insights",
  },
  {
    icon: Tags,
    title: "Price Comparison",
    description: "Get the best deals",
  },
];

export default function AIFeatures() {
  return (
    <section className="bg-white py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <AIFeatureCard
              key={feature.title}
              {...feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}