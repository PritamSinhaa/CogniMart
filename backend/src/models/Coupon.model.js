import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Discount type is required"],
    },

    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },

    maxDiscount: {
      type: Number,
      min: [0, "Maximum discount cannot be negative"],
      default: null,
    },

    minOrderValue: {
      type: Number,
      min: [0, "Minimum order value cannot be negative"],
      default: 0,
    },

    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
      default: null,
    },

    usedCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: [true, "Coupon expiry date is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model(
  "Coupon",
  couponSchema
);

export default Coupon;