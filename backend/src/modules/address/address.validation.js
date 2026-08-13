import { z } from "zod";

export const createAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name cannot exceed 100 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),

  addressLine1: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),

  addressLine2: z
    .string()
    .trim()
    .max(200, "Address cannot exceed 200 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters"),

  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(100, "State cannot exceed 100 characters"),

  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Invalid Indian postal code"),

  country: z
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters")
    .max(100)
    .default("India"),

  isDefault: z
    .boolean()
    .optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export const addressIdSchema = z.object({
  id: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid address ID"),
});