import Hero from "@/components/home/hero/Hero";
import Categories from "@/components/home/categories/Categories";
import AIFeatures from "@/components/home/aiFeatures/AIFeatures";
import { FeaturedProducts } from "@/components/home/featuredProducts";

// import Categories from "@/components/home/categories/Categories";
// import AIFeatures from "@/components/home/ai-features/AIFeatures";
// import FeaturedProducts from "@/components/home/featured-products/FeaturedProducts";
// import FlashSale from "@/components/home/flash-sale/FlashSale";
// import Brands from "@/components/home/brands/Brands";
// import Testimonials from "@/components/home/testimonials/Testimonials";
// import Newsletter from "@/components/home/newsletter/Newsletter";

const Home = () => {
  return (
    <>
      <Hero />
       <Categories />
       <AIFeatures />
       <FeaturedProducts/>
      {/* <Categories />
      <AIFeatures />
      <FeaturedProducts />
      <FlashSale />
      <Brands />
      <Testimonials />
      <Newsletter /> */}
    </>
  );
};

export default Home;