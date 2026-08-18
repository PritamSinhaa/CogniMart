import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function ProductGallery({
  images,
  productName,
}) {
  const [activeImage, setActiveImage] = useState(0);

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const nextImage = () => {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      {/* Main image */}

      <div className="group relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <motion.img
          key={activeImage}
          src={images[activeImage]}
          alt={productName}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="h-full w-full object-cover"
        />

        {/* Previous */}

        <button
          type="button"
          onClick={previousImage}
          aria-label="Previous image"
          className="
            absolute
            left-4
            top-1/2
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-black/30
            text-white
            opacity-0
            backdrop-blur-md
            transition-all
            group-hover:opacity-100
          "
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next */}

        <button
          type="button"
          onClick={nextImage}
          aria-label="Next image"
          className="
            absolute
            right-4
            top-1/2
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-black/30
            text-white
            opacity-0
            backdrop-blur-md
            transition-all
            group-hover:opacity-100
          "
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Thumbnails */}

      <div className="mt-4 grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(index)}
            className={`
              relative
              aspect-square
              overflow-hidden
              rounded-2xl
              border
              bg-white
              transition-all
              dark:bg-slate-900
              ${
                activeImage === index
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              }
            `}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}