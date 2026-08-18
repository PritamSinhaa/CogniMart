import { Link } from "react-router-dom";

import CategoryCard from "./CategoryCard";

import Container from "../../ui/Container";
import Section from "../../ui/Section";
import SectionHeader from "../../ui/SectionHeader";

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
              className="
                hidden
                shrink-0
                text-sm
                font-semibold
                text-brand-600
                transition-colors
                hover:text-brand-700
                sm:block
                dark:text-brand-400
                dark:hover:text-brand-300
              "
            >
              View all →
            </Link>
          }
        />

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

        <Link
          to="/products"
          className="
            mt-6
            block
            text-center
            text-sm
            font-semibold
            text-brand-600
            transition-colors
            hover:text-brand-700
            sm:hidden
            dark:text-brand-400
            dark:hover:text-brand-300
          "
        >
          View all categories →
        </Link>
      </Container>
    </Section>
  );
}