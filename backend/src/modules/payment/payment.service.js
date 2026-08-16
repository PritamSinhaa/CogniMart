import razorpay from "../../config/razorpay.js";
import Order from "../../models/Order.model.js";
import AppError from "../../utils/AppError.js";
import crypto from "crypto";

// ==================================================
// CREATE RAZORPAY ORDER
// ==================================================

export const createRazorpayOrderService = async (userId, orderId) => {
  // ==========================================
  // FIND USER'S ORDER
  // ==========================================

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // ==========================================
  // CHECK PAYMENT METHOD
  // ==========================================

  if (order.paymentMethod !== "online") {
    throw new AppError(
      "Razorpay payment is only available for online orders",
      400,
    );
  }

  // ==========================================
  // CHECK PAYMENT STATUS
  // ==========================================

  if (order.paymentStatus === "paid") {
    throw new AppError("Order has already been paid", 400);
  }

  // ==========================================
  // CHECK ORDER STATUS
  // ==========================================

  if (order.orderStatus === "cancelled") {
    throw new AppError("Cancelled orders cannot be paid", 400);
  }

  // ==========================================
  // CHECK TOTAL
  // ==========================================

  if (!order.total || order.total <= 0) {
    throw new AppError("Invalid order total", 400);
  }

  // ==========================================
  // REUSE EXISTING RAZORPAY ORDER
  // ==========================================

  if (order.razorpayOrderId) {
    return {
      order,
      razorpayOrderId: order.razorpayOrderId,
      amount: Math.round(order.total * 100),
      currency: "INR",
    };
  }

  // ==========================================
  // CONVERT INR TO PAISE
  // ==========================================

  const amountInPaise = Math.round(order.total * 100);

  // ==========================================
  // CREATE RAZORPAY ORDER
  // ==========================================

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `order_${order._id}`,
  });

  // ==========================================
  // SAVE RAZORPAY ORDER ID
  // ==========================================

  order.razorpayOrderId = razorpayOrder.id;

  await order.save();

  // ==========================================
  // RETURN PAYMENT DATA
  // ==========================================

  return {
    order,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
  
};
// ==================================================
// VERIFY RAZORPAY PAYMENT
// ==================================================

export const verifyRazorpayPaymentService = async (
  userId,
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
) => {
  // ==========================================
  // FIND USER'S ORDER
  // ==========================================

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // ==========================================
  // CHECK PAYMENT METHOD
  // ==========================================

  if (order.paymentMethod !== "online") {
    throw new AppError(
      "This order is not an online payment order",
      400,
    );
  }

  // ==========================================
  // CHECK PAYMENT STATUS
  // ==========================================

  if (order.paymentStatus === "paid") {
    throw new AppError(
      "Order has already been paid",
      400,
    );
  }

  // ==========================================
  // CHECK RAZORPAY ORDER ID
  // ==========================================

  if (
    !order.razorpayOrderId ||
    order.razorpayOrderId !== razorpayOrderId
  ) {
    throw new AppError(
      "Invalid Razorpay order ID",
      400,
    );
  }

  // ==========================================
  // GENERATE SIGNATURE
  // ==========================================

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET,
    )
    .update(
      `${razorpayOrderId}|${razorpayPaymentId}`,
    )
    .digest("hex");

  // ==========================================
  // COMPARE SIGNATURE
  // ==========================================

  if (generatedSignature !== razorpaySignature) {
    throw new AppError(
      "Payment verification failed",
      400,
    );
  }

  // ==========================================
  // PAYMENT VERIFIED
  // ==========================================

  order.razorpayPaymentId = razorpayPaymentId;

  order.razorpaySignature = razorpaySignature;

  order.paymentStatus = "paid";

  await order.save();

  // ==========================================
  // RETURN ORDER
  // ==========================================

  return order;
};
