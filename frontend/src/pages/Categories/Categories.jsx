import { motion } from "motion/react";
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  Gamepad2,
  BookOpen,
  Headphones,
  Laptop,
  Camera,
  CookingPot,
  Baby,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Phones, laptops & gadgets",
    icon: Smartphone,
    count: "1,240+ products",
  },
  {
    id: 2,
    name: "Fashion",
    description: "Clothing, shoes & accessories",
    icon: Shirt,
    count: "2,800+ products",
  },
  {
    id: 3,
    name: "Home & Kitchen",
    description: "Everything for your home",
    icon: Home,
    count: "1,950+ products",
  },
  {
    id: 4,
    name: "Beauty",
    description: "Skincare, makeup & wellness",
    icon: Sparkles,
    count: "980+ products",
  },
  {
    id: 5,
    name: "Sports",
    description: "Fitness & outdoor essentials",
    icon: Dumbbell,
    count: "760+ products",
  },
  {
    id: 6,
    name: "Gaming",
    description: "Consoles, games & accessories",
    icon: Gamepad2,
    count: "540+ products",
  },
  {
    id: 7,
    name: "Books",
    description: "Books, learning & literature",
    icon: BookOpen,
    count: "3,200+ products",
  },
  {
    id: 8,
    name: "Audio",
    description: "Headphones & speakers",
    icon: Headphones,
    count: "620+ products",
  },
];

const popularCategories = [
  {
    name: "Laptops",
    icon: Laptop,
  },
  {
    name: "Cameras",
    icon: Camera,
  },
  {
    name: "Kitchen",
    icon: CookingPot,
  },
  {
    name: "Baby Products",
    icon: Baby,
  },
];

export default function Categories() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* ================================================
            HERO
        ================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-emerald-600
            px-6
            py-10
            text-white
            sm:px-10
            sm:py-14
          "
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
              <Sparkles size={17} />
              Explore CogniMart
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Find exactly what
              <br className="hidden sm:block" />
              you're looking for.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/85 sm:text-base">
              Explore thousands of products across carefully organized
              categories. Let our AI help you discover something
              you'll love.
            </p>

            <Link
              to="/ai-assistant"
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-emerald-700
                shadow-sm
                transition-all
                hover:bg-emerald-50
                hover:shadow-md
                active:scale-[0.98]
              "
            >
              Ask AI to find products
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.section>

        {/* ================================================
            MAIN CATEGORIES
        ================================================= */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                Shop by category
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Explore categories
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => {
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                  }}
                >
                  <Link
                    to={`/products?category=${category.name}`}
                    className="
                      group
                      flex
                      h-full
                      flex-col
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      shadow-sm
                      transition-all
                      duration-200
                      hover:-translate-y-1
                      hover:border-emerald-200
                      hover:shadow-lg
                      dark:border-slate-800
                      dark:bg-slate-900
                      dark:hover:border-emerald-500/30
                    "
                  >
                    <div className="flex items-start justify-between">
                      <div className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-50
                        text-emerald-600
                        transition-colors
                        group-hover:bg-emerald-600
                        group-hover:text-white
                        dark:bg-emerald-500/10
                      ">
                        <Icon size={23} strokeWidth={1.7} />
                      </div>

                      <ChevronRight
                        size={18}
                        className="
                          text-slate-300
                          transition-all
                          group-hover:translate-x-1
                          group-hover:text-emerald-600
                        "
                      />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {category.description}
                    </p>

                    <p className="mt-4 text-xs font-medium text-emerald-600">
                      {category.count}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ================================================
            POPULAR CATEGORIES
        ================================================= */}
        <section className="mt-12">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Quick discovery
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Popular right now
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {popularCategories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  to={`/products?category=${category.name}`}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    transition-all
                    hover:border-emerald-200
                    hover:shadow-sm
                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:hover:border-emerald-500/30
                  "
                >
                  <div className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                    text-slate-600
                    transition-colors
                    group-hover:bg-emerald-50
                    group-hover:text-emerald-600
                    dark:bg-slate-800
                    dark:text-slate-300
                    dark:group-hover:bg-emerald-500/10
                  ">
                    <Icon size={19} strokeWidth={1.7} />
                  </div>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {category.name}
                  </span>

                  <ChevronRight
                    size={15}
                    className="ml-auto text-slate-300 group-hover:text-emerald-600"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ================================================
            AI DISCOVERY
        ================================================= */}
        <section className="mt-12 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-500/10 dark:bg-emerald-500/5 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Sparkles size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Can't decide what to buy?
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Tell CogniMart AI what you're looking for and
                  we'll help you find the right products.
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
              Try AI shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
