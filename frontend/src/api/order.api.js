import { apiRequest } from "./client";

export function createOrder(orderData) {
  return apiRequest("/orders", {
    method: "POST",
    body: orderData,
  });
}

export function getMyOrders() {
  return apiRequest("/orders");
}

export function getOrderById(orderId) {
  return apiRequest(`/orders/${orderId}`);
}

export function cancelOrder(orderId) {
  return apiRequest(`/orders/${orderId}/cancel`, {
    method: "PATCH",
  });
}
