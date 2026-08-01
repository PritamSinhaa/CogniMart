import { ShieldCheck, Sparkles, Star } from "lucide-react";

function HeroStats() {
  const stats = [
    {
      icon: Star,
      label: "4.9 Rating",
      iconClass: "fill-yellow-400 text-yellow-400",
    },
    {
      icon: ShieldCheck,
      label: "50K+ Products",
      iconClass: "text-primary",
    },
    {
      icon: Sparkles,
      label: "500+ Brands",
      iconClass: "text-primary",
    },
  ];

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.label} className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${item.iconClass}`} />
            <span className="font-medium">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default HeroStats;