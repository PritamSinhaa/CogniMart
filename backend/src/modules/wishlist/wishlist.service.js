import Wishlist from "../../models/Wishlist.model.js";
import Product from "../../models/Product.model.js";
import AppError from "../../utils/AppError.js";

// ==================================================
// ADD PRODUCT TO WISHLIST
// ==================================================

export const addToWishlistService = async (
  userId,
  productId
) => {
  // Check product exists
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Find user's wishlist
  let wishlist = await Wishlist.findOne({
    user: userId,
  });

  // Create wishlist if it doesn't exist
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [productId],
    });

    return await wishlist.populate({
      path: "products",
      select:
        "name slug price discount images stock ratings brand category",
    });
  }

  // Check duplicate
  const alreadyExists = wishlist.products.some(
    (id) => id.toString() === productId
  );

  if (alreadyExists) {
    throw new AppError(
      "Product is already in wishlist",
      409
    );
  }

  // Add product
  wishlist.products.push(productId);

  await wishlist.save();

  await wishlist.populate({
    path: "products",
    select:
      "name slug price discount images stock ratings brand category",
  });

  return wishlist;
};

// ==================================================
// GET USER WISHLIST
// ==================================================

export const getWishlistService = async (userId) => {
  const wishlist = await Wishlist.findOne({
    user: userId,
  }).populate({
    path: "products",
    select:
      "name slug price discount images stock ratings brand category",
  });

  // No wishlist yet
  if (!wishlist) {
    return {
      user: userId,
      products: [],
    };
  }

  return wishlist;
};

// ==================================================
// REMOVE PRODUCT FROM WISHLIST
// ==================================================

export const removeFromWishlistService = async (
  userId,
  productId
) => {
  const wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {
    throw new AppError(
      "Wishlist not found",
      404
    );
  }

  const productExists = wishlist.products.some(
    (id) => id.toString() === productId
  );

  if (!productExists) {
    throw new AppError(
      "Product is not in your wishlist",
      404
    );
  }

  wishlist.products =
    wishlist.products.filter(
      (id) => id.toString() !== productId
    );

  await wishlist.save();

  await wishlist.populate({
    path: "products",
    select:
      "name slug price discount images stock ratings brand category",
  });

  return wishlist;
};