const FALLBACK_IMAGE = "/images/product-placeholder.png";

function formatSpecificationName(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase());
}

function createFeatures(product) {
  if (Array.isArray(product.features) && product.features.length > 0) {
    return product.features;
  }

  const specifications = product.specifications || {};

  return Object.entries(specifications)
    .filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    })
    .map(([key, value]) => {
      return `${formatSpecificationName(key)}: ${value}`;
    });
}

function calculateDiscountedPrice(originalPrice, discount) {
  const validPrice = Math.max(Number(originalPrice) || 0, 0);

  const validDiscount = Math.min(Math.max(Number(discount) || 0, 0), 100);

  return Number((validPrice - (validPrice * validDiscount) / 100).toFixed(2));
}

/*
|--------------------------------------------------------------------------
| Map one backend product
|--------------------------------------------------------------------------
*/

export function mapProduct(product) {
  if (!product) {
    return null;
  }

  const id = product._id || product.id;

  /*
   * Backend price is the original
   * product price.
   */
  const originalPrice = Math.max(Number(product.price) || 0, 0);

  const discount = Math.min(Math.max(Number(product.discount) || 0, 0), 100);

  /*
   * Frontend price is the final
   * discounted selling price.
   */
  const price = calculateDiscountedPrice(originalPrice, discount);

  const productImages = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];

  const images = productImages.length > 0 ? productImages : [FALLBACK_IMAGE];

  const stock = Math.max(Number(product.stock) || 0, 0);

  const isActive = product.isActive ?? true;

  const category =
    typeof product.category === "object"
      ? product.category?.name || "Uncategorized"
      : product.category || "Uncategorized";

  return {
    id,
    _id: id,

    name: product.name || "Unnamed product",

    slug: product.slug || "",

    description: product.description || "No product description is available.",

    brand: product.brand || "Unknown",

    category,

    price,
    originalPrice,
    discount,

    image: images[0],
    images,

    stock,

    inStock: isActive && stock > 0,

    rating: Number(product.ratings?.average ?? product.rating) || 0,

    reviews: Number(product.ratings?.count ?? product.reviews) || 0,

    specifications: product.specifications || {},

    features: createFeatures(product),

    sku: product.sku || "",

    isActive,

    createdAt: product.createdAt,

    updatedAt: product.updatedAt,
  };
}

/*
|--------------------------------------------------------------------------
| Map product array
|--------------------------------------------------------------------------
*/

export function mapProducts(products) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.map(mapProduct).filter(Boolean);
}
