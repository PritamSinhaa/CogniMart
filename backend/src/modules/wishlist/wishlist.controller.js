import {
  addToWishlistService,
  getWishlistService,
  removeFromWishlistService,
} from "./wishlist.service.js";


// ==================================================
// ADD TO WISHLIST
// ==================================================

export const addToWishlist = async (req, res) => {
  const { productId } = req.params;

  const wishlist = await addToWishlistService(
    req.user._id,
    productId
  );

  return res.status(200).json({
    success: true,
    message: "Product added to wishlist successfully",
    data: {
      wishlist,
    },
  });
};


// ==================================================
// GET WISHLIST
// ==================================================

export const getWishlist = async (req, res) => {
  const wishlist = await getWishlistService(
    req.user._id
  );

  return res.status(200).json({
    success: true,
    data: {
      wishlist,
    },
  });
};


// ==================================================
// REMOVE FROM WISHLIST
// ==================================================

export const removeFromWishlist = async (
  req,
  res
) => {
  const { productId } = req.params;

  const wishlist =
    await removeFromWishlistService(
      req.user._id,
      productId
    );

  return res.status(200).json({
    success: true,
    message:
      "Product removed from wishlist successfully",
    data: {
      wishlist,
    },
  });
};