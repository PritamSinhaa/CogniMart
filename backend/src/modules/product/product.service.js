import Product from "../../models/Product.model.js";
import AppError from "../../utils/AppError.js";

export const createProduct = async (productData) => {
  const product = await Product.create(productData);

  return product;
};

export const getProducts = async () => {
  const products = await Product.find({
    isActive: true,
  });

  return products;
};

export const getProductById = async (productId) => {
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const updateProduct = async (productId, productData) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    productData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { isActive: false },
    {
      returnDocument: "after",
    }
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};