import { apiRequest } from "./client";

export function getCategories(options = {}) {
  return apiRequest(
    "/categories",
    options,
  );
}

export function getCategoryById(
  categoryId,
  options = {},
) {
  return apiRequest(
    `/categories/${categoryId}`,
    options,
  );
}