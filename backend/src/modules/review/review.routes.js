import { Router } from "express";

import {
  createReview,
  getProductReviews,
  getMyReview,
  updateReview,
  deleteReview,
} from "./review.controller.js";

import {
  createReviewSchema,
  updateReviewSchema,
} from "./review.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();


// ==================================================
// GET ALL REVIEWS FOR A PRODUCT
// GET /api/v1/products/:productId/reviews
// ==================================================

router.get(
  "/products/:productId/reviews",
  asyncHandler(getProductReviews)
);


// ==================================================
// CREATE REVIEW
// POST /api/v1/products/:productId/reviews
// ==================================================

router.post(
  "/products/:productId/reviews",
  isAuthenticated,
  validate(createReviewSchema),
  asyncHandler(createReview)
);


// ==================================================
// GET MY REVIEW
// GET /api/v1/products/:productId/reviews/me
// ==================================================

router.get(
  "/products/:productId/reviews/me",
  isAuthenticated,
  asyncHandler(getMyReview)
);


// ==================================================
// UPDATE REVIEW
// PATCH /api/v1/reviews/:reviewId
// ==================================================

router.patch(
  "/reviews/:reviewId",
  isAuthenticated,
  validate(updateReviewSchema),
  asyncHandler(updateReview)
);


// ==================================================
// DELETE REVIEW
// DELETE /api/v1/reviews/:reviewId
// ==================================================

router.delete(
  "/reviews/:reviewId",
  isAuthenticated,
  asyncHandler(deleteReview)
);


export default router;