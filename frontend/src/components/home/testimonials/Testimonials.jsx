import Container from "@/components/common/Container";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonialsData";

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Customer Reviews
          </span>

          <h2 className="mt-5 text-4xl font-bold lg:text-5xl">
            Loved by Smart Shoppers
          </h2>

          <p className="mt-4 text-lg leading-8 text-gray-500">
            See what our customers have to say about their
            shopping experience with CogniMart.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;