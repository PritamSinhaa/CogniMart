import Product from "../../models/Product.model.js";
import AppError from "../../utils/AppError.js";

// ===============================
// CREATE PRODUCT
// ===============================

export const createProduct = async (productData) => {
  const {
    name,
    slug,
    description,
    price,
    discount,
    category,
    brand,
    images,
    stock,
    sku,
    specifications,
    isActive,
  } = productData;

  // Check duplicate slug
  const existingSlug = await Product.findOne({ slug });

  if (existingSlug) {
    throw new AppError("Product with this slug already exists", 409);
  }

  // Check duplicate SKU
  const existingSku = await Product.findOne({ sku });

  if (existingSku) {
    throw new AppError("Product with this SKU already exists", 409);
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    discount,
    category,
    brand,
    images,
    stock,
    sku,
    specifications,
    isActive,
  });

  return product;
};

// ===============================
// GET ALL PRODUCTS
// ===============================

export const getProducts = async (filters = {}, includeInactive = false) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    isActive,

    // Pagination
    page = 1,
    limit = 10,

    // Sorting
    sort = "newest",
  } = filters;

  /*
   * Customer requests always receive active products.
   *
   * Admin requests can see active and inactive products.
   */
  const query = includeInactive
    ? {}
    : {
        isActive: true,
      };

  // ==========================================
  // CATEGORY FILTER
  // ==========================================

  if (category) {
    query.category = category;
  }

  // ==========================================
  // BRAND FILTER
  // ==========================================

  if (brand) {
    query.brand = brand;
  }

  // ==========================================
  // ACTIVE FILTER
  // ==========================================

  if (includeInactive && isActive !== undefined) {
    query.isActive = isActive === true || isActive === "true";
  }

  // ==========================================
  // PRICE FILTER
  // ==========================================

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};

    if (minPrice !== undefined) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      query.price.$lte = Number(maxPrice);
    }
  }

  // ==========================================
  // SEARCH
  // ==========================================

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // ==========================================
  // PAGINATION
  // ==========================================

  const currentPage = Math.max(Number(page), 1);
  const itemsPerPage = Math.min(Math.max(Number(limit), 1), 100);

  const skip = (currentPage - 1) * itemsPerPage;

  // ==========================================
  // SORTING
  // ==========================================

  let sortOption = {};

  switch (sort) {
    case "price_asc":
      sortOption = { price: 1 };
      break;

    case "price_desc":
      sortOption = { price: -1 };
      break;

    case "name_asc":
      sortOption = { name: 1 };
      break;

    case "name_desc":
      sortOption = { name: -1 };
      break;

    case "oldest":
      sortOption = { createdAt: 1 };
      break;

    case "newest":
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  // ==========================================
  // GET TOTAL
  // ==========================================

  const totalProducts = await Product.countDocuments(query);

  // ==========================================
  // GET PRODUCTS
  // ==========================================

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(itemsPerPage);

  // ==========================================
  // PAGINATION INFORMATION
  // ==========================================

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return {
    products,

    pagination: {
      currentPage,
      itemsPerPage,
      totalProducts,
      totalPages,

      hasNextPage: currentPage < totalPages,

      hasPreviousPage: currentPage > 1,
    },
  };
};

export const getAdminProducts = async (filters = {}) => {
  return getProducts(filters, true);
};

// ===============================
// GET PRODUCT BY ID
// ===============================

export const getProductById = async (
  productId,
) => {
  const product =
    await Product.findOne({
      _id: productId,
      isActive: true,
    });

  if (!product) {
    throw new AppError(
      "Product not found",
      404,
    );
  }

  return product;
};
// ===============================
// GET PRODUCT BY SLUG
// ===============================

export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({
    slug,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// ===============================
// UPDATE PRODUCT
// ===============================

export const updateProduct = async (productId, productData) => {
  // Check product exists
  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  // Check duplicate slug
  if (productData.slug) {
    const duplicateSlug = await Product.findOne({
      slug: productData.slug,
      _id: {
        $ne: productId,
      },
    });

    if (duplicateSlug) {
      throw new AppError("Product with this slug already exists", 409);
    }
  }

  // Check duplicate SKU
  if (productData.sku) {
    const duplicateSku = await Product.findOne({
      sku: productData.sku,
      _id: {
        $ne: productId,
      },
    });

    if (duplicateSku) {
      throw new AppError("Product with this SKU already exists", 409);
    }
  }

  const product = await Product.findByIdAndUpdate(productId, productData, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// ===============================
// DELETE PRODUCT
// ===============================

export const deleteProduct = async (
  productId,
) => {
  const product =
    await Product.findByIdAndUpdate(
      productId,
      {
        isActive: false,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

  if (!product) {
    throw new AppError(
      "Product not found",
      404,
    );
  }

  return product;
};
// ===============================
// DEACTIVATE PRODUCT
// ===============================

export const deactivateProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    {
      isActive: false,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const getAdminProductById =
  async (productId) => {
    const product =
      await Product.findById(
        productId,
      );

    if (!product) {
      throw new AppError(
        "Product not found",
        404,
      );
    }

    return product;
  };

// ===============================
// ACTIVATE PRODUCT
// ===============================

export const activateProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    {
      isActive: true,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};
