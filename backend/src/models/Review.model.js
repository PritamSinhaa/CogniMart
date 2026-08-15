import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },


    // ==========================================
    // PRODUCT
    // ==========================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      index: true,
    },


    // ==========================================
    // ORDER
    // ==========================================

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },


    // ==========================================
    // RATING
    // ==========================================

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },


    // ==========================================
    // REVIEW
    // ==========================================

    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [
        3,
        "Review must be at least 3 characters",
      ],
      maxlength: [
        1000,
        "Review cannot exceed 1000 characters",
      ],
    },


    // ==========================================
    // VERIFIED PURCHASE
    // ==========================================

    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);


// ==============================================
// ONE REVIEW PER USER PER PRODUCT
// ==============================================

reviewSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  }
);


const Review = mongoose.model(
  "Review",
  reviewSchema
);

export default Review;