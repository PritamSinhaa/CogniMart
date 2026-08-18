import CategoryCard from "./CategoryCard";

const categories = [
  {
    name: "Electronics",
    description: "Smartphones, laptops & gadgets",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Fashion",
    description: "Style for every occasion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Home & Living",
    description: "Make your space better",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Beauty",
    description: "Care & beauty essentials",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Sports",
    description: "Gear for an active lifestyle",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Gaming",
    description: "Level up your setup",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Categories() {
  return (
    <section className="bg-white py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Section heading */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Explore
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              Shop by Category
            </h2>

            <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              Discover products across categories, powered by
              smarter shopping.
            </p>
          </div>

          <a
            href="/categories"
            className="
              hidden
              shrink-0
              text-sm
              font-semibold
              text-emerald-600
              transition-colors
              hover:text-emerald-700
              sm:block
            "
          >
            View all →
          </a>
        </div>

        {/* Category grid */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              {...category}
              index={index}
            />
          ))}
        </div>

        {/* Mobile view-all */}
        <a
          href="/categories"
          className="
            mt-6
            block
            text-center
            text-sm
            font-semibold
            text-emerald-600
            sm:hidden
          "
        >
          View all categories →
        </a>
      </div>
    </section>
  );
}