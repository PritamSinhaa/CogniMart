import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.service.js";

export const createCategoryController = async (req, res) => {
  const category = await createCategory(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
};

export const getCategoriesController = async (req, res) => {
  const categories = await getCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
};

export const getCategoryByIdController = async (req, res) => {
  const category = await getCategoryById(req.params.id);

  res.status(200).json({
    success: true,
    data: category,
  });
};

export const updateCategoryController = async (req, res) => {
  const category = await updateCategory(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
};

export const deleteCategoryController = async (req, res) => {
  const category = await deleteCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: category,
  });
};