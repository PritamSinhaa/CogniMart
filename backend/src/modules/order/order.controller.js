import {
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
  cancelOrderService,
  getAllOrdersService,
  updateOrderStatusService,
} from "./order.service.js";


// ==================================================
// CREATE ORDER
// ==================================================

export const createOrder = async (req, res) => {
  const {
    addressId,
    paymentMethod,
    couponCode,
  } = req.body;

  const order = await createOrderService(
    req.user._id,
    addressId,
    paymentMethod,
    couponCode
  );

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: {
      order,
    },
  });
};


// ==================================================
// GET MY ORDERS
// ==================================================

export const getMyOrders = async (req, res) => {
  const orders = await getMyOrdersService(
    req.user._id
  );

  return res.status(200).json({
    success: true,
    data: {
      orders,
    },
  });
};


// ==================================================
// GET ORDER BY ID
// ==================================================

export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  const order = await getOrderByIdService(
    orderId,
    req.user._id
  );

  return res.status(200).json({
    success: true,
    data: {
      order,
    },
  });
};


// ==================================================
// CANCEL ORDER
// ==================================================

export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  const order = await cancelOrderService(
    orderId,
    req.user._id
  );

  return res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: {
      order,
    },
  });
};


// ==================================================
// ADMIN - GET ALL ORDERS
// ==================================================

export const getAllOrders = async (req, res) => {
  const orders = await getAllOrdersService();

  return res.status(200).json({
    success: true,
    data: {
      orders,
    },
  });
};


// ==================================================
// ADMIN - UPDATE ORDER STATUS
// ==================================================

export const updateOrderStatus = async (
  req,
  res
) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order =
    await updateOrderStatusService(
      orderId,
      status
    );

  return res.status(200).json({
    success: true,
    message:
      "Order status updated successfully",
    data: {
      order,
    },
  });
};