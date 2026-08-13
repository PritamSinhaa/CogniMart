import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .toLowerCase()
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),

  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "New password must contain uppercase, lowercase, number, and special character"
    ),
});

export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["customer", "admin"]),
});