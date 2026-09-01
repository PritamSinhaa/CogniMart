const FALLBACK_IMAGE =
  "/product-placeholder.svg";

/*
|--------------------------------------------------------------------------
| Format specification names
|--------------------------------------------------------------------------
|
| Example:
| batteryCapacity → Battery Capacity
|
*/

function formatSpecificationName(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) =>
      character.toUpperCase(),
    );
}

/*
|--------------------------------------------------------------------------
| Create product features
|--------------------------------------------------------------------------
|
| Use the backend features array when available.
| Otherwise, convert specifications into readable features.
|
*/

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
      return `${formatSpecificationName(
        key,
      )}: ${value}`;
    });
}

/*
|--------------------------------------------------------------------------
| Calculate discounted selling price
|--------------------------------------------------------------------------
|
| Backend contract:
|
| product.price    = original/list price
| product.discount = percentage discount
|
| Example:
| price = 10000
| discount = 20
| final price = 8000
|
*/

function calculateDiscountedPrice(
  originalPrice,
  discount,
) {
  const validPrice = Math.max(
    Number(originalPrice) || 0,
    0,
  );

  const validDiscount = Math.min(
    Math.max(
      Number(discount) || 0,
      0,
    ),
    100,
  );

  return Number(
    (
      validPrice -
      (validPrice * validDiscount) /
        100
    ).toFixed(2),
  );
}

/*
|--------------------------------------------------------------------------
| Map one backend product
|--------------------------------------------------------------------------
|
| This gives every frontend component a consistent product shape.
|
*/

export function mapProduct(product) {
  if (!product) {
    return null;
  }

  const id =
    product._id || product.id;

  const originalPrice = Math.max(
    Number(product.price) || 0,
    0,
  );

  const discount = Math.min(
    Math.max(
      Number(product.discount) || 0,
      0,
    ),
    100,
  );

  const price =
    calculateDiscountedPrice(
      originalPrice,
      discount,
    );

  const productImages =
    Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];

  const images =
    productImages.length > 0
      ? productImages
      : [FALLBACK_IMAGE];

  const stock = Math.max(
    Number(product.stock) || 0,
    0,
  );

  const isActive =
    product.isActive ?? true;

  const category =
    typeof product.category ===
    "object"
      ? product.category?.name ||
        "Uncategorized"
      : product.category ||
        "Uncategorized";

  return {
    /*
     * Keep both because some existing
     * components use id while API-related
     * code may use _id.
     */
    id,
    _id: id,

    name:
      product.name ||
      "Unnamed product",

    slug:
      product.slug || "",

    description:
      product.description ||
      "No product description is available.",

    brand:
      product.brand || "Unknown",

    category,

    /*
     * price = final selling price
     * originalPrice = backend list price
     */
    price,
    originalPrice,
    discount,

    image: images[0],
    images,

    stock,

    inStock:
      isActive && stock > 0,

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

    sku:
      product.sku || "",

    isActive,

    createdAt:
      product.createdAt,

    updatedAt:
      product.updatedAt,
  };
}

/*
|--------------------------------------------------------------------------
| Map a product array
|--------------------------------------------------------------------------
*/

export function mapProducts(products) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .map(mapProduct)
    .filter(Boolean);
}
