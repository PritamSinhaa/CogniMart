import Container from "@/components/common/Container";
import { features } from "./featuresData";
import FeatureCard from "./FeatureCard";

const AIFeatures = () => {
  return (
    <section className="bg-gray-50 py-24">
      <Container>
        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            AI Powered Shopping
          </span>

          <h2 className="mt-5 text-4xl font-bold lg:text-5xl">
            Why Shop With CogniMart?
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-500">
            Experience the future of online shopping with artificial
            intelligence helping you discover better products, save
            money, and make smarter purchasing decisions.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default AIFeatures;