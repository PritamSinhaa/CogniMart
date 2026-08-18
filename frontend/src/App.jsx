import Hero from "./components/home/hero/Hero";
import AIFeatures from "./components/home/AIFeatures/AIFeatures";
import Categories from "./components/home/categories/Categories";
import TrendingProducts from "./components/home/trendingProducts/TrendingProducts";
import AIAssistantBanner from "./components/home/AIBanner/AIAssistantBanner";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Hero />
        <AIFeatures />
        <Categories />
        <TrendingProducts />
        <AIAssistantBanner />
      </main>
    </div>
  );
}

export default App;