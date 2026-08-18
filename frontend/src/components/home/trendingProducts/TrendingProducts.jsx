import { ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "./ProductCard";

import Container from "../../ui/Container";
import Section from "../../ui/Section";
import SectionHeader from "../../ui/SectionHeader";

const products = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "Electronics",
    price: 24990,
    originalPrice: 29990,
    discount: 17,
    rating: 4.8,
    reviews: 1240,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Apple AirPods Pro 2nd Generation",
    category: "Electronics",
    price: 18990,
    originalPrice: 24900,
    discount: 24,
    rating: 4.7,
    reviews: 2180,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Samsung Galaxy Watch",
    category: "Wearables",
    price: 14999,
    originalPrice: 18999,
    discount: 21,
    rating: 4.6,
    reviews: 842,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Nike Air Max Running Shoes",
    category: "Sports",
    price: 8499,
    originalPrice: 10999,
    discount: 23,
    rating: 4.5,
    reviews: 631,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Premium Wireless Bluetooth Speaker",
    category: "Electronics",
    price: 4499,
    originalPrice: 5999,
    discount: 25,
    rating: 4.4,
    reviews: 492,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Modern Smart Backpack",
    category: "Accessories",
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    rating: 4.5,
    reviews: 318,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },
];

export default function TrendingProducts() {
  return (
    <Section
      id="trending"
      className="bg-muted/40"
    >
      <Container>
        <SectionHeader
          eyebrow={
            <span className="inline-flex items-center gap-2">
              <Flame
                size={16}
                className="text-orange-500"
              />

              <span>Trending now</span>
            </span>
          }
          title="Trending Products"
          description="Discover products shoppers are loving right now."
          action={
            <Link
              to="/products"
              className="
                hidden
                shrink-0
                items-center
                gap-1.5
                text-sm
                font-semibold
                text-brand-600
                transition-colors
                hover:text-brand-700
                sm:flex
                dark:text-brand-400
                dark:hover:text-brand-300
              "
            >
              View all

              <ArrowRight size={15} />
            </Link>
          }
        />

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-6
          "
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        <Link
          to="/products"
          className="
            mx-auto
            mt-8
            flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-border
            bg-background
            px-5
            py-2.5
            text-sm
            font-semibold
            text-foreground
            transition-all
            hover:border-brand-300
            hover:text-brand-600
            sm:hidden
            dark:hover:border-brand-700
            dark:hover:text-brand-400
          "
        >
          View all products

          <ArrowRight size={15} />
        </Link>
      </Container>
    </Section>
  );
}