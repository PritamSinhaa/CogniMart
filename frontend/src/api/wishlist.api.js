import { apiRequest } from "./client";

/*
|--------------------------------------------------------------------------
| Get logged-in user's wishlist
|--------------------------------------------------------------------------
*/

export function getWishlist() {
  return apiRequest("/wishlist");
}

/*
|--------------------------------------------------------------------------
| Add product to wishlist
|--------------------------------------------------------------------------
*/

export function addWishlistItem(productId) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  return apiRequest(`/wishlist/${productId}`, {
    method: "POST",
  });
}

/*
|--------------------------------------------------------------------------
| Remove product from wishlist
|--------------------------------------------------------------------------
*/

export function removeWishlistItem(productId) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  return apiRequest(`/wishlist/${productId}`, {
    method: "DELETE",
  });
}
