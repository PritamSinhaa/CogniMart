import { Router } from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cart.controller.js";

import {
  addToCartSchema,
  updateCartItemSchema,
  productIdSchema,
} from "./cart.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  isAuthenticated,
  asyncHandler(getCart)
);

router.post(
  "/items",
  isAuthenticated,
  validate(addToCartSchema),
  asyncHandler(addToCart)
);

router.patch(
  "/items/:productId",
  isAuthenticated,
  validate(productIdSchema, "params"),
  validate(updateCartItemSchema),
  asyncHandler(updateCartItem)
);

router.delete(
  "/items/:productId",
  isAuthenticated,
  validate(productIdSchema, "params"),
  asyncHandler(removeCartItem)
);

router.delete(
  "/",
  isAuthenticated,
  asyncHandler(clearCart)
);

export default router;