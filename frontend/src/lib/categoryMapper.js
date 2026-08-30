export function mapCategory(category) {
  if (!category) {
    return null;
  }

  return {
    id: category._id || category.id,
    name:
      category.name ||
      "Unnamed category",
    slug: category.slug || "",
    description:
      category.description ||
      `Explore products in ${category.name}.`,
    image: category.image || null,
    isActive:
      category.isActive ?? true,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function mapCategories(categories) {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories
    .map(mapCategory)
    .filter(Boolean);
}