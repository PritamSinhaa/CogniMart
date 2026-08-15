import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid address ID"),

  paymentMethod: z.enum(["cod", "online"]),
});

export const orderIdSchema = z.object({
  id: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid order ID"),
});


export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});