import { Clock3, Flame } from "lucide-react";
import Container from "@/components/common/Container";
import SaleProductCard from "./SaleProductCard";
import { flashSaleProducts } from "./flashSaleData";

const FlashSale = () => {
  return (
    <section className="bg-gray-50 py-24">
      <Container>
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Flame className="text-red-500" size={22} />
              </span>

              <span className="font-semibold text-red-500">
                Limited Time Deals
              </span>
            </div>

            <h2 className="mt-5 text-4xl font-bold">
              Flash Sale
            </h2>

            <p className="mt-3 max-w-xl text-gray-500">
              Grab these amazing deals before they're gone.
              Our AI has selected some of today's best offers.
            </p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <Clock3 className="text-red-500" size={22} />

            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-bold">08</p>
                <span className="text-xs text-gray-400">
                  Hours
                </span>
              </div>

              <span className="font-bold">:</span>

              <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-bold">42</p>
                <span className="text-xs text-gray-400">
                  Minutes
                </span>
              </div>

              <span className="font-bold">:</span>

              <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-bold">19</p>
                <span className="text-xs text-gray-400">
                  Seconds
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {flashSaleProducts.map((product) => (
            <SaleProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FlashSale;