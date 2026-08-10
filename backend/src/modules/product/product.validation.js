import { z } from "zod";

const productBaseSchema = {
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(120, "Product name cannot exceed 120 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Product slug must be at least 2 characters")
    .max(150, "Product slug cannot exceed 150 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens"
    ),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  price: z
    .number()
    .nonnegative("Price cannot be negative"),

  discount: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .default(0),

  category: z
    .string()
    .trim()
    .min(2, "Category is required"),

  brand: z
    .string()
    .trim()
    .min(2, "Brand is required"),

  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .default([]),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative"),

  sku: z
    .string()
    .trim()
    .min(2, "SKU is required")
    .max(50, "SKU cannot exceed 50 characters")
    .transform((value) => value.toUpperCase()),

  specifications: z
    .record(z.string(), z.string())
    .default({}),

  isActive: z
    .boolean()
    .default(true),
};

export const createProductSchema = z.object(productBaseSchema);

export const updateProductSchema = z
  .object(productBaseSchema)
  .partial();

export const productIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product ID"),
});