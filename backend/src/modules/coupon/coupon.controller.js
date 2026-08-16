import {
  createCouponService,
  getCouponsService,
  getCouponByIdService,
  updateCouponService,
  deleteCouponService,
  applyCouponService,
} from "./coupon.service.js";


// ==================================================
// CREATE COUPON
// ==================================================

export const createCoupon = async (req, res) => {
  const coupon = await createCouponService(
    req.body
  );

  return res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: {
      coupon,
    },
  });
};


// ==================================================
// GET ALL COUPONS
// ==================================================

export const getCoupons = async (req, res) => {
  const coupons = await getCouponsService();

  return res.status(200).json({
    success: true,
    data: {
      coupons,
    },
  });
};


// ==================================================
// GET COUPON BY ID
// ==================================================

export const getCouponById = async (req, res) => {
  const coupon = await getCouponByIdService(
    req.params.id
  );

  return res.status(200).json({
    success: true,
    data: {
      coupon,
    },
  });
};


// ==================================================
// UPDATE COUPON
// ==================================================

export const updateCoupon = async (req, res) => {
  const coupon = await updateCouponService(
    req.params.id,
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    data: {
      coupon,
    },
  });
};


// ==================================================
// DELETE COUPON
// ==================================================

export const deleteCoupon = async (req, res) => {
  await deleteCouponService(
    req.params.id
  );

  return res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
};


// ==================================================
// APPLY COUPON
// ==================================================

export const applyCoupon = async (req, res) => {
  const { code, orderValue } = req.body;

  const result = await applyCouponService(
    code,
    orderValue
  );

  return res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: result,
  });
};