import { apiRequest } from "./client";

function createQueryString(params = {}) {
  const searchParams =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.append(
          key,
          String(value),
        );
      }
    },
  );

  return searchParams.toString();
}

/*
 * Customer product list
 */
export function getProducts(
  params = {},
  options = {},
) {
  const queryString =
    createQueryString(params);

  const endpoint = queryString
    ? `/products?${queryString}`
    : "/products";

  return apiRequest(
    endpoint,
    options,
  );
}

/*
 * Customer product details
 */
export function getProductById(
  productId,
  options = {},
) {
  return apiRequest(
    `/products/${productId}`,
    options,
  );
}

/*
 * Admin product list
 */
export function getAdminProducts(
  params = {},
  options = {},
) {
  const queryString =
    createQueryString(params);

  const endpoint = queryString
    ? `/products/admin/all?${queryString}`
    : "/products/admin/all";

  return apiRequest(
    endpoint,
    options,
  );
}

/*
 * Create product
 */
export function createProduct(
  payload,
  options = {},
) {
  return apiRequest(
    "/products",
    {
      method: "POST",
      body: payload,
      ...options,
    },
  );
}

/*
 * Update or reactivate product
 */
export function updateProduct(
  productId,
  payload,
  options = {},
) {
  return apiRequest(
    `/products/${productId}`,
    {
      method: "PATCH",
      body: payload,
      ...options,
    },
  );
}

/*
 * Soft-delete product
 */
export function deleteProduct(
  productId,
  options = {},
) {
  return apiRequest(
    `/products/${productId}`,
    {
      method: "DELETE",
      ...options,
    },
  );
}

export function getAdminProductById(
  productId,
  options = {},
) {
  return apiRequest(
    `/products/admin/${productId}`,
    options,
  );
}