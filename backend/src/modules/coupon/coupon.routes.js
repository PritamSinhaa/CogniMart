import { Router } from "express";

import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "./coupon.controller.js";

import {
  createCouponSchema,
  updateCouponSchema,
  applyCouponSchema,
} from "./coupon.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();


// ==================================================
// CREATE COUPON - ADMIN
// POST /api/v1/coupons
// ==================================================

router.post(
  "/coupons",
  isAuthenticated,
  authorize("admin"),
  validate(createCouponSchema),
  asyncHandler(createCoupon)
);


// ==================================================
// GET ALL COUPONS - ADMIN
// GET /api/v1/coupons
// ==================================================

router.get(
  "/coupons",
  isAuthenticated,
  authorize("admin"),
  asyncHandler(getCoupons)
);


// ==================================================
// GET COUPON BY ID - ADMIN
// GET /api/v1/coupons/:id
// ==================================================

router.get(
  "/coupons/:id",
  isAuthenticated,
  authorize("admin"),
  asyncHandler(getCouponById)
);


// ==================================================
// UPDATE COUPON - ADMIN
// PATCH /api/v1/coupons/:id
// ==================================================

router.patch(
  "/coupons/:id",
  isAuthenticated,
  authorize("admin"),
  validate(updateCouponSchema),
  asyncHandler(updateCoupon)
);


// ==================================================
// DELETE COUPON - ADMIN
// DELETE /api/v1/coupons/:id
// ==================================================

router.delete(
  "/coupons/:id",
  isAuthenticated,
  authorize("admin"),
  asyncHandler(deleteCoupon)
);


// ==================================================
// APPLY COUPON - USER
// POST /api/v1/coupons/apply
// ==================================================

router.post(
  "/coupons/apply",
  isAuthenticated,
  validate(applyCouponSchema),
  asyncHandler(applyCoupon)
);


export default router;