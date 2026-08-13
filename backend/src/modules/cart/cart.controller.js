import {
  addToCartService,
  getCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from "./cart.service.js";

export const addToCart = async (req, res) => {
  const cart = await addToCartService(
    req.user._id,
    req.body.productId,
    req.body.quantity
  );

  return res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    data: {
      cart,
    },
  });
};

export const getCart = async (req, res) => {
  const cart = await getCartService(req.user._id);

  return res.status(200).json({
    success: true,
    data: {
      cart,
    },
  });
};

export const updateCartItem = async (req, res) => {
  const cart = await updateCartItemService(
    req.user._id,
    req.params.productId,
    req.body.quantity
  );

  return res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    data: {
      cart,
    },
  });
};

export const removeCartItem = async (req, res) => {
  const cart = await removeCartItemService(
    req.user._id,
    req.params.productId
  );

  return res.status(200).json({
    success: true,
    message: "Cart item removed successfully",
    data: {
      cart,
    },
  });
};

export const clearCart = async (req, res) => {
  const cart = await clearCartService(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    data: {
      cart,
    },
  });
};