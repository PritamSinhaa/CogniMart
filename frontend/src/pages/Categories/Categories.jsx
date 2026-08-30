import {
  ArrowRight,
  Baby,
  BookOpen,
  Camera,
  ChevronRight,
  CookingPot,
  Dumbbell,
  Gamepad2,
  Headphones,
  Home,
  Laptop,
  Package,
  Shirt,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { motion } from "motion/react";
import { Link } from "react-router-dom";

import useCategories from "../../hooks/useCategories";

const CATEGORY_ICONS = {
  electronics: Smartphone,
  fashion: Shirt,
  clothing: Shirt,
  home: Home,
  kitchen: CookingPot,
  beauty: Sparkles,
  sports: Dumbbell,
  fitness: Dumbbell,
  gaming: Gamepad2,
  games: Gamepad2,
  books: BookOpen,
  audio: Headphones,
  headphones: Headphones,
  laptops: Laptop,
  computers: Laptop,
  cameras: Camera,
  baby: Baby,
};

function getCategoryIcon(category) {
  const searchableValue = [
    category.name,
    category.slug,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchingKey =
    Object.keys(
      CATEGORY_ICONS,
    ).find((key) =>
      searchableValue.includes(key),
    );

  return matchingKey
    ? CATEGORY_ICONS[matchingKey]
    : Package;
}

function getCategoryLink(category) {
  return {
    pathname: "/products",
    search: new URLSearchParams({
      category: category.name,
    }).toString(),
  };
}

export default function Categories() {
  const {
    categories,
    loading,
    error,
  } = useCategories();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <CategoriesHero />

        <section className="mt-10">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Shop by category
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              Explore categories
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Browse products organized
              into categories to find
              exactly what you need.
            </p>
          </div>

          {loading && (
            <CategoriesLoading />
          )}

          {!loading && error && (
            <CategoriesError
              message={error}
            />
          )}

          {!loading &&
            !error &&
            categories.length === 0 && (
              <CategoriesEmpty />
            )}

          {!loading &&
            !error &&
            categories.length > 0 && (
              <CategoriesGrid
                categories={categories}
              />
            )}
        </section>

        <AIDiscoveryBanner />
      </div>
    </div>
  );
}

function CategoriesHero() {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
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
          <br className="hidden sm:block" />{" "}
          you&apos;re looking for.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/85 sm:text-base">
          Explore products across
          carefully organized categories.
          Let our AI help you discover
          something you&apos;ll love.
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
  );
}

function CategoriesGrid({
  categories,
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map(
        (category, index) => {
          const Icon =
            getCategoryIcon(category);

          return (
            <motion.article
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
                delay: Math.min(
                  index * 0.05,
                  0.3,
                ),
              }}
            >
              <Link
                to={getCategoryLink(
                  category,
                )}
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
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-500
                  focus-visible:ring-offset-2
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:hover:border-emerald-500/30
                  dark:focus-visible:ring-offset-slate-950
                "
              >
                <div className="flex items-start justify-between">
                  <div
                    className="
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
                    "
                  >
                    <Icon
                      size={23}
                      strokeWidth={1.7}
                    />
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
                  {
                    category.description
                  }
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  View products

                  <ArrowRight
                    size={13}
                  />
                </span>
              </Link>
            </motion.article>
          );
        },
      )}
    </div>
  );
}

function CategoriesLoading() {
  return (
    <div
      className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      role="status"
      aria-label="Loading categories"
    >
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" />

          <div className="mt-5 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />

          <div className="mt-2 h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

function CategoriesError({
  message,
}) {
  return (
    <div
      className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-500/20 dark:bg-red-500/10"
      role="alert"
    >
      <h3 className="font-semibold text-red-800 dark:text-red-300">
        Unable to load categories
      </h3>

      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
        {message}
      </p>
    </div>
  );
}

function CategoriesEmpty() {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Package size={24} />
      </div>

      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
        No categories available
      </h3>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Categories will appear here
        after an administrator creates
        them.
      </p>
    </div>
  );
}

function AIDiscoveryBanner() {
  return (
    <section className="mt-12 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-500/10 dark:bg-emerald-500/5 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Sparkles size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Not sure where to start?
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Tell the AI assistant
              what you need, your budget
              and your preferences.
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
            transition-colors
            hover:bg-emerald-700
          "
        >
          Open AI assistant

          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}