import { Truck, ShieldCheck, Headphones } from "lucide-react";

const AnnouncementBar = () => {
  return (
    <div className="bg-blue-600 text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-sm">
        <div className="flex items-center gap-2">
          <Truck size={16} />
          <span>Free Shipping on orders over ₹999</span>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>100% Secure Payments</span>
          </div>

          <div className="flex items-center gap-2">
            <Headphones size={16} />
            <span>24/7 Customer Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;