import Review from "../../models/Review.model.js";
import Product from "../../models/Product.model.js";
import Order from "../../models/Order.model.js";
import AppError from "../../utils/AppError.js";


// ==================================================
// CREATE REVIEW
// ==================================================

export const createReviewService = async (
  userId,
  productId,
  rating,
  comment
) => {

  // ==========================================
  // CHECK PRODUCT
  // ==========================================

  const product = await Product.findById(
    productId
  );

  if (!product) {
    throw new AppError(
      "Product not found",
      404
    );
  }


  // ==========================================
  // CHECK IF USER ALREADY REVIEWED PRODUCT
  // ==========================================

  const existingReview =
    await Review.findOne({
      user: userId,
      product: productId,
    });

  if (existingReview) {
    throw new AppError(
      "You have already reviewed this product",
      409
    );
  }


  // ==========================================
  // FIND DELIVERED ORDER CONTAINING PRODUCT
  // ==========================================

  const order = await Order.findOne({
    user: userId,
    orderStatus: "delivered",
    "items.product": productId,
  }).sort({
    createdAt: -1,
  });

  if (!order) {
    throw new AppError(
      "You can only review products you have purchased and received",
      403
    );
  }


  // ==========================================
  // CREATE REVIEW
  // ==========================================

  const review = await Review.create({
    user: userId,
    product: productId,
    order: order._id,
    rating,
    comment,
    isVerifiedPurchase: true,
  });


  // ==========================================
  // RECALCULATE PRODUCT RATINGS
  // ==========================================

  const ratingStats =
    await Review.aggregate([
      {
        $match: {
          product: product._id,
        },
      },

      {
        $group: {
          _id: "$product",

          averageRating: {
            $avg: "$rating",
          },

          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);


  if (ratingStats.length > 0) {

    const averageRating =
      Number(
        ratingStats[0].averageRating.toFixed(2)
      );

    const totalReviews =
      ratingStats[0].totalReviews;


    await Product.findByIdAndUpdate(
      productId,
      {
        "ratings.average": averageRating,
        "ratings.count": totalReviews,
      },
      {
        runValidators: true,
      }
    );
  }


  return review;
};


// ==================================================
// GET PRODUCT REVIEWS
// ==================================================

export const getProductReviewsService = async (
  productId
) => {

  // ==========================================
  // CHECK PRODUCT
  // ==========================================

  const product = await Product.findById(
    productId
  );

  if (!product) {
    throw new AppError(
      "Product not found",
      404
    );
  }


  // ==========================================
  // GET REVIEWS
  // ==========================================

  const reviews = await Review.find({
    product: productId,
  })
    .populate(
      "user",
      "name"
    )
    .sort({
      createdAt: -1,
    })
    .lean();


  return reviews;
};


// ==================================================
// GET MY REVIEW FOR PRODUCT
// ==================================================

export const getMyReviewService = async (
  userId,
  productId
) => {

  const review = await Review.findOne({
    user: userId,
    product: productId,
  })
    .populate(
      "user",
      "name"
    )
    .lean();


  if (!review) {
    throw new AppError(
      "Review not found",
      404
    );
  }


  return review;
};


// ==================================================
// UPDATE REVIEW
// ==================================================

export const updateReviewService = async (
  reviewId,
  userId,
  updateData
) => {

  // ==========================================
  // FIND REVIEW
  // ==========================================

  const review =
    await Review.findOne({
      _id: reviewId,
      user: userId,
    });

  if (!review) {
    throw new AppError(
      "Review not found",
      404
    );
  }


  // ==========================================
  // UPDATE FIELDS
  // ==========================================

  if (
    updateData.rating !== undefined
  ) {
    review.rating =
      updateData.rating;
  }

  if (
    updateData.comment !== undefined
  ) {
    review.comment =
      updateData.comment;
  }


  await review.save();


  // ==========================================
  // RECALCULATE PRODUCT RATING
  // ==========================================

  const ratingStats =
    await Review.aggregate([
      {
        $match: {
          product: review.product,
        },
      },

      {
        $group: {
          _id: "$product",

          averageRating: {
            $avg: "$rating",
          },

          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);


  if (ratingStats.length > 0) {

    const averageRating =
      Number(
        ratingStats[0].averageRating.toFixed(2)
      );

    const totalReviews =
      ratingStats[0].totalReviews;


    await Product.findByIdAndUpdate(
      review.product,
      {
        "ratings.average": averageRating,
        "ratings.count": totalReviews,
      },
      {
        runValidators: true,
      }
    );
  }


  return review;
};


// ==================================================
// DELETE REVIEW
// ==================================================

export const deleteReviewService = async (
  reviewId,
  userId
) => {

  // ==========================================
  // FIND REVIEW
  // ==========================================

  const review =
    await Review.findOne({
      _id: reviewId,
      user: userId,
    });

  if (!review) {
    throw new AppError(
      "Review not found",
      404
    );
  }


  const productId =
    review.product;


  // ==========================================
  // DELETE
  // ==========================================

  await Review.findByIdAndDelete(
    reviewId
  );


  // ==========================================
  // RECALCULATE RATINGS
  // ==========================================

  const ratingStats =
    await Review.aggregate([
      {
        $match: {
          product: productId,
        },
      },

      {
        $group: {
          _id: "$product",

          averageRating: {
            $avg: "$rating",
          },

          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);


  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  if (ratingStats.length > 0) {

    const averageRating =
      Number(
        ratingStats[0].averageRating.toFixed(2)
      );

    const totalReviews =
      ratingStats[0].totalReviews;


    await Product.findByIdAndUpdate(
      productId,
      {
        "ratings.average": averageRating,
        "ratings.count": totalReviews,
      }
    );

  } else {

    // No reviews left

    await Product.findByIdAndUpdate(
      productId,
      {
        "ratings.average": 0,
        "ratings.count": 0,
      }
    );
  }


  return true;
};