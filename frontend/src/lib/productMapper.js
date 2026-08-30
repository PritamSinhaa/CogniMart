const FALLBACK_IMAGE =
  "/product-placeholder.svg";

function formatSpecificationName(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) =>
      character.toUpperCase(),
    );
}

function createFeatures(product) {
  if (
    Array.isArray(product.features) &&
    product.features.length > 0
  ) {
    return product.features;
  }

  const specifications =
    product.specifications || {};

  return Object.entries(specifications)
    .filter(([, value]) => {
      return (
        value !== undefined &&
        value !== null &&
        value !== ""
      );
    })
    .map(([key, value]) => {
      return `${formatSpecificationName(key)}: ${value}`;
    });
}

export function mapProduct(product) {
  if (!product) {
    return null;
  }

  const price =
    Number(product.price) || 0;

  const discount =
    Number(product.discount) || 0;

  /*
   * Assumption:
   * price is the final selling price.
   */
  const originalPrice =
    discount > 0 && discount < 100
      ? Math.round(
          price /
            (1 - discount / 100),
        )
      : price;

  const productImages =
    Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];

  const images =
    productImages.length > 0
      ? productImages
      : [FALLBACK_IMAGE];

  return {
    id: product._id || product.id,

    name:
      product.name ||
      "Unnamed product",

    slug: product.slug || "",

    description:
      product.description ||
      "No product description is available.",

    brand:
      product.brand || "Unknown",

    category:
      typeof product.category === "object"
        ? product.category?.name ||
          "Uncategorized"
        : product.category ||
          "Uncategorized",

    price,
    originalPrice,
    discount,

    image: images[0],
    images,

    stock:
      Number(product.stock) || 0,

    inStock:
      Number(product.stock) > 0,

    rating:
      Number(
        product.ratings?.average ??
          product.rating,
      ) || 0,

    reviews:
      Number(
        product.ratings?.count ??
          product.reviews,
      ) || 0,

    specifications:
      product.specifications || {},

    features:
      createFeatures(product),

    sku: product.sku || "",

    isActive:
      product.isActive ?? true,

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function mapProducts(products) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .map(mapProduct)
    .filter(Boolean);
}