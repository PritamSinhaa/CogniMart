import { Router } from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} from "./order.controller.js";

import {
  createOrderSchema,
  orderIdSchema,
  updateOrderStatusSchema,
} from "./order.validation.js";

import isAuthenticated from "../../middleware/isAuthenticated.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Customer routes
|--------------------------------------------------------------------------
*/

// Create an order from the logged-in user's database cart
router.post(
  "/",
  isAuthenticated,
  validate(createOrderSchema),
  asyncHandler(createOrder),
);

// Get logged-in user's orders
router.get("/", isAuthenticated, asyncHandler(getMyOrders));

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
|
| Keep these routes before /:orderId.
|
*/

// Get every order
router.get(
  "/admin",
  isAuthenticated,
  authorize("admin"),
  asyncHandler(getAllOrders),
);

router.get(
  "/admin/:orderId",
  isAuthenticated,
  authorize("admin"),
  validate(orderIdSchema, "params"),
  asyncHandler(getAdminOrderById),
);
// Update an order's status
router.patch(
  "/admin/:orderId/status",
  isAuthenticated,
  authorize("admin"),
  validate(orderIdSchema, "params"),
  validate(updateOrderStatusSchema),
  asyncHandler(updateOrderStatus),
);

/*
|--------------------------------------------------------------------------
| Dynamic customer routes
|--------------------------------------------------------------------------
*/

// Get one order owned by the logged-in user
router.get(
  "/:orderId",
  isAuthenticated,
  validate(orderIdSchema, "params"),
  asyncHandler(getOrderById),
);

// Cancel one order owned by the logged-in user
router.patch(
  "/:orderId/cancel",
  isAuthenticated,
  validate(orderIdSchema, "params"),
  asyncHandler(cancelOrder),
);

export default router;
