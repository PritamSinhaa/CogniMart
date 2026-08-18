import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Clock3,
  Flame,
  Heart,
  ShoppingCart,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const deals = [
  {
    id: 1,
    name: "Sony WH-1000XM5",
    category: "Audio",
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    rating: 4.8,
    reviews: 892,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Apple AirPods Pro",
    category: "Audio",
    price: 24999,
    originalPrice: 26999,
    discount: 7,
    rating: 4.7,
    reviews: 1248,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Apple Watch Series 10",
    category: "Wearables",
    price: 46900,
    originalPrice: 49900,
    discount: 6,
    rating: 4.6,
    reviews: 634,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Canon EOS Camera",
    category: "Cameras",
    price: 64990,
    originalPrice: 72990,
    discount: 11,
    rating: 4.7,
    reviews: 421,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80",
  },
];

const dealCategories = [
  "All deals",
  "Electronics",
  "Audio",
  "Fashion",
  "Home",
  "Gaming",
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function getTimeLeft() {
  const now = new Date();
  const end = new Date(now);

  end.setHours(23, 59, 59, 999);

  const difference = Math.max(end.getTime() - now.getTime(), 0);

  return {
    hours: Math.floor(difference / (1000 * 60 * 60)),
    minutes: Math.floor(
      (difference % (1000 * 60 * 60)) / (1000 * 60)
    ),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

export default function Deals() {
  const [activeCategory, setActiveCategory] = useState("All deals");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredDeals =
    activeCategory === "All deals"
      ? deals
      : deals.filter((deal) => {
          if (activeCategory === "Electronics") {
            return ["Audio", "Cameras", "Wearables"].includes(
              deal.category
            );
          }

          if (activeCategory === "Audio") {
            return deal.category === "Audio";
          }

          return true;
        });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* =================================================
            HERO
        ================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-slate-950
            px-6
            py-9
            text-white
            sm:px-10
            sm:py-12
          "
        >
          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <Flame size={17} />
                Limited-time offers
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Deals worth
                <span className="text-emerald-400">
                  {" "}
                  grabbing.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Discover today's best prices, hand-picked deals,
                and AI-powered recommendations before they're gone.
              </p>

              <Link
                to="/ai-assistant"
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-emerald-500
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-emerald-400
                "
              >
                Find my best deal
                <Sparkles size={16} />
              </Link>
            </div>

            {/* Countdown */}
            <div className="shrink-0">
              <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-400">
                Today's deals end in
              </p>

              <div className="flex items-center gap-2">
                <TimeBox value={timeLeft.hours} label="Hours" />
                <span className="text-2xl font-bold text-emerald-400">
                  :
                </span>
                <TimeBox
                  value={timeLeft.minutes}
                  label="Minutes"
                />
                <span className="text-2xl font-bold text-emerald-400">
                  :
                </span>
                <TimeBox
                  value={timeLeft.seconds}
                  label="Seconds"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* =================================================
            DEAL CATEGORIES
        ================================================= */}
        <section className="mt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {dealCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`
                  shrink-0
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition-colors
                  ${
                    activeCategory === category
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* =================================================
            DEAL HEADER
        ================================================= */}
        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap
                  size={18}
                  className="text-amber-500"
                  fill="currentColor"
                />

                <p className="text-sm font-semibold text-emerald-600">
                  Flash deals
                </p>
              </div>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Today's top offers
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 sm:flex"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* =================================================
              PRODUCTS
          ================================================= */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDeals.map((deal, index) => (
              <motion.article
                key={deal.id}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-1
                  hover:shadow-lg
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-[11px] font-bold text-white">
                    <Tag size={11} />
                    {deal.discount}% OFF
                  </span>

                  <button
                    type="button"
                    aria-label={`Add ${deal.name} to wishlist`}
                    className="
                      absolute
                      right-3
                      top-3
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-white/95
                      text-slate-500
                      shadow-sm
                      backdrop-blur
                      transition-colors
                      hover:text-rose-500
                      dark:bg-slate-900/95
                    "
                  >
                    <Heart size={17} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <p className="text-xs font-medium text-emerald-600">
                    {deal.category}
                  </p>

                  <Link
                    to={`/products/${deal.id}`}
                    className="mt-1 block"
                  >
                    <h3 className="line-clamp-1 text-base font-semibold text-slate-950 transition-colors hover:text-emerald-600 dark:text-white">
                      {deal.name}
                    </h3>
                  </Link>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-600 dark:bg-amber-500/10">
                      ★ {deal.rating}
                    </span>

                    <span className="text-xs text-slate-400">
                      ({deal.reviews.toLocaleString("en-IN")})
                    </span>
                  </div>

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-lg font-bold text-slate-950 dark:text-white">
                      {formatPrice(deal.price)}
                    </span>

                    <span className="pb-0.5 text-xs text-slate-400 line-through">
                      {formatPrice(deal.originalPrice)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="
                      mt-4
                      flex
                      h-10
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-emerald-600
                      text-xs
                      font-semibold
                      text-white
                      transition-colors
                      hover:bg-emerald-700
                      dark:hover:bg-emerald-500
                    "
                  >
                    <ShoppingCart size={15} />
                    Add to cart
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredDeals.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <Tag
                size={30}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-semibold text-slate-800 dark:text-white">
                No deals found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another deal category.
              </p>
            </div>
          )}
        </section>

        {/* =================================================
            AI DEAL FINDER
        ================================================= */}
        <section className="mt-12 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-500/10 dark:bg-emerald-500/5 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Sparkles size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Looking for a specific deal?
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Tell CogniMart AI your budget and what you need.
                  We'll help you find the best available option.
                </p>
              </div>
            </div>

            <Link
              to="/ai-assistant"
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                hover:bg-emerald-700
                hover:shadow-md
                dark:hover:bg-emerald-500
              "
            >
              Ask CogniMart AI
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="flex min-w-[64px] flex-col items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
      <span className="text-xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </span>

      <span className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  );
}