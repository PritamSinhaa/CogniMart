import { z } from "zod";

// ==========================================
// CREATE COUPON
// ==========================================

export const createCouponSchema = z
  .object({
    code: z
      .string({
        error: "Coupon code is required",
      })
      .trim()
      .min(3, "Coupon code must be at least 3 characters")
      .max(30, "Coupon code cannot exceed 30 characters")
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Coupon code can only contain letters, numbers, hyphens and underscores"
      ),

    description: z
      .string()
      .trim()
      .max(300, "Description cannot exceed 300 characters")
      .optional(),

    discountType: z.enum(
      ["percentage", "fixed"],
      {
        error:
          "Discount type must be percentage or fixed",
      }
    ),

    discountValue: z
      .number({
        error: "Discount value is required",
      })
      .positive("Discount value must be greater than 0"),

    maxDiscount: z
      .number()
      .positive("Maximum discount must be greater than 0")
      .optional(),

    minOrderValue: z
      .number()
      .min(0, "Minimum order value cannot be negative")
      .optional(),

    usageLimit: z
      .number()
      .int("Usage limit must be a whole number")
      .positive("Usage limit must be greater than 0")
      .optional(),

    expiresAt: z
      .string({
        error: "Expiry date is required",
      })
      .datetime("Invalid expiry date"),

    isActive: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) =>
      data.discountType !== "percentage" ||
      data.discountValue <= 100,
    {
      message:
        "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }
  );


// ==========================================
// UPDATE COUPON
// ==========================================

export const updateCouponSchema = z
  .object({
    description: z
      .string()
      .trim()
      .max(300, "Description cannot exceed 300 characters")
      .optional(),

    discountType: z
      .enum(["percentage", "fixed"])
      .optional(),

    discountValue: z
      .number()
      .positive("Discount value must be greater than 0")
      .optional(),

    maxDiscount: z
      .number()
      .positive("Maximum discount must be greater than 0")
      .nullable()
      .optional(),

    minOrderValue: z
      .number()
      .min(0, "Minimum order value cannot be negative")
      .optional(),

    usageLimit: z
      .number()
      .int("Usage limit must be a whole number")
      .positive("Usage limit must be greater than 0")
      .nullable()
      .optional(),

    expiresAt: z
      .string()
      .datetime("Invalid expiry date")
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) =>
      data.discountType !== "percentage" ||
      data.discountValue === undefined ||
      data.discountValue <= 100,
    {
      message:
        "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }
  );


// ==========================================
// APPLY COUPON
// ==========================================

export const applyCouponSchema = z.object({
  code: z
    .string({
      error: "Coupon code is required",
    })
    .trim()
    .min(3, "Coupon code must be at least 3 characters")
    .max(30, "Coupon code cannot exceed 30 characters"),

  orderValue: z
    .number({
      error: "Order value is required",
    })
    .positive("Order value must be greater than 0"),
});