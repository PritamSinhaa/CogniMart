import {
  apiRequest,
} from "./client";

/*
|--------------------------------------------------------------------------
| Public category queries
|--------------------------------------------------------------------------
*/

export function getCategories(
  options = {},
) {
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

/*
|--------------------------------------------------------------------------
| Admin category management
|--------------------------------------------------------------------------
*/

export function createCategory(
  payload,
  options = {},
) {
  return apiRequest(
    "/categories",
    {
      ...options,
      method: "POST",
      body: payload,
    },
  );
}

export function updateCategory(
  categoryId,
  payload,
  options = {},
) {
  return apiRequest(
    `/categories/${categoryId}`,
    {
      ...options,
      method: "PATCH",
      body: payload,
    },
  );
}

export function deleteCategory(
  categoryId,
  options = {},
) {
  return apiRequest(
    `/categories/${categoryId}`,
    {
      ...options,
      method: "DELETE",
    },
  );
}