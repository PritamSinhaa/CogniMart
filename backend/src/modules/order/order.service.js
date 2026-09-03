import mongoose from "mongoose";

import Address from "../../models/Address.model.js";
import Cart from "../../models/Cart.model.js";
import Coupon from "../../models/Coupon.model.js";
import Order from "../../models/Order.model.js";
import Product from "../../models/Product.model.js";

import AppError from "../../utils/AppError.js";
import calculateDiscountedPrice from "../../utils/calculateDiscountedPrice.js";

import {
  applyCouponService,
} from "../coupon/coupon.service.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const ORDER_PRODUCT_POPULATE = {
  path: "items.product",
  select: "name images slug",
};

function calculateShippingFee(subtotal) {
  return subtotal >= 1000 ? 0 : 50;
}

function roundMoney(value) {
  return Number(Number(value).toFixed(2));
}

async function restoreOrderStock(
  order,
  session,
) {
  for (const item of order.items) {
    const updatedProduct =
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          session,
          new: true,
        },
      );

    /*
     * Do not fail cancellation if a product was
     * permanently deleted after the order.
     */
    if (!updatedProduct) {
      console.warn(
        `Could not restore stock for deleted product ${item.product}`,
      );
    }
  }
}

/*
|--------------------------------------------------------------------------
| Create order
|--------------------------------------------------------------------------
*/

export const createOrderService = async (
  userId,
  addressId,
  paymentMethod,
  couponCode = null,
) => {
  /*
   * The normal order endpoint currently completes
   * only COD orders. Online orders must go through
   * the Razorpay creation and verification flow.
   */
  if (paymentMethod === "online") {
    throw new AppError(
      "Online payment is not available yet",
      400,
    );
  }

  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    /*
    |--------------------------------------------------------------------------
    | Verify address ownership
    |--------------------------------------------------------------------------
    */

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    }).session(session);

    if (!address) {
      throw new AppError(
        "Address not found",
        404,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Load database cart
    |--------------------------------------------------------------------------
    */

    const cart = await Cart.findOne({
      user: userId,
    })
      .populate("items.product")
      .session(session);

    if (
      !cart ||
      !Array.isArray(cart.items) ||
      cart.items.length === 0
    ) {
      throw new AppError(
        "Cart is empty",
        400,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Build order snapshot
    |--------------------------------------------------------------------------
    */

    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        throw new AppError(
          "A product in your cart no longer exists",
          400,
        );
      }

      if (!product.isActive) {
        throw new AppError(
          `${product.name} is no longer available`,
          400,
        );
      }

      if (product.stock < 1) {
        throw new AppError(
          `${product.name} is out of stock`,
          400,
        );
      }

      if (
        cartItem.quantity >
        product.stock
      ) {
        throw new AppError(
          `Only ${product.stock} units of ${product.name} are available`,
          400,
        );
      }

      const finalPrice = roundMoney(
        calculateDiscountedPrice(
          product.price,
          product.discount,
        ),
      );

      const itemSubtotal = roundMoney(
        finalPrice *
          cartItem.quantity,
      );

      orderItems.push({
        product: product._id,
        name: product.name,
        price: finalPrice,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,
      });

      subtotal += itemSubtotal;
    }

    subtotal = roundMoney(subtotal);

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    */

    const shippingFee =
      calculateShippingFee(subtotal);

    /*
    |--------------------------------------------------------------------------
    | Coupon
    |--------------------------------------------------------------------------
    */

    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const couponResult =
        await applyCouponService(
          couponCode,
          subtotal,
        );

      discount = roundMoney(
        couponResult.discount || 0,
      );

      appliedCoupon =
        couponResult.coupon || null;
    }

    if (discount > subtotal) {
      discount = subtotal;
    }

    const total = roundMoney(
      subtotal +
        shippingFee -
        discount,
    );

    if (total < 0) {
      throw new AppError(
        "Invalid order total",
        400,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Snapshot address
    |--------------------------------------------------------------------------
    */

    const shippingAddress = {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1:
        address.addressLine1,
      addressLine2:
        address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode:
        address.postalCode,
      country: address.country,
    };

    /*
    |--------------------------------------------------------------------------
    | Create order
    |--------------------------------------------------------------------------
    */

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          shippingAddress,
          subtotal,
          discount,
          couponCode:
            appliedCoupon?.code || null,
          shippingFee,
          total,
          orderStatus: "pending",
          paymentStatus: "pending",
          paymentMethod,
        },
      ],
      {
        session,
      },
    );

    /*
    |--------------------------------------------------------------------------
    | Reduce stock atomically
    |--------------------------------------------------------------------------
    */

    for (const cartItem of cart.items) {
      const product =
        cartItem.product;

      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: product._id,
            isActive: true,
            stock: {
              $gte: cartItem.quantity,
            },
          },
          {
            $inc: {
              stock:
                -cartItem.quantity,
            },
          },
          {
            new: true,
            session,
          },
        );

      if (!updatedProduct) {
        throw new AppError(
          `Unable to reserve stock for ${product.name}`,
          409,
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Increment coupon usage atomically
    |--------------------------------------------------------------------------
    */

    if (appliedCoupon) {
      const updatedCoupon =
        await Coupon.findOneAndUpdate(
          {
            _id: appliedCoupon._id,
            isActive: true,
            $or: [
              {
                usageLimit: null,
              },
              {
                $expr: {
                  $lt: [
                    "$usedCount",
                    "$usageLimit",
                  ],
                },
              },
            ],
          },
          {
            $inc: {
              usedCount: 1,
            },
          },
          {
            new: true,
            session,
          },
        );

      if (!updatedCoupon) {
        throw new AppError(
          "Coupon usage limit has been reached",
          409,
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Clear database cart
    |--------------------------------------------------------------------------
    */

    cart.items = [];

    await cart.save({
      session,
    });

    await session.commitTransaction();

    return order;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

/*
|--------------------------------------------------------------------------
| Get logged-in user's orders
|--------------------------------------------------------------------------
*/

export const getMyOrdersService = async (
  userId,
) => {
  return Order.find({
    user: userId,
  })
    .populate(ORDER_PRODUCT_POPULATE)
    .sort({
      createdAt: -1,
    })
    .lean();
};

/*
|--------------------------------------------------------------------------
| Admin: get one order
|--------------------------------------------------------------------------
*/

export const getAdminOrderByIdService =
  async (orderId) => {
    const order =
      await Order.findById(orderId)
        .populate(
          "user",
          "name email role",
        )
        .populate(
          ORDER_PRODUCT_POPULATE,
        )
        .lean();

    if (!order) {
      throw new AppError(
        "Order not found",
        404,
      );
    }

    return order;
  };

/*
|--------------------------------------------------------------------------
| Get one customer order
|--------------------------------------------------------------------------
*/

export const getOrderByIdService = async (
  orderId,
  userId,
) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate(ORDER_PRODUCT_POPULATE)
    .lean();

  if (!order) {
    throw new AppError(
      "Order not found",
      404,
    );
  }

  return order;
};

/*
|--------------------------------------------------------------------------
| Customer cancellation
|--------------------------------------------------------------------------
*/

export const cancelOrderService = async (
  orderId,
  userId,
) => {
  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).session(session);

    if (!order) {
      throw new AppError(
        "Order not found",
        404,
      );
    }

    if (
      [
        "shipped",
        "delivered",
        "cancelled",
      ].includes(order.orderStatus)
    ) {
      throw new AppError(
        `Order cannot be cancelled because it is already ${order.orderStatus}`,
        400,
      );
    }

    /*
     * Paid online orders require a real payment
     * gateway refund before cancellation.
     */
    if (
      order.paymentMethod ===
        "online" &&
      order.paymentStatus === "paid"
    ) {
      throw new AppError(
        "This paid order requires a refund before cancellation",
        400,
      );
    }

    await restoreOrderStock(
      order,
      session,
    );

    order.orderStatus =
      "cancelled";

    await order.save({
      session,
    });

    await session.commitTransaction();

    return order;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

/*
|--------------------------------------------------------------------------
| Admin: get every order
|--------------------------------------------------------------------------
*/

export const getAllOrdersService =
  async () => {
    return Order.find()
      .populate(
        "user",
        "name email",
      )
      .populate(
        ORDER_PRODUCT_POPULATE,
      )
      .sort({
        createdAt: -1,
      })
      .lean();
  };

/*
|--------------------------------------------------------------------------
| Admin: update order status
|--------------------------------------------------------------------------
*/

export const updateOrderStatusService =
  async (orderId, status) => {
    const session =
      await mongoose.startSession();

    try {
      session.startTransaction();

      const order =
        await Order.findById(
          orderId,
        ).session(session);

      if (!order) {
        throw new AppError(
          "Order not found",
          404,
        );
      }

      if (
        order.orderStatus ===
        "cancelled"
      ) {
        throw new AppError(
          "Cancelled orders cannot be updated",
          400,
        );
      }

      if (
        order.orderStatus ===
        "delivered"
      ) {
        throw new AppError(
          "Delivered orders cannot be updated",
          400,
        );
      }

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

        shipped: ["delivered"],
      };

      const allowedStatuses =
        allowedTransitions[
          order.orderStatus
        ];

      if (
        !allowedStatuses?.includes(
          status,
        )
      ) {
        throw new AppError(
          `Cannot change order status from ${order.orderStatus} to ${status}`,
          400,
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Admin cancellation
      |--------------------------------------------------------------------------
      */

      if (status === "cancelled") {
        if (
          order.paymentMethod ===
            "online" &&
          order.paymentStatus === "paid"
        ) {
          throw new AppError(
            "Refund the online payment before cancelling this order",
            400,
          );
        }

        await restoreOrderStock(
          order,
          session,
        );
      }

      order.orderStatus = status;

      /*
       * For COD, payment happens when the
       * order is successfully delivered.
       */
      if (
        status === "delivered" &&
        order.paymentMethod === "cod"
      ) {
        order.paymentStatus = "paid";
      }

      await order.save({
        session,
      });

      await session.commitTransaction();

      return order;
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      throw error;
    } finally {
      await session.endSession();
    }
  };