import Category from "../../models/Category.model.js";
import AppError from "../../utils/AppError.js";


export const createCategory = async (categoryData) => {
  const category = await Category.create(categoryData);

  return category;
};

export const getCategories = async () => {
  const categories = await Category.find({
    isActive: true,
  });

  return categories;
};

export const getCategoryById = async (categoryId) => {
  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const updateCategory = async (categoryId, categoryData) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    categoryData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { isActive: false },
    {
      returnDocument: "after",
    }
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};