import Coupon from "../../models/Coupon.model.js";
import AppError from "../../utils/AppError.js";


// ==================================================
// CREATE COUPON
// ==================================================

export const createCouponService = async (
  couponData
) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    maxDiscount,
    minOrderValue,
    usageLimit,
    expiresAt,
    isActive,
  } = couponData;


  // ==========================================
  // CHECK DUPLICATE CODE
  // ==========================================

  const existingCoupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (existingCoupon) {
    throw new AppError(
      "Coupon with this code already exists",
      409
    );
  }


  // ==========================================
  // CHECK EXPIRY DATE
  // ==========================================

  if (new Date(expiresAt) <= new Date()) {
    throw new AppError(
      "Coupon expiry date must be in the future",
      400
    );
  }


  // ==========================================
  // CREATE COUPON
  // ==========================================

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    description,
    discountType,
    discountValue,
    maxDiscount,
    minOrderValue,
    usageLimit,
    expiresAt,
    isActive,
  });


  return coupon;
};


// ==================================================
// GET ALL COUPONS
// ==================================================

export const getCouponsService = async () => {
  const coupons = await Coupon.find()
    .sort({
      createdAt: -1,
    });


  return coupons;
};


// ==================================================
// GET COUPON BY ID
// ==================================================

export const getCouponByIdService = async (
  couponId
) => {
  const coupon = await Coupon.findById(
    couponId
  );


  if (!coupon) {
    throw new AppError(
      "Coupon not found",
      404
    );
  }


  return coupon;
};


// ==================================================
// UPDATE COUPON
// ==================================================

export const updateCouponService = async (
  couponId,
  couponData
) => {

  // ==========================================
  // FIND COUPON
  // ==========================================

  const coupon = await Coupon.findById(
    couponId
  );


  if (!coupon) {
    throw new AppError(
      "Coupon not found",
      404
    );
  }


  // ==========================================
  // VALIDATE EXPIRY
  // ==========================================

  if (couponData.expiresAt) {

    if (
      new Date(couponData.expiresAt) <=
      new Date()
    ) {
      throw new AppError(
        "Coupon expiry date must be in the future",
        400
      );
    }
  }


  // ==========================================
  // VALIDATE PERCENTAGE
  // ==========================================

  const discountType =
    couponData.discountType ??
    coupon.discountType;

  const discountValue =
    couponData.discountValue ??
    coupon.discountValue;


  if (
    discountType === "percentage" &&
    discountValue > 100
  ) {
    throw new AppError(
      "Percentage discount cannot exceed 100%",
      400
    );
  }


  // ==========================================
  // UPDATE
  // ==========================================

  const updatedCoupon =
    await Coupon.findByIdAndUpdate(
      couponId,
      couponData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );


  return updatedCoupon;
};


// ==================================================
// DELETE COUPON
// ==================================================

export const deleteCouponService = async (
  couponId
) => {

  const coupon = await Coupon.findById(
    couponId
  );


  if (!coupon) {
    throw new AppError(
      "Coupon not found",
      404
    );
  }


  await Coupon.findByIdAndDelete(
    couponId
  );


  return true;
};


// ==================================================
// APPLY / VALIDATE COUPON
// ==================================================

export const applyCouponService = async (
  code,
  orderValue
) => {

  // ==========================================
  // FIND COUPON
  // ==========================================

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });


  if (!coupon) {
    throw new AppError(
      "Invalid coupon code",
      404
    );
  }


  // ==========================================
  // CHECK ACTIVE
  // ==========================================

  if (!coupon.isActive) {
    throw new AppError(
      "This coupon is inactive",
      400
    );
  }


  // ==========================================
  // CHECK EXPIRY
  // ==========================================

  if (
    new Date() >= coupon.expiresAt
  ) {
    throw new AppError(
      "This coupon has expired",
      400
    );
  }


  // ==========================================
  // CHECK USAGE LIMIT
  // ==========================================

  if (
    coupon.usageLimit !== null &&
    coupon.usedCount >=
      coupon.usageLimit
  ) {
    throw new AppError(
      "This coupon usage limit has been reached",
      400
    );
  }


  // ==========================================
  // CHECK MINIMUM ORDER VALUE
  // ==========================================

  if (
    orderValue < coupon.minOrderValue
  ) {
    throw new AppError(
      `Minimum order value of ₹${coupon.minOrderValue} is required`,
      400
    );
  }


  // ==========================================
  // CALCULATE DISCOUNT
  // ==========================================

  let discount = 0;


  if (
    coupon.discountType ===
    "percentage"
  ) {

    discount =
      (orderValue *
        coupon.discountValue) /
      100;


    // Apply maximum discount
    if (
      coupon.maxDiscount !== null &&
      discount > coupon.maxDiscount
    ) {
      discount =
        coupon.maxDiscount;
    }

  } else {

    // Fixed discount
    discount =
      coupon.discountValue;
  }


  // ==========================================
  // DON'T LET DISCOUNT EXCEED ORDER VALUE
  // ==========================================

  if (discount > orderValue) {
    discount = orderValue;
  }


  const finalAmount =
    orderValue - discount;


  return {
    coupon: {
      _id: coupon._id,
      code: coupon.code,
      discountType:
        coupon.discountType,
      discountValue:
        coupon.discountValue,
    },

    orderValue,

    discount,

    finalAmount,
  };
};