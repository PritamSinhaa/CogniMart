import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";

const Newsletter = () => {
  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-blue-600 px-6 py-16 text-white sm:px-12 lg:px-20"
        >
          {/* Background decorations */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-cyan-400/10" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles size={28} />
            </div>

            <h2 className="mt-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Shop Smarter With AI
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Get personalized product recommendations, exclusive
              deals, AI shopping insights, and the latest trends
              delivered straight to your inbox.
            </p>

            {/* Newsletter form */}
            <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-gray-700">
                <Mail size={20} className="shrink-0 text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Subscribe
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-4 text-xs text-blue-100">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Newsletter;