import { Router } from "express";

import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "./product.controller.js";

import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from "./product.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(getProductsController)
);

router.get(
  "/:id",
  validate(productIdSchema, "params"),
  asyncHandler(getProductByIdController)
);

router.post(
  "/",
  isAuthenticated,
  authorize("admin"),
  validate(createProductSchema),
  asyncHandler(createProductController)
);

router.patch(
  "/:id",
  isAuthenticated,
  authorize("admin"),
  validate(productIdSchema, "params"),
  validate(updateProductSchema),
  asyncHandler(updateProductController)
);

router.delete(
  "/:id",
  isAuthenticated,
  authorize("admin"),
  validate(productIdSchema, "params"),
  asyncHandler(deleteProductController)
);

export default router;