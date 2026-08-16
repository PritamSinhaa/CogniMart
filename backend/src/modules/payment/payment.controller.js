import {
  createRazorpayOrderService,
  verifyRazorpayPaymentService,
} from "./payment.service.js";
// ==================================================
// CREATE RAZORPAY ORDER
// ==================================================

export const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;

  const userId = req.user._id.toString();

  const paymentOrder = await createRazorpayOrderService(userId, orderId);

  return res.status(201).json({
    success: true,
    message: "Razorpay order created successfully",
    data: paymentOrder,
  });
};

// ==================================================
// VERIFY RAZORPAY PAYMENT
// ==================================================

export const verifyRazorpayPayment = async (
  req,
  res,
) => {
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const userId = req.user._id.toString();

  const order =
    await verifyRazorpayPaymentService(
      userId,
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

  return res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: {
      order,
    },
  });
};