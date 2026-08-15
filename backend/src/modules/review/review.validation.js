import { z } from "zod";

// ==========================================
// CREATE REVIEW
// ==========================================

export const createReviewSchema = z.object({
  rating: z
    .number({
      error: "Rating is required",
    })
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z
    .string({
      error: "Review comment is required",
    })
    .trim()
    .min(3, "Review must be at least 3 characters")
    .max(
      1000,
      "Review cannot exceed 1000 characters"
    ),
});


// ==========================================
// UPDATE REVIEW
// ==========================================

export const updateReviewSchema = z
  .object({
    rating: z
      .number()
      .int("Rating must be a whole number")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .optional(),

    comment: z
      .string()
      .trim()
      .min(3, "Review must be at least 3 characters")
      .max(
        1000,
        "Review cannot exceed 1000 characters"
      )
      .optional(),
  })
  .refine(
    (data) =>
      data.rating !== undefined ||
      data.comment !== undefined,
    {
      message: "At least one field is required",
    }
  );