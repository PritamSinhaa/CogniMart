import {
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
  cancelOrderService,
  getAllOrdersService,
  updateOrderStatusService,
} from "./order.service.js";


// CREATE ORDER

export const createOrder = async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  const order = await createOrderService(
    req.user._id,
    addressId,
    paymentMethod
  );

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: {
      order,
    },
  });
};


// =====================================================
// GET MY ORDERS
// =====================================================

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

export const getOrderById = async (req, res) => {
  const order = await getOrderByIdService(
    req.params.id,
    req.user._id
  );

  return res.status(200).json({
    success: true,
    data: {
      order,
    },
  });
};

export const cancelOrder = async (req, res) => {
  const order = await cancelOrderService(
    req.params.id,
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

export const getAllOrders = async (req, res) => {
  const orders = await getAllOrdersService();

  return res.status(200).json({
    success: true,
    data: {
      orders,
    },
  });
};

export const updateOrderStatus = async (req, res) => {
  const order = await updateOrderStatusService(
    req.params.id,
    req.body.status
  );

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: {
      order,
    },
  });
};