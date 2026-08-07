import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import FloatingCard from "./FloatingCard";

const HeroImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: .8 }}
      className="relative flex items-center justify-center"
    >
      <div className="absolute h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative flex h-[480px] w-[480px] items-center justify-center rounded-full border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-cyan-400/10">
        <Bot className="h-48 w-48 text-blue-500" />
      </div>

      <FloatingCard
        className="-left-5 top-10"
        image="https://placehold.co/80"
        title="Top Pick"
        subtitle="Wireless Headphones"
        price="₹2,499"
      />

      <FloatingCard
        className="-right-10 top-48"
        image="https://placehold.co/80"
        title="Price Drop"
        subtitle="Smart Watch"
        price="₹1,999"
      />

      <FloatingCard
        className="bottom-8 left-10"
        image="https://placehold.co/80"
        title="AI Review"
        subtitle="4.8 ⭐ Rating"
        price="Excellent"
      />
    </motion.div>
  );
};

export default HeroImage;