import { Router } from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "./wishlist.controller.js";

import {
  productIdParamSchema,
} from "./wishlist.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();


// ADD TO WISHLIST

router.post(
  "/wishlist/:productId",
  isAuthenticated,
  validate(productIdParamSchema, "params"),
  asyncHandler(addToWishlist)
);


// GET WISHLIST

router.get(
  "/wishlist",
  isAuthenticated,
  asyncHandler(getWishlist)
);


// REMOVE FROM WISHLIST

router.delete(
  "/wishlist/:productId",
  isAuthenticated,
  validate(productIdParamSchema, "params"),
  asyncHandler(removeFromWishlist)
);


export default router;