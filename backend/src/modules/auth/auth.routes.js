import express from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "./auth.controller.js";

import validate from "../../middleware/validate.middleware.js";
import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/me",
  isAuthenticated,
  getMe
);

router.post(
  "/logout",
  isAuthenticated,
  logout
);

export default router;