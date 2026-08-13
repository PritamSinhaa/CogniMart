import { Router } from "express";

import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "./address.controller.js";

import {
  createAddressSchema,
  updateAddressSchema,
  addressIdSchema,
} from "./address.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  validate(createAddressSchema),
  asyncHandler(createAddress)
);

router.get(
  "/",
  isAuthenticated,
  asyncHandler(getAddresses)
);

router.get(
  "/:id",
  isAuthenticated,
  validate(addressIdSchema, "params"),
  asyncHandler(getAddressById)
);

router.patch(
  "/:id/default",
  isAuthenticated,
  validate(addressIdSchema, "params"),
  asyncHandler(setDefaultAddress)
);

router.patch(
  "/:id",
  isAuthenticated,
  validate(addressIdSchema, "params"),
  validate(updateAddressSchema),
  asyncHandler(updateAddress)
);

router.delete(
  "/:id",
  isAuthenticated,
  validate(addressIdSchema, "params"),
  asyncHandler(deleteAddress)
);

export default router;