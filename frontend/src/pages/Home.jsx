import Hero from "@/components/home/hero/Hero";
import Categories from "@/components/home/categories/Categories";
import AIFeatures from "@/components/home/aiFeatures/AIFeatures";
import { FeaturedProducts } from "@/components/home/featuredProducts";
import { FlashSale } from "@/components/home/flashSale";
import { Brands } from "@/components/home/brands";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";

const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <AIFeatures />
      <FeaturedProducts />
      <FlashSale />
      <Brands />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
