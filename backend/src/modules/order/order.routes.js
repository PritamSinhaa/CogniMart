import { Router } from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "./order.controller.js";

import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "./order.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import validate from "../../middleware/validate.middleware.js";

const router = Router();


// ==========================================
// CREATE ORDER
// ==========================================

router.post(
  "/",
  isAuthenticated,
  validate(createOrderSchema),
  asyncHandler(createOrder)
);


// ==========================================
// MY ORDER HISTORY
// ==========================================

router.get(
  "/",
  isAuthenticated,
  asyncHandler(getMyOrders)
);


// ==========================================
// ADMIN - ALL ORDERS
// IMPORTANT: MUST COME BEFORE /:id
// ==========================================

router.get(
  "/admin",
  isAuthenticated,
  authorize("admin"),
  asyncHandler(getAllOrders)
);


// ==========================================
// ORDER DETAILS
// ==========================================

router.get(
  "/:id",
  isAuthenticated,
  asyncHandler(getOrderById)
);


// ==========================================
// CANCEL ORDER
// ==========================================

router.patch(
  "/:id/cancel",
  isAuthenticated,
  asyncHandler(cancelOrder)
);

router.patch(
  "/admin/:id/status",
  isAuthenticated,
  authorize("admin"),
  validate(updateOrderStatusSchema),
  asyncHandler(updateOrderStatus)
);


export default router;