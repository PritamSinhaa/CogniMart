import Cart from "../../models/Cart.model.js";
import Product from "../../models/Product.model.js";
import AppError from "../../utils/AppError.js";

export const addToCartService = async (
  userId,
  productId,
  quantity
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (!product.isActive) {
    throw new AppError("Product is not available", 400);
  }

  if (quantity > product.stock) {
    throw new AppError(
      `Only ${product.stock} items are available`,
      400
    );
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
        },
      ],
    });

    return cart;
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new AppError(
        `Only ${product.stock} items are available`,
        400
      );
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  return cart;
};


export const getCartService = async (userId) => {
  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  if (!cart) {
    return {
      items: [],
    };
  }

  return cart;
};

export const updateCartItemService = async (
  userId,
  productId,
  quantity
) => {
  // 1. Find user's cart
  const cart = await Cart.findOne({
    user: userId,
  });

  // 2. Cart doesn't exist
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  // 3. Find product
  const product = await Product.findById(productId);

  // 4. Product doesn't exist
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // 5. Product isn't available
  if (!product.isActive) {
    throw new AppError("Product is not available", 400);
  }

  // 6. Check stock
  if (quantity > product.stock) {
    throw new AppError(
      `Only ${product.stock} items are available`,
      400
    );
  }

  // 7. Find product inside cart
  const existingItem = cart.items.find(
    (item) => item.product.equals(productId)
  );

  // 8. Product isn't in cart
  if (!existingItem) {
    throw new AppError(
      "Product is not in your cart",
      404
    );
  }

  // 9. Update quantity
  existingItem.quantity = quantity;

  // 10. Save cart
  await cart.save();

  // 11. Return updated cart
  return cart;
};

export const removeCartItemService = async (
  userId,
  productId
) => {
  // 1. Find user's cart
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  // 2. Check if product exists in cart
  const itemExists = cart.items.some(
    (item) => item.product.equals(productId)
  );

  if (!itemExists) {
    throw new AppError(
      "Product is not in your cart",
      404
    );
  }

  // 3. Remove item
  cart.items = cart.items.filter(
    (item) => !item.product.equals(productId)
  );

  // 4. Save
  await cart.save();

  return cart;
};

export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = [];

  await cart.save();

  return cart;
};