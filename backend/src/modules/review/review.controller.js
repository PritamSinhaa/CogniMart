import {
  createReviewService,
  getProductReviewsService,
  getMyReviewService,
  updateReviewService,
  deleteReviewService,
} from "./review.service.js";


// ==================================================
// CREATE REVIEW
// ==================================================

export const createReview = async (req, res) => {
  const { rating, comment } = req.body;

  const review = await createReviewService(
    req.user._id,
    req.params.productId,
    rating,
    comment
  );

  return res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: {
      review,
    },
  });
};


// ==================================================
// GET PRODUCT REVIEWS
// ==================================================

export const getProductReviews = async (
  req,
  res
) => {
  const reviews =
    await getProductReviewsService(
      req.params.productId
    );

  return res.status(200).json({
    success: true,
    data: {
      reviews,
    },
  });
};


// ==================================================
// GET MY REVIEW
// ==================================================

export const getMyReview = async (
  req,
  res
) => {
  const review =
    await getMyReviewService(
      req.user._id,
      req.params.productId
    );

  return res.status(200).json({
    success: true,
    data: {
      review,
    },
  });
};


// ==================================================
// UPDATE REVIEW
// ==================================================

export const updateReview = async (
  req,
  res
) => {
  const review =
    await updateReviewService(
      req.params.reviewId,
      req.user._id,
      req.body
    );

  return res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: {
      review,
    },
  });
};


// ==================================================
// DELETE REVIEW
// ==================================================

export const deleteReview = async (
  req,
  res
) => {
  await deleteReviewService(
    req.params.reviewId,
    req.user._id
  );

  return res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};