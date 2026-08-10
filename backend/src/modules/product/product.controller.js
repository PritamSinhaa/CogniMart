import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.service.js";


export const createProductController = async (req, res) => {
  const product = await createProduct(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

export const getProductsController = async (req, res) => {
  const products = await getProducts();

  res.status(200).json({
    success: true,
    data: products,
  });
};

export const getProductByIdController = async (req, res) => {
  const product = await getProductById(req.params.id);

  res.status(200).json({
    success: true,
    data: product,
  });
};

export const updateProductController = async (req, res) => {
  const product = await updateProduct(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

export const deleteProductController = async (req, res) => {
  await deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};