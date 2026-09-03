import Cart from "../../models/Cart.model.js";
import Product from "../../models/Product.model.js";

import AppError from "../../utils/AppError.js";

/*
|--------------------------------------------------------------------------
| Population configuration
|--------------------------------------------------------------------------
|
| Product.category is stored as a string, not as a MongoDB ObjectId.
| Therefore, category must not be populated.
|
*/

const CART_PRODUCT_POPULATE = {
  path: "items.product",

  select: "name slug price discount images stock category brand isActive",
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

async function populateCart(cartId) {
  return Cart.findById(cartId).populate(CART_PRODUCT_POPULATE).lean();
}

function findCartItem(cart, productId) {
  return cart.items.find((item) => String(item.product) === String(productId));
}

/*
|--------------------------------------------------------------------------
| Add item
|--------------------------------------------------------------------------
*/

export const addToCartService = async (userId, productId, quantity) => {
  const product = await Product.findById(productId).select(
    "name stock isActive",
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (!product.isActive) {
    throw new AppError("Product is not available", 400);
  }

  if (product.stock < 1) {
    throw new AppError("Product is out of stock", 400);
  }

  if (quantity > product.stock) {
    throw new AppError(
      `Only ${product.stock} units of ${product.name} are available`,
      400,
    );
  }

  let cart = await Cart.findOne({
    user: userId,
  });

  /*
   * Create a new cart when the
   * customer does not have one.
   */
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

    return populateCart(cart._id);
  }

  const existingItem = findCartItem(cart, productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new AppError(
        `Only ${product.stock} units of ${product.name} are available`,
        400,
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

  return populateCart(cart._id);
};

/*
|--------------------------------------------------------------------------
| Get cart
|--------------------------------------------------------------------------
*/

export const getCartService = async (userId) => {
  const cart = await Cart.findOne({
    user: userId,
  })
    .populate(CART_PRODUCT_POPULATE)
    .lean();

  if (!cart) {
    return {
      user: userId,
      items: [],
    };
  }

  return cart;
};

/*
|--------------------------------------------------------------------------
| Update item quantity
|--------------------------------------------------------------------------
*/

export const updateCartItemService = async (userId, productId, quantity) => {
  const [cart, product] = await Promise.all([
    Cart.findOne({
      user: userId,
    }),

    Product.findById(productId).select("name stock isActive"),
  ]);

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (!product.isActive) {
    throw new AppError("Product is not available", 400);
  }

  if (product.stock < 1) {
    throw new AppError("Product is out of stock", 400);
  }

  if (quantity > product.stock) {
    throw new AppError(
      `Only ${product.stock} units of ${product.name} are available`,
      400,
    );
  }

  const existingItem = findCartItem(cart, productId);

  if (!existingItem) {
    throw new AppError("Product is not in your cart", 404);
  }

  existingItem.quantity = quantity;

  await cart.save();

  return populateCart(cart._id);
};

/*
|--------------------------------------------------------------------------
| Remove item
|--------------------------------------------------------------------------
*/

export const removeCartItemService = async (userId, productId) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const itemExists = Boolean(findCartItem(cart, productId));

  if (!itemExists) {
    throw new AppError("Product is not in your cart", 404);
  }

  cart.items = cart.items.filter(
    (item) => String(item.product) !== String(productId),
  );

  await cart.save();

  return populateCart(cart._id);
};

/*
|--------------------------------------------------------------------------
| Clear cart
|--------------------------------------------------------------------------
*/

export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  /*
   * Clearing a nonexistent cart
   * is treated as a successful,
   * idempotent operation.
   */
  if (!cart) {
    return {
      user: userId,
      items: [],
    };
  }

  cart.items = [];

  await cart.save();

  return populateCart(cart._id);
};
