import Container from "@/components/common/Container";
import CategoryCard from "./CategoryCard";
import { categories } from "./categoriesData";

const Categories = () => {
  return (
    <section className="py-24">
      <Container>

        <div className="mb-14 text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Shop by Category
          </span>

          <h2 className="mt-5 text-4xl font-bold">
            Explore Popular Categories
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Browse thousands of products across our most popular
            shopping categories.
          </p>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>

      </Container>
    </section>
  );
};

export default Categories;