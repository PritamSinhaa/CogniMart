import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // ==========================================
    // PRODUCT NAME
    // ==========================================

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },

    // ==========================================
    // SLUG
    // ==========================================

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // ==========================================
    // DESCRIPTION
    // ==========================================

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },

    // ==========================================
    // PRICE
    // ==========================================

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    // ==========================================
    // DISCOUNT
    // ==========================================

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },

    // ==========================================
    // CATEGORY
    // ==========================================

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      index: true,
    },

    // ==========================================
    // BRAND
    // ==========================================

    brand: {
      type: String,
      required: [true, "Product brand is required"],
      trim: true,
      index: true,
    },

    // ==========================================
    // IMAGES
    // ==========================================

    images: {
      type: [String],
      default: [],
    },

    // ==========================================
    // STOCK
    // ==========================================

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    // ==========================================
    // SKU
    // ==========================================

    sku: {
      type: String,
      required: [true, "Product SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    // ==========================================
    // RATINGS
    // ==========================================

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // ==========================================
    // SPECIFICATIONS
    // ==========================================

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    // ==========================================
    // ACTIVE STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },

  {
    timestamps: true,
  },
);

// ==================================================
// VIRTUAL: DISCOUNTED PRICE
// ==================================================

productSchema.virtual("discountedPrice").get(function () {
  return Number((this.price - (this.price * this.discount) / 100).toFixed(2));
});

// ==================================================
// INCLUDE VIRTUALS IN JSON RESPONSE
// ==================================================

productSchema.set("toJSON", {
  virtuals: true,
});

// ==================================================
// INCLUDE VIRTUALS IN OBJECT
// ==================================================

productSchema.set("toObject", {
  virtuals: true,
});

// ==================================================
// CREATE MODEL
// ==================================================

const Product = mongoose.model("Product", productSchema);

export default Product;
