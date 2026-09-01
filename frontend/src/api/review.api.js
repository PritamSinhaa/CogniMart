import { apiRequest } from "./client";

/*
|--------------------------------------------------------------------------
| Get all reviews for a product
|--------------------------------------------------------------------------
|
| Public endpoint.
|
*/

export function getProductReviews(productId, options = {}) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  return apiRequest(`/products/${productId}/reviews`, options);
}

/*
|--------------------------------------------------------------------------
| Get logged-in user's review
|--------------------------------------------------------------------------
|
| Protected endpoint.
|
*/

export function getMyReview(productId, options = {}) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  return apiRequest(`/products/${productId}/reviews/me`, options);
}

/*
|--------------------------------------------------------------------------
| Create review
|--------------------------------------------------------------------------
*/

export function createReview(productId, reviewData) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  return apiRequest(`/products/${productId}/reviews`, {
    method: "POST",
    body: reviewData,
  });
}

/*
|--------------------------------------------------------------------------
| Update review
|--------------------------------------------------------------------------
*/

export function updateReview(reviewId, reviewData) {
  if (!reviewId) {
    throw new Error("Review ID is required");
  }

  return apiRequest(`/reviews/${reviewId}`, {
    method: "PATCH",
    body: reviewData,
  });
}

/*
|--------------------------------------------------------------------------
| Delete review
|--------------------------------------------------------------------------
*/

export function deleteReview(reviewId) {
  if (!reviewId) {
    throw new Error("Review ID is required");
  }

  return apiRequest(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
}
