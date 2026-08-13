import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid product ID"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export const productIdSchema = z.object({
  productId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid product ID"),
});