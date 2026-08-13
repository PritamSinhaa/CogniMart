import { Router } from "express";

import {
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
} from "./user.controller.js";

import {
  updateProfileSchema,
  changePasswordSchema,
  userIdSchema,
  updateUserRoleSchema,
} from "./user.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

// Logged-in user
router.patch(
  "/profile",
  isAuthenticated,
  validate(updateProfileSchema),
  asyncHandler(updateProfile)
);

router.patch(
  "/password",
  isAuthenticated,
  validate(changePasswordSchema),
  asyncHandler(changePassword)
);

// Admin user management
router.get(
  "/",
  isAuthenticated,
  authorize("admin"),
  asyncHandler(getUsers)
);

router.get(
  "/:id",
  isAuthenticated,
  authorize("admin"),
  validate(userIdSchema, "params"),
  asyncHandler(getUserById)
);

router.patch(
  "/:id/role",
  isAuthenticated,
  authorize("admin"),
  validate(userIdSchema, "params"),
  validate(updateUserRoleSchema),
  asyncHandler(updateUserRole)
);

router.delete(
  "/:id",
  isAuthenticated,
  authorize("admin"),
  validate(userIdSchema, "params"),
  asyncHandler(deactivateUser)
);

export default router;