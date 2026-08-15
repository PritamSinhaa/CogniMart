import mongoose from "mongoose";

import Order from "../../models/Order.model.js";
import Cart from "../../models/Cart.model.js";
import Product from "../../models/Product.model.js";
import Address from "../../models/Address.model.js";

import AppError from "../../utils/AppError.js";
import calculateDiscountedPrice from "../../utils/calculateDiscountedPrice.js";


// ==================================================
// CREATE ORDER
// ==================================================

export const createOrderService = async (
  userId,
  addressId,
  paymentMethod
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ==========================================
    // GET ADDRESS
    // ==========================================

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    }).session(session);

    if (!address) {
      throw new AppError(
        "Address not found",
        404
      );
    }


    // ==========================================
    // GET CART
    // ==========================================

    const cart = await Cart.findOne({
      user: userId,
    })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new AppError(
        "Cart is empty",
        400
      );
    }


    // ==========================================
    // PREPARE ORDER ITEMS
    // ==========================================

    const orderItems = [];

    let subtotal = 0;


    // ==========================================
    // CHECK PRODUCTS + STOCK
    // ==========================================

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        throw new AppError(
          "Product in cart no longer exists",
          400
        );
      }

      // Product must be active
      if (!product.isActive) {
        throw new AppError(
          `${product.name} is no longer available`,
          400
        );
      }

      // Check stock
      if (item.quantity > product.stock) {
        throw new AppError(
          `Only ${product.stock} units of ${product.name} are available`,
          400
        );
      }


      // ========================================
      // CALCULATE FINAL PRICE
      // ========================================

      const finalPrice =
        calculateDiscountedPrice(
          product.price,
          product.discount
        );


      // ========================================
      // CALCULATE ITEM SUBTOTAL
      // ========================================

      const itemSubtotal =
        finalPrice * item.quantity;


      // ========================================
      // ADD ORDER ITEM
      // ========================================

      orderItems.push({
        product: product._id,
        name: product.name,
        price: finalPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });


      subtotal += itemSubtotal;
    }


    // ==========================================
    // SHIPPING FEE
    // ==========================================

    const shippingFee =
      subtotal >= 1000 ? 0 : 50;


    // ==========================================
    // ORDER DISCOUNT
    // ==========================================

    const discount = 0;


    // ==========================================
    // FINAL TOTAL
    // ==========================================

    const total =
      subtotal +
      shippingFee -
      discount;


    // ==========================================
    // SNAPSHOT SHIPPING ADDRESS
    // ==========================================

    const shippingAddress = {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    };


    // ==========================================
    // CREATE ORDER
    // ==========================================

    const [order] = await Order.create(
      [
        {
          user: userId,

          items: orderItems,

          shippingAddress,

          subtotal,

          discount,

          shippingFee,

          total,

          orderStatus: "pending",

          paymentStatus: "pending",

          paymentMethod,
        },
      ],
      {
        session,
      }
    );


    // ==========================================
    // REDUCE PRODUCT STOCK
    // ==========================================

    for (const item of cart.items) {
      const product = item.product;

      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: product._id,
            stock: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      if (!updatedProduct) {
        throw new AppError(
          `Unable to update stock for ${product.name}`,
          400
        );
      }
    }


    // ==========================================
    // CLEAR CART
    // ==========================================

    cart.items = [];

    await cart.save({
      session,
    });


    // ==========================================
    // COMMIT TRANSACTION
    // ==========================================

    await session.commitTransaction();


    // ==========================================
    // RETURN ORDER
    // ==========================================

    return order;

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    await session.endSession();

  }
};


// ==================================================
// GET MY ORDERS
// ==================================================

export const getMyOrdersService = async (
  userId
) => {
  const orders = await Order.find({
    user: userId,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return orders;
};


// ==================================================
// GET ORDER BY ID
// ==================================================

export const getOrderByIdService = async (
  orderId,
  userId
) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate(
      "items.product",
      "name images slug"
    )
    .lean();

  if (!order) {
    throw new AppError(
      "Order not found",
      404
    );
  }

  return order;
};


// ==================================================
// CANCEL ORDER
// ==================================================

export const cancelOrderService = async (
  orderId,
  userId
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();


    // ==========================================
    // FIND ORDER
    // ==========================================

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).session(session);

    if (!order) {
      throw new AppError(
        "Order not found",
        404
      );
    }


    // ==========================================
    // CHECK STATUS
    // ==========================================

    if (
      [
        "shipped",
        "delivered",
        "cancelled",
      ].includes(order.orderStatus)
    ) {
      throw new AppError(
        `Order cannot be cancelled because it is already ${order.orderStatus}`,
        400
      );
    }


    // ==========================================
    // RESTORE STOCK
    // ==========================================

    for (const item of order.items) {

      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          session,
        }
      );
    }


    // ==========================================
    // UPDATE ORDER
    // ==========================================

    order.orderStatus = "cancelled";

    await order.save({
      session,
    });


    // ==========================================
    // COMMIT
    // ==========================================

    await session.commitTransaction();

    return order;

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    await session.endSession();

  }
};


// ==================================================
// ADMIN - GET ALL ORDERS
// ==================================================

export const getAllOrdersService = async () => {

  const orders = await Order.find()
    .sort({
      createdAt: -1,
    })
    .populate(
      "user",
      "name email"
    )
    .populate(
      "items.product",
      "name images slug"
    )
    .lean();

  return orders;
};


// ==================================================
// ADMIN - UPDATE ORDER STATUS
// ==================================================

export const updateOrderStatusService = async (
  orderId,
  status
) => {

  const order =
    await Order.findById(orderId);

  if (!order) {
    throw new AppError(
      "Order not found",
      404
    );
  }


  // ==========================================
  // CANNOT UPDATE CANCELLED ORDER
  // ==========================================

  if (
    order.orderStatus === "cancelled"
  ) {
    throw new AppError(
      "Cancelled orders cannot be updated",
      400
    );
  }


  // ==========================================
  // CANNOT UPDATE DELIVERED ORDER
  // ==========================================

  if (
    order.orderStatus === "delivered"
  ) {
    throw new AppError(
      "Delivered orders cannot be updated",
      400
    );
  }


  // ==========================================
  // ALLOWED STATUS TRANSITIONS
  // ==========================================

  const allowedTransitions = {

    pending: [
      "confirmed",
      "cancelled",
    ],

    confirmed: [
      "processing",
      "cancelled",
    ],

    processing: [
      "shipped",
      "cancelled",
    ],

    shipped: [
      "delivered",
    ],
  };


  const allowedStatuses =
    allowedTransitions[
      order.orderStatus
    ];


  if (
    !allowedStatuses ||
    !allowedStatuses.includes(status)
  ) {
    throw new AppError(
      `Cannot change order status from ${order.orderStatus} to ${status}`,
      400
    );
  }


  // ==========================================
  // UPDATE
  // ==========================================

  order.orderStatus = status;

  await order.save();

  return order;
};