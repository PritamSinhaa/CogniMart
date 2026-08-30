import {
  createProduct,
  deleteProduct,
  getAdminProductById,
  getAdminProducts,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.service.js";

export const createProductController = async (req, res) => {
  const product = await createProduct(req.body);

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

export const getProductsController = async (req, res) => {
  const result = await getProducts(req.query);

  return res.status(200).json({
    success: true,
    data: result,
  });
};

export const getAdminProductByIdController = async (req, res) => {
  const product = await getAdminProductById(req.params.id);

  return res.status(200).json({
    success: true,
    data: product,
  });
};

export const getAdminProductsController = async (req, res) => {
  const result = await getAdminProducts(req.query);

  return res.status(200).json({
    success: true,
    data: result,
  });
};

export const getProductByIdController = async (req, res) => {
  const product = await getProductById(req.params.id);

  return res.status(200).json({
    success: true,
    data: product,
  });
};

export const updateProductController = async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

export const deleteProductController = async (req, res) => {
  const product = await deleteProduct(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Product deactivated successfully",
    data: product,
  });
};
