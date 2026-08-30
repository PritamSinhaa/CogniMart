import { Router } from "express";

import {
  createProductController,
  deleteProductController,
  getAdminProductsController,
  getProductByIdController,
  getProductsController,
  updateProductController,
} from "./product.controller.js";

import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from "./product.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

/*
 * Admin product list
 *
 * This route must appear before /:id.
 */
router.get(
  "/admin/all",
  isAuthenticated,
  authorize("admin"),
  asyncHandler(getAdminProductsController),
);

/*
 * Public active product list
 */
router.get("/", asyncHandler(getProductsController));

/*
 * Create product
 */
router.post(
  "/",
  isAuthenticated,
  authorize("admin"),
  validate(createProductSchema),
  asyncHandler(createProductController),
);

/*
 * Public active product details
 */
router.get(
  "/:id",
  validate(productIdSchema, "params"),
  asyncHandler(getProductByIdController),
);

/*
 * Update or reactivate product
 */
router.patch(
  "/:id",
  isAuthenticated,
  authorize("admin"),
  validate(productIdSchema, "params"),
  validate(updateProductSchema),
  asyncHandler(updateProductController),
);

/*
 * Soft-delete product
 */
router.delete(
  "/:id",
  isAuthenticated,
  authorize("admin"),
  validate(productIdSchema, "params"),
  asyncHandler(deleteProductController),
);

export default router;
