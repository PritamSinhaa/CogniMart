import { z } from "zod";

const categoryBaseSchema = {
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(80, "Category name cannot exceed 80 characters"),

  slug: z
    .string()
    .trim()
    .lowercase()
    .min(2, "Category slug must be at least 2 characters")
    .max(100, "Category slug cannot exceed 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens"
    ),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  image: z
    .string()
    .url("Image must be a valid URL")
    .optional(),

  isActive: z
    .boolean()
    .optional(),
};

export const createCategorySchema = z.object(categoryBaseSchema);

export const updateCategorySchema = z
  .object(categoryBaseSchema)
  .partial();

export const categoryIdSchema = z.object({
  id: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid category ID"),
});