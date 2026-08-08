import Container from "@/components/common/Container";
import ProductCard from "./ProductCard";
import { products } from "./productsData";

const FeaturedProducts = () => {
  return (
    <section className="bg-white py-24">
      <Container>
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
              Featured Products
            </span>

            <h2 className="mt-5 text-4xl font-bold">
              Products You May Love
            </h2>

            <p className="mt-3 max-w-xl text-gray-500">
              Discover products selected by our AI based on
              popularity, quality, and customer preferences.
            </p>
          </div>

          <button className="font-semibold text-blue-600 transition hover:text-blue-700">
            View All Products →
          </button>
        </div>

        {/* Products */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProducts;