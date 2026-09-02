import { apiRequest } from "./client";

/*
|--------------------------------------------------------------------------
| Customer coupon validation
|--------------------------------------------------------------------------
*/

export function applyCoupon(code, orderValue, options = {}) {
  const normalizedCode = String(code || "")
    .trim()
    .toUpperCase();

  const numericOrderValue = Number(orderValue);

  if (normalizedCode.length < 3) {
    throw new Error("Enter a valid coupon code");
  }

  if (!Number.isFinite(numericOrderValue) || numericOrderValue <= 0) {
    throw new Error("Order value must be greater than zero");
  }

  return apiRequest("/coupons/apply", {
    ...options,
    method: "POST",

    body: {
      code: normalizedCode,
      orderValue: numericOrderValue,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Admin coupon queries
|--------------------------------------------------------------------------
*/

export function getCoupons(options = {}) {
  return apiRequest("/coupons", options);
}

export function getCouponById(couponId, options = {}) {
  return apiRequest(`/coupons/${couponId}`, options);
}

/*
|--------------------------------------------------------------------------
| Admin coupon mutations
|--------------------------------------------------------------------------
*/

export function createCoupon(payload, options = {}) {
  return apiRequest("/coupons", {
    ...options,
    method: "POST",
    body: payload,
  });
}

export function updateCoupon(couponId, payload, options = {}) {
  return apiRequest(`/coupons/${couponId}`, {
    ...options,
    method: "PATCH",
    body: payload,
  });
}

export function deleteCoupon(couponId, options = {}) {
  return apiRequest(`/coupons/${couponId}`, {
    ...options,
    method: "DELETE",
  });
}
