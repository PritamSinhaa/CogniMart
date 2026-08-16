import { z } from "zod";


// ==================================================
// CREATE ORDER
// ==================================================

export const createOrderSchema = z.object({
  addressId: z
    .string({
      error: "Address ID is required",
    })
    .min(1, "Address ID is required"),

  paymentMethod: z.enum(
    ["cod", "online"],
    {
      error:
        "Payment method must be cod or online",
    }
  ),

  couponCode: z
    .string()
    .trim()
    .min(
      3,
      "Coupon code must be at least 3 characters"
    )
    .max(
      30,
      "Coupon code cannot exceed 30 characters"
    )
    .optional(),
});

// ==================================================
// UPDATE ORDER STATUS
// ==================================================

export const updateOrderStatusSchema = z.object({
  status: z.enum(
    [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ],
    {
      error:
        "Invalid order status",
    }
  ),
});