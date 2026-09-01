import { apiRequest } from "./client";

/*
|--------------------------------------------------------------------------
| Customer orders
|--------------------------------------------------------------------------
*/

export function createOrder(payload, options = {}) {
  return apiRequest("/orders", {
    ...options,
    method: "POST",
    body: payload,
  });
}

export function getMyOrders(options = {}) {
  return apiRequest("/orders", options);
}

export function getOrderById(orderId, options = {}) {
  return apiRequest(`/orders/${orderId}`, options);
}

export function cancelOrder(orderId, options = {}) {
  return apiRequest(`/orders/${orderId}/cancel`, {
    ...options,
    method: "PATCH",
  });
}

/*
|--------------------------------------------------------------------------
| Admin orders
|--------------------------------------------------------------------------
*/

export function getAllOrders(options = {}) {
  return apiRequest("/orders/admin", options);
}

export function updateOrderStatus(orderId, status, options = {}) {
  return apiRequest(`/orders/admin/${orderId}/status`, {
    ...options,
    method: "PATCH",
    body: {
      status,
    },
  });
}
