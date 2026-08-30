import { ArrowLeft, ImagePlus, Save } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  createProduct,
  getAdminProductById,
  updateProduct,
} from "../../../api/products.api";

import useCategories from "../../../hooks/useCategories";

const INITIAL_FORM = {
  name: "",
  slug: "",
  description: "",
  category: "",
  brand: "",
  sku: "",
  price: "",
  discount: "0",
  stock: "",
  images: "",
  color: "",
  storage: "",
  ram: "",
  isActive: true,
};

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractProduct(response) {
  return response?.data?.product || response?.product || response?.data || null;
}

function createFormFromProduct(product) {
  return {
    name: product.name || "",
    slug: product.slug || "",
    description: product.description || "",
    category:
      typeof product.category === "object"
        ? product.category?.name || ""
        : product.category || "",
    brand: product.brand || "",
    sku: product.sku || "",
    price: product.price?.toString() || "",
    discount: product.discount?.toString() || "0",
    stock: product.stock?.toString() ?? "",
    images: Array.isArray(product.images) ? product.images.join("\n") : "",
    color: product.specifications?.color || "",
    storage: product.specifications?.storage || "",
    ram: product.specifications?.ram || "",
    isActive: product.isActive ?? true,
  };
}

function createPayload(form) {
  const images = form.images
    .split("\n")
    .map((image) => image.trim())
    .filter(Boolean);

  const specifications = {};

  if (form.color.trim()) {
    specifications.color = form.color.trim();
  }

  if (form.storage.trim()) {
    specifications.storage = form.storage.trim();
  }

  if (form.ram.trim()) {
    specifications.ram = form.ram.trim();
  }

  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    category: form.category,
    brand: form.brand.trim(),
    sku: form.sku.trim().toUpperCase(),
    price: Number(form.price),
    discount: Number(form.discount || 0),
    stock: Number(form.stock),
    images,
    specifications,
    isActive: form.isActive,
  };
}

function validateForm(form) {
  if (form.name.trim().length < 2) {
    return "Product name must be at least 2 characters.";
  }

  if (!form.slug.trim()) {
    return "Product slug is required.";
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
    return "Slug can only contain lowercase letters, numbers and hyphens.";
  }

  if (form.description.trim().length < 10) {
    return "Description must be at least 10 characters.";
  }

  if (!form.category) {
    return "Please select a category.";
  }

  if (form.brand.trim().length < 2) {
    return "Brand must be at least 2 characters.";
  }

  if (form.sku.trim().length < 2) {
    return "SKU is required.";
  }

  if (form.price === "" || Number(form.price) < 0) {
    return "Enter a valid product price.";
  }

  if (Number(form.discount) < 0 || Number(form.discount) > 100) {
    return "Discount must be between 0 and 100.";
  }

  if (
    form.stock === "" ||
    !Number.isInteger(Number(form.stock)) ||
    Number(form.stock) < 0
  ) {
    return "Stock must be a non-negative whole number.";
  }

  const images = form.images
    .split("\n")
    .map((image) => image.trim())
    .filter(Boolean);

  const invalidImage = images.find((image) => {
    try {
      new URL(image);
      return false;
    } catch {
      return true;
    }
  });

  if (invalidImage) {
    return `Invalid image URL: ${invalidImage}`;
  }

  return "";
}

export default function AdminProductForm() {
  const navigate = useNavigate();

  const { productId } = useParams();

  const editing = Boolean(productId);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [form, setForm] = useState(INITIAL_FORM);

  const [loading, setLoading] = useState(editing);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(editing);

  useEffect(() => {
    if (!editing) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminProductById(productId, {
          signal: controller.signal,
        });

        const product = extractProduct(response);

        if (!product) {
          setError("Product could not be found.");
          return;
        }

        setForm(createFormFromProduct(product));
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setError(
          error?.data?.message || error?.message || "Unable to load product.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      controller.abort();
    };
  }, [editing, productId]);

  const imagePreview = useMemo(() => {
    return (
      form.images
        .split("\n")
        .map((image) => image.trim())
        .find(Boolean) || ""
    );
  }, [form.images]);

  const updateField = (field, value) => {
    setError("");

    setForm((currentForm) => {
      const updatedForm = {
        ...currentForm,
        [field]: value,
      };

      if (field === "name" && !slugManuallyEdited) {
        updatedForm.slug = createSlug(value);
      }

      return updatedForm;
    });
  };

  const handleSlugChange = (value) => {
    setSlugManuallyEdited(true);

    updateField("slug", createSlug(value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = createPayload(form);

      if (editing) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/admin/products", {
        replace: true,
      });
    } catch (error) {
      setError(
        error?.data?.message ||
          error?.message ||
          `Unable to ${editing ? "update" : "create"} product.`,
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProductFormLoading />;
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[1200px]">
        <ProductFormHeader
          editing={editing}
          onBack={() => navigate("/admin/products")}
        />

        {(error || categoriesError) && (
          <div
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            role="alert"
          >
            {error || categoriesError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <FormSection
                title="Basic information"
                description="Add the main identifying details of the product."
              >
                <div className="space-y-5">
                  <FormField
                    label="Product name"
                    htmlFor="product-name"
                    required
                  >
                    <input
                      id="product-name"
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Enter product name"
                      required
                      className={inputClass}
                    />
                  </FormField>

                  <FormField
                    label="Slug"
                    htmlFor="product-slug"
                    hint="Used as a unique, readable product identifier."
                    required
                  >
                    <input
                      id="product-slug"
                      type="text"
                      value={form.slug}
                      onChange={(event) => handleSlugChange(event.target.value)}
                      placeholder="samsung-galaxy-s25"
                      required
                      className={inputClass}
                    />
                  </FormField>

                  <FormField
                    label="Description"
                    htmlFor="product-description"
                    required
                  >
                    <textarea
                      id="product-description"
                      value={form.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      placeholder="Describe the product..."
                      rows={5}
                      required
                      className={`${inputClass} h-auto resize-none py-3 leading-6`}
                    />
                  </FormField>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      label="Category"
                      htmlFor="product-category"
                      required
                    >
                      <select
                        id="product-category"
                        value={form.category}
                        onChange={(event) =>
                          updateField("category", event.target.value)
                        }
                        disabled={categoriesLoading}
                        required
                        className={inputClass}
                      >
                        <option value="">
                          {categoriesLoading
                            ? "Loading categories..."
                            : "Select category"}
                        </option>

                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Brand" htmlFor="product-brand" required>
                      <input
                        id="product-brand"
                        type="text"
                        value={form.brand}
                        onChange={(event) =>
                          updateField("brand", event.target.value)
                        }
                        placeholder="Samsung"
                        required
                        className={inputClass}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="SKU"
                    htmlFor="product-sku"
                    hint="Unique inventory code for this product or variant."
                    required
                  >
                    <input
                      id="product-sku"
                      type="text"
                      value={form.sku}
                      onChange={(event) =>
                        updateField("sku", event.target.value.toUpperCase())
                      }
                      placeholder="SAM-S25-256-BLK"
                      required
                      className={`${inputClass} uppercase`}
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection
                title="Pricing and inventory"
                description="Set the selling price, discount and available stock."
              >
                <div className="grid gap-5 sm:grid-cols-3">
                  <FormField
                    label="Selling price"
                    htmlFor="product-price"
                    required
                  >
                    <NumberInput
                      id="product-price"
                      value={form.price}
                      onChange={(value) => updateField("price", value)}
                      prefix="₹"
                      min="0"
                      step="0.01"
                    />
                  </FormField>

                  <FormField label="Discount" htmlFor="product-discount">
                    <NumberInput
                      id="product-discount"
                      value={form.discount}
                      onChange={(value) => updateField("discount", value)}
                      suffix="%"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </FormField>

                  <FormField label="Stock" htmlFor="product-stock" required>
                    <NumberInput
                      id="product-stock"
                      value={form.stock}
                      onChange={(value) => updateField("stock", value)}
                      min="0"
                      step="1"
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection
                title="Specifications"
                description="Add the technical attributes used on the product-details page."
              >
                <div className="grid gap-5 sm:grid-cols-3">
                  <FormField label="Color" htmlFor="product-color">
                    <input
                      id="product-color"
                      type="text"
                      value={form.color}
                      onChange={(event) =>
                        updateField("color", event.target.value)
                      }
                      placeholder="Black"
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Storage" htmlFor="product-storage">
                    <input
                      id="product-storage"
                      type="text"
                      value={form.storage}
                      onChange={(event) =>
                        updateField("storage", event.target.value)
                      }
                      placeholder="256GB"
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="RAM" htmlFor="product-ram">
                    <input
                      id="product-ram"
                      type="text"
                      value={form.ram}
                      onChange={(event) =>
                        updateField("ram", event.target.value)
                      }
                      placeholder="12GB"
                      className={inputClass}
                    />
                  </FormField>
                </div>
              </FormSection>
            </div>

            <div className="space-y-6">
              <FormSection
                title="Product images"
                description="Enter one public image URL per line."
              >
                <FormField label="Image URLs" htmlFor="product-images">
                  <textarea
                    id="product-images"
                    value={form.images}
                    onChange={(event) =>
                      updateField("images", event.target.value)
                    }
                    placeholder={
                      "https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"
                    }
                    rows={6}
                    className={`${inputClass} h-auto resize-none py-3 text-xs leading-6`}
                  />
                </FormField>

                <ImagePreview image={imagePreview} productName={form.name} />
              </FormSection>

              <FormSection
                title="Product status"
                description="Control whether customers can see this product."
              >
                <div className="space-y-2">
                  <StatusOption
                    label="Active"
                    description="Product is visible in the customer store."
                    selected={form.isActive}
                    color="emerald"
                    onSelect={() => updateField("isActive", true)}
                  />

                  <StatusOption
                    label="Inactive"
                    description="Product remains stored but is hidden from customers."
                    selected={!form.isActive}
                    color="red"
                    onSelect={() => updateField("isActive", false)}
                  />
                </div>
              </FormSection>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              disabled={saving}
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || categoriesLoading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />

              {saving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass = `
  h-11
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-3
  text-sm
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-emerald-500
  focus:ring-2
  focus:ring-emerald-500/10
  disabled:cursor-not-allowed
  disabled:opacity-60
  dark:border-slate-700
  dark:bg-slate-950
  dark:text-white
`;

function ProductFormHeader({ editing, onBack }) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to products"
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
      >
        <ArrowLeft size={18} />
      </button>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          Catalog
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-[26px] dark:text-white">
          {editing ? "Edit product" : "Add product"}
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {editing
            ? "Update product information and inventory."
            : "Add a new product to your catalog."}
        </p>
      </div>
    </div>
  );
}

function FormSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-1 text-xs text-slate-400">{description}</p>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function FormField({ label, htmlFor, hint, required = false, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-[11px] leading-5 text-slate-400">{hint}</p>
      )}
    </div>
  );
}

function NumberInput({ id, value, onChange, prefix, suffix, ...inputProps }) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          {prefix}
        </span>
      )}

      <input
        id={id}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={inputProps.required}
        className={`${inputClass} ${prefix ? "pl-8" : ""} ${
          suffix ? "pr-9" : ""
        }`}
        {...inputProps}
      />

      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          {suffix}
        </span>
      )}
    </div>
  );
}

function ImagePreview({ image, productName }) {
  if (!image) {
    return (
      <div className="mt-4 flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
        <div className="text-center">
          <ImagePlus size={24} className="mx-auto text-slate-400" />

          <p className="mt-2 text-xs text-slate-400">Image preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
      <img
        src={image}
        alt={productName || "Product preview"}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function StatusOption({ label, description, selected, color, onSelect }) {
  const selectedClass =
    color === "emerald"
      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
      : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20";

  return (
    <label
      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
        selected ? selectedClass : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {label}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>

      <input
        type="radio"
        name="product-status"
        checked={selected}
        onChange={onSelect}
        className={
          color === "emerald" ? "accent-emerald-600" : "accent-red-500"
        }
      />
    </label>
  );
}

function ProductFormLoading() {
  return (
    <div
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950"
      role="status"
    >
      <div className="text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Loading product...
        </p>
      </div>
    </div>
  );
}
