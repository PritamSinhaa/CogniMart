import express from "express";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "./payment.controller.js";

import validate from "../../middleware/validate.middleware.js";
import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";

import {
  createPaymentOrderSchema,
  verifyPaymentSchema,
} from "./payment.validation.js";

const router = express.Router();

// ==================================================
// CREATE RAZORPAY ORDER
// ==================================================

router.post(
  "/create",
  isAuthenticated,
  validate(createPaymentOrderSchema),
  createRazorpayOrder,
);

// ==================================================
// VERIFY RAZORPAY PAYMENT
// ==================================================

router.post(
  "/verify",
  isAuthenticated,
  validate(verifyPaymentSchema),
  verifyRazorpayPayment,
);

export default router;
