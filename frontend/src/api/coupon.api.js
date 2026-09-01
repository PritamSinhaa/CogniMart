import { apiRequest } from "./client";

/*
|--------------------------------------------------------------------------
| Apply and validate a coupon
|--------------------------------------------------------------------------
|
| This endpoint previews the discount.
| It does not increment coupon usage.
|
| Coupon usage is incremented only when
| the backend successfully creates the
| final order.
|
*/

export function applyCoupon(code, orderValue) {
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
    method: "POST",

    body: {
      code: normalizedCode,

      orderValue: numericOrderValue,
    },
  });
}
