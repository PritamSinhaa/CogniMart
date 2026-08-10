import { Router } from "express";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "./category.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(getCategoriesController)
);

router.get(
  "/:id",
  validate(categoryIdSchema, "params"),
  asyncHandler(getCategoryByIdController)
);

router.post(
  "/",
  isAuthenticated,
  authorize("admin"),
  validate(createCategorySchema),
  asyncHandler(createCategoryController)
);

router.patch(
  "/:id",
  isAuthenticated,
  authorize("admin"),
  validate(categoryIdSchema, "params"),
  validate(updateCategorySchema),
  asyncHandler(updateCategoryController)
);

router.delete(
  "/:id",
  isAuthenticated,
  authorize("admin"),
  validate(categoryIdSchema, "params"),
  asyncHandler(deleteCategoryController)
);

export default router;