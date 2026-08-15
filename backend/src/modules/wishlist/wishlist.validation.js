import { z } from "zod";


// ==========================================
// PRODUCT ID PARAMETER
// ==========================================

export const productIdParamSchema = z.object({
  productId: z
    .string({
      error: "Product ID is required",
    })
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid product ID"
    ),
});