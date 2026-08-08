import Container from "@/components/common/Container";
import BrandCard from "./BrandCard";
import { brands } from "./brandsData";

const Brands = () => {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="mb-12 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Top Brands
          </span>

          <h2 className="mt-5 text-4xl font-bold">
            Shop Your Favorite Brands
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Discover products from some of the world's most
            trusted and popular brands.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Brands;