import { z } from "zod";

const mongoIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid product ID");

const quantitySchema = z
  .number({
    error: "Quantity must be a number",
  })
  .int("Quantity must be a whole number")
  .min(1, "Quantity must be at least 1")
  .max(99, "Quantity cannot exceed 99");

export const addToCartSchema = z.object({
  productId: mongoIdSchema,
  quantity: quantitySchema,
});

export const updateCartItemSchema = z.object({
  quantity: quantitySchema,
});

export const productIdSchema = z.object({
  productId: mongoIdSchema,
});