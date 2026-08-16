import { z } from "zod";

// ==================================================
// CREATE PAYMENT ORDER
// ==================================================

export const createPaymentOrderSchema = z.object({
  orderId: z
    .string({
      error: "Order ID is required",
    })
    .min(1, "Order ID is required"),
});

// ==================================================
// VERIFY RAZORPAY PAYMENT
// ==================================================

export const verifyPaymentSchema = z.object({
  orderId: z
    .string({
      error: "Order ID is required",
    })
    .min(1, "Order ID is required"),

  razorpay_order_id: z
    .string({
      error: "Razorpay order ID is required",
    })
    .min(1, "Razorpay order ID is required"),

  razorpay_payment_id: z
    .string({
      error: "Razorpay payment ID is required",
    })
    .min(1, "Razorpay payment ID is required"),

  razorpay_signature: z
    .string({
      error: "Razorpay signature is required",
    })
    .min(1, "Razorpay signature is required"),
});
