import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Reusable MongoDB ObjectId
|--------------------------------------------------------------------------
*/

const mongoIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID");

/*
|--------------------------------------------------------------------------
| Create order
|--------------------------------------------------------------------------
*/

export const createOrderSchema = z.object({
  addressId: mongoIdSchema,

  paymentMethod: z.enum(["cod", "online"], {
    error: "Payment method must be cod or online",
  }),

  couponCode: z
    .string()
    .trim()
    .min(3, "Coupon code must be at least 3 characters")
    .max(30, "Coupon code cannot exceed 30 characters")
    .transform((value) => value.toUpperCase())
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Order route parameters
|--------------------------------------------------------------------------
*/

export const orderIdSchema = z.object({
  orderId: mongoIdSchema,
});

/*
|--------------------------------------------------------------------------
| Update order status
|--------------------------------------------------------------------------
*/

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
      error: "Invalid order status",
    },
  ),
});