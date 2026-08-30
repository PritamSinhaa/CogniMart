import { apiRequest } from "./client";

export function getCart() {
  return apiRequest("/cart");
}

export function addCartItem(productId, quantity = 1) {
  return apiRequest("/cart/items", {
    method: "POST",
    body: {
      productId,
      quantity,
    },
  });
}

export function updateCartItem(productId, quantity) {
  return apiRequest(`/cart/items/${productId}`, {
    method: "PATCH",
    body: {
      quantity,
    },
  });
}

export function removeCartItem(productId) {
  return apiRequest(`/cart/items/${productId}`, {
    method: "DELETE",
  });
}

export function clearCartItems() {
  return apiRequest("/cart", {
    method: "DELETE",
  });
}
