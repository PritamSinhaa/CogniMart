import { AlertCircle } from "lucide-react";

import { Link } from "react-router-dom";

import CategoryCard from "./CategoryCard";

import Container from "../../ui/Container";
import Section from "../../ui/Section";
import SectionHeader from "../../ui/SectionHeader";

import useCategories from "../../../hooks/useCategories";

const HOME_CATEGORY_LIMIT = 6;

export default function Categories() {
  const {
    categories,
    loading,
    error,
  } = useCategories();

  const displayedCategories =
    categories.slice(
      0,
      HOME_CATEGORY_LIMIT,
    );

  return (
    <Section
      id="categories"
      className="bg-background"
    >
      <Container>
        <SectionHeader
          eyebrow="Explore"
          title="Shop by Category"
          description="Discover products across categories, powered by smarter shopping."
          action={
            <Link
              to="/products"
              className="hidden shrink-0 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 sm:block dark:text-brand-400 dark:hover:text-brand-300"
            >
              View all →
            </Link>
          }
        />

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
          displayedCategories.length >
            0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedCategories.map(
                (
                  category,
                  index,
                ) => (
                  <CategoryCard
                    key={
                      category.id ||
                      category.name
                    }
                    category={
                      category
                    }
                    index={index}
                  />
                ),
              )}
            </div>
          )}

        {!loading &&
          !error &&
          displayedCategories.length ===
            0 && (
            <CategoriesEmpty />
          )}

        {!loading &&
          !error &&
          displayedCategories.length >
            0 && (
            <Link
              to="/products"
              className="mt-6 block text-center text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 sm:hidden dark:text-brand-400 dark:hover:text-brand-300"
            >
              View all categories →
            </Link>
          )}
      </Container>
    </Section>
  );
}

function CategoriesLoading() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading categories"
    >
      {Array.from({
        length: HOME_CATEGORY_LIMIT,
      }).map((_, index) => (
        <div
          key={index}
          className="min-h-[210px] animate-pulse overflow-hidden rounded-2xl border border-border bg-slate-200 dark:bg-slate-800"
        >
          <div className="flex h-full min-h-[210px] flex-col justify-end p-5">
            <div className="h-5 w-32 rounded bg-slate-300 dark:bg-slate-700" />

            <div className="mt-2 h-3 w-48 rounded bg-slate-300 dark:bg-slate-700" />
          </div>
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
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
    >
      <AlertCircle
        size={20}
        className="mt-0.5 shrink-0"
      />

      <div>
        <p className="text-sm font-semibold">
          Unable to load categories
        </p>

        <p className="mt-1 text-sm opacity-80">
          {message}
        </p>
      </div>
    </div>
  );
}

function CategoriesEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        No categories are available
      </p>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Categories added by an
        administrator will appear here.
      </p>

      <Link
        to="/products"
        className="mt-5 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Browse products
      </Link>
    </div>
  );
}