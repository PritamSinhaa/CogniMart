import {
  BadgeDollarSign,
  Bot,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

function HeroImage() {
  return (
    <div className="relative flex h-[500px] w-full max-w-xl items-center justify-center">

      {/* Glow */}
      <div className="absolute h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      {/* Main Card */}
      <div className="relative z-10 w-80 rounded-3xl border bg-card p-6 shadow-2xl animate-[float_6s_ease-in-out_infinite]">

        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-3">
            <Bot className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              AI Shopping Assistant
            </h3>

            <p className="text-muted-foreground">
              Ready to help
            </p>
          </div>
        </div>

        <div className="space-y-4">

          <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span>Best Products</span>
            </div>

            <Sparkles className="h-4 w-4 text-primary" />
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
            <div className="flex items-center gap-3">
              <BadgeDollarSign className="h-5 w-5 text-primary" />
              <span>Lowest Price</span>
            </div>

            <span className="font-semibold text-primary">
              95%
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span>Fast Delivery</span>
            </div>

            <span className="font-semibold">
              24h
            </span>
          </div>
        </div>
      </div>

      {/* Rating Card */}
      <div className="absolute left-0 top-8 rounded-2xl border bg-card p-5 shadow-xl animate-[float_5s_ease-in-out_infinite]">

        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-2xl font-bold">
            4.9
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          AI Recommendations
        </p>
      </div>

      {/* Savings Card */}
      <div className="absolute bottom-8 right-0 rounded-2xl border bg-card p-5 shadow-xl animate-[float_7s_ease-in-out_infinite]">

        <p className="text-sm text-muted-foreground">
          Average Savings
        </p>

        <h2 className="text-3xl font-bold text-primary">
          30%
        </h2>
      </div>
    </div>
  );
}

export default HeroImage;