import {
  AlertCircle,
  Check,
  Edit3,
  FolderTree,
  Image,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../api/categories.api";

const INITIAL_FORM = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

function extractCategories(response) {
  return Array.isArray(response?.data) ? response.data : [];
}

function extractCategory(response) {
  return response?.data || null;
}

function getErrorMessage(error) {
  return (
    error?.data?.message ||
    error?.message ||
    "Unable to complete the category request."
  );
}

function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function generateSlug(value = "") {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getShortId(value) {
  if (!value) {
    return "UNKNOWN";
  }

  return value.slice(-8).toUpperCase();
}

function isValidImageUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function validateCategoryForm(form) {
  const name = form.name.trim();

  const slug = form.slug.trim();

  const description = form.description.trim();

  const image = form.image.trim();

  if (name.length < 2) {
    return "Category name must be at least 2 characters.";
  }

  if (name.length > 80) {
    return "Category name cannot exceed 80 characters.";
  }

  if (slug.length < 2) {
    return "Category slug must be at least 2 characters.";
  }

  if (slug.length > 100) {
    return "Category slug cannot exceed 100 characters.";
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Slug can contain only lowercase letters, numbers and single hyphens.";
  }

  if (description.length > 500) {
    return "Description cannot exceed 500 characters.";
  }

  if (image && !isValidImageUrl(image)) {
    return "Enter a valid HTTP or HTTPS image URL.";
  }

  return "";
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [formError, setFormError] = useState("");

  const [formSuccess, setFormSuccess] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller = new AbortController();

    let active = true;

    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCategories({
          signal: controller.signal,
        });

        if (!active) {
          return;
        }

        setCategories(extractCategories(response));
      } catch (requestError) {
        if (requestError?.name === "AbortError") {
          return;
        }

        if (active) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey]);

  /*
   * Prevent the page behind the modal
   * from scrolling.
   */
  useEffect(() => {
    if (!modalOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [modalOpen]);

  /*
  |--------------------------------------------------------------------------
  | Search and statistics
  |--------------------------------------------------------------------------
  */

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) =>
      [category._id, category.name, category.slug, category.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [categories, search]);

  const categoryStatistics = useMemo(
    () => ({
      total: categories.length,

      withImages: categories.filter((category) => Boolean(category.image))
        .length,

      withoutImages: categories.filter((category) => !category.image).length,
    }),
    [categories],
  );

  /*
  |--------------------------------------------------------------------------
  | Modal
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(INITIAL_FORM);
    setSlugManuallyEdited(false);
    setFormError("");
    setFormSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",

      slug: category.slug || "",

      description: category.description || "",

      image: category.image || "",
    });

    setSlugManuallyEdited(true);
    setFormError("");
    setFormSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setModalOpen(false);
    setEditingCategory(null);
    setForm(INITIAL_FORM);
    setFormError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Form
  |--------------------------------------------------------------------------
  */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormError("");
    setFormSuccess("");

    if (name === "name") {
      setForm((currentForm) => ({
        ...currentForm,

        name: value,

        slug: slugManuallyEdited ? currentForm.slug : generateSlug(value),
      }));

      return;
    }

    if (name === "slug") {
      setSlugManuallyEdited(true);

      setForm((currentForm) => ({
        ...currentForm,

        slug: generateSlug(value),
      }));

      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const validationError = validateCategoryForm(form);

    if (validationError) {
      setFormError(validationError);

      return;
    }

    const payload = {
      name: form.name.trim(),

      slug: form.slug.trim().toLowerCase(),

      description: form.description.trim(),
    };

    const image = form.image.trim();

    /*
     * The backend accepts image only
     * when it is a valid URL.
     */
    if (image) {
      payload.image = image;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");

      if (editingCategory) {
        const response = await updateCategory(editingCategory._id, payload);

        const updatedCategory = extractCategory(response);

        if (!updatedCategory) {
          throw new Error("Updated category was not returned.");
        }

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category._id === updatedCategory._id ? updatedCategory : category,
          ),
        );

        setFormSuccess(response?.message || "Category updated successfully.");
      } else {
        const response = await createCategory(payload);

        const createdCategory = extractCategory(response);

        if (!createdCategory) {
          throw new Error("Created category was not returned.");
        }

        setCategories((currentCategories) => [
          createdCategory,
          ...currentCategories,
        ]);

        setFormSuccess(response?.message || "Category created successfully.");
      }

      setTimeout(() => {
        setModalOpen(false);
        setEditingCategory(null);
        setForm(INITIAL_FORM);
        setFormSuccess("");
      }, 500);
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete category
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (category) => {
    if (deletingId) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${category.name}"? This is a soft delete, but the category cannot be restored from the current admin API.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category._id);

      setError("");

      await deleteCategory(category._id);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentCategory) => currentCategory._id !== category._id,
        ),
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <CategoriesLoading />;
  }

  if (error && categories.length === 0) {
    return (
      <CategoriesError
        message={error}
        onRetry={() => setReloadKey((current) => current + 1)}
      />
    );
  }

  return (
    <>
      <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
        <div className="mx-auto w-full max-w-[1400px]">
          <CategoriesHeader onCreate={openCreateModal} />

          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            >
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <CategoryStatistics statistics={categoryStatistics} />

          <CategorySearch
            value={search}
            count={filteredCategories.length}
            onChange={setSearch}
          />

          {filteredCategories.length > 0 ? (
            <>
              <CategoryDesktopTable
                categories={filteredCategories}
                deletingId={deletingId}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />

              <CategoryMobileList
                categories={filteredCategories}
                deletingId={deletingId}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            </>
          ) : (
            <CategoriesEmpty
              searching={Boolean(search.trim())}
              onClearSearch={() => setSearch("")}
              onCreate={openCreateModal}
            />
          )}
        </div>
      </main>

      {modalOpen && (
        <CategoryModal
          editingCategory={editingCategory}
          form={form}
          error={formError}
          success={formSuccess}
          submitting={submitting}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function CategoriesHeader({ onCreate }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          Catalog
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[26px]">
          Categories
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Organize products into manageable catalog categories.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
      >
        <Plus size={15} />
        Add category
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

function CategoryStatistics({ statistics }) {
  const cards = [
    {
      label: "Active categories",
      value: statistics.total,
      description: "Visible catalog categories",
      icon: FolderTree,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "With images",
      value: statistics.withImages,
      description: "Categories with artwork",
      icon: Image,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Without images",
      value: statistics.withoutImages,
      description: "Need category artwork",
      icon: AlertCircle,
      color: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">{card.label}</p>

                <p className={`mt-1 text-xl font-bold ${card.color}`}>
                  {card.value}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  {card.description}
                </p>
              </div>

              <Icon size={18} className={card.color} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

function CategorySearch({ value, count, onChange }) {
  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search name, slug or description..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <p className="shrink-0 text-xs text-slate-400">
          {count} {count === 1 ? "category" : "categories"}
        </p>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Desktop table
|--------------------------------------------------------------------------
*/

function CategoryDesktopTable({ categories, deletingId, onEdit, onDelete }) {
  return (
    <section className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
              <TableHeading>Category</TableHeading>

              <TableHeading>Slug</TableHeading>

              <TableHeading>Description</TableHeading>

              <TableHeading>Created</TableHeading>

              <TableHeading alignRight>Actions</TableHeading>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((category) => (
              <CategoryTableRow
                key={category._id}
                category={category}
                deleting={deletingId === category._id}
                onEdit={() => onEdit(category)}
                onDelete={() => onDelete(category)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TableHeading({ children, alignRight = false }) {
  return (
    <th
      className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400 ${
        alignRight ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function CategoryTableRow({ category, deleting, onEdit, onDelete }) {
  return (
    <tr className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <CategoryImage category={category} />

          <div className="min-w-0">
            <p className="max-w-48 truncate text-sm font-semibold text-slate-900 dark:text-white">
              {category.name}
            </p>

            <p className="mt-1 font-mono text-[10px] text-slate-400">
              #{getShortId(category._id)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {category.slug}
        </code>
      </td>

      <td className="max-w-80 px-4 py-4">
        <p className="line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {category.description || "No description provided."}
        </p>
      </td>

      <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
        {formatDate(category.createdAt)}
      </td>

      <td className="px-4 py-4">
        <div className="flex justify-end gap-2">
          <ActionButton label={`Edit ${category.name}`} onClick={onEdit}>
            <Edit3 size={15} />
          </ActionButton>

          <ActionButton
            label={`Delete ${category.name}`}
            onClick={onDelete}
            disabled={deleting}
            danger
          >
            {deleting ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
          </ActionButton>
        </div>
      </td>
    </tr>
  );
}

/*
|--------------------------------------------------------------------------
| Mobile cards
|--------------------------------------------------------------------------
*/

function CategoryMobileList({ categories, deletingId, onEdit, onDelete }) {
  return (
    <div className="mt-5 space-y-3 md:hidden">
      {categories.map((category) => {
        const deleting = deletingId === category._id;

        return (
          <article
            key={category._id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-3">
              <CategoryImage category={category} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {category.name}
                </p>

                <p className="mt-1 truncate font-mono text-xs text-slate-400">
                  {category.slug}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Check size={11} />
                Active
              </span>
            </div>

            <p className="mt-4 line-clamp-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {category.description || "No description provided."}
            </p>

            <p className="mt-3 text-[11px] text-slate-400">
              Created {formatDate(category.createdAt)}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onEdit(category)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                <Edit3 size={14} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(category)}
                disabled={deleting}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:text-red-400"
              >
                {deleting ? (
                  <LoaderCircle size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Category image
|--------------------------------------------------------------------------
*/

function CategoryImage({ category }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!category.image || imageFailed) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
        <FolderTree size={18} />
      </div>
    );
  }

  return (
    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
      <img
        src={category.image}
        alt=""
        loading="lazy"
        onError={() => setImageFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

function CategoryModal({
  editingCategory,
  form,
  error,
  success,
  submitting,
  onChange,
  onSubmit,
  onClose,
}) {
  const editing = Boolean(editingCategory);

  const imagePreviewValid =
    form.image.trim() && isValidImageUrl(form.image.trim());

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-dialog-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2
              id="category-dialog-title"
              className="text-lg font-bold text-slate-950 dark:text-white"
            >
              {editing ? "Edit category" : "Create category"}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {editing
                ? "Update category information."
                : "Add a category to the product catalog."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close category form"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5">
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              {success}
            </p>
          )}

          <div className="space-y-4">
            <CategoryInput
              label="Category name"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Example: Electronics"
              maxLength={80}
              disabled={submitting}
              required
            />

            <CategoryInput
              label="Slug"
              name="slug"
              value={form.slug}
              onChange={onChange}
              placeholder="electronics"
              maxLength={100}
              disabled={submitting}
              required
              help="Used in URLs. Lowercase letters, numbers and hyphens only."
            />

            <label className="block">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Description
              </span>

              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Describe the products in this category..."
                maxLength={500}
                rows={4}
                disabled={submitting}
                className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />

              <p className="mt-1 text-right text-[11px] text-slate-400">
                {form.description.length}
                /500
              </p>
            </label>

            <CategoryInput
              label="Image URL"
              name="image"
              type="url"
              value={form.image}
              onChange={onChange}
              placeholder="https://example.com/category.jpg"
              disabled={submitting}
              help={
                editing
                  ? "Leave blank to keep the existing image."
                  : "Optional until Cloudinary upload is implemented."
              }
            />

            {imagePreviewValid && (
              <div>
                <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Image preview
                </p>

                <div className="h-32 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={form.image}
                    alt="Category preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />

                  {editing ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  <Check size={15} />

                  {editing ? "Save changes" : "Create category"}
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
*/

function CategoryInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
  disabled,
  required = false,
  help,
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />

      {help && (
        <p className="mt-1 text-[11px] leading-5 text-slate-400">{help}</p>
      )}
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Shared buttons and states
|--------------------------------------------------------------------------
*/

function ActionButton({
  children,
  label,
  onClick,
  disabled = false,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        danger
          ? "border-red-200 text-red-500 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
          : "border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

function CategoriesLoading() {
  return (
    <main
      role="status"
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950"
    >
      <div className="text-center">
        <LoaderCircle
          size={29}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Loading categories...
        </p>
      </div>
    </main>
  );
}

function CategoriesError({ message, onRetry }) {
  return (
    <main
      role="alert"
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950"
    >
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center dark:border-red-500/20 dark:bg-slate-900">
        <AlertCircle size={35} className="mx-auto text-red-500" />

        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Unable to load categories
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    </main>
  );
}

function CategoriesEmpty({ searching, onClearSearch, onCreate }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
      <FolderTree
        size={35}
        className="mx-auto text-slate-300 dark:text-slate-700"
      />

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        {searching ? "No matching categories" : "No categories yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {searching
          ? "Try a different category name, slug or description."
          : "Create your first category to organize the product catalog."}
      </p>

      <button
        type="button"
        onClick={searching ? onClearSearch : onCreate}
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        {searching ? (
          "Clear search"
        ) : (
          <>
            <Plus size={15} />
            Add category
          </>
        )}
      </button>
    </div>
  );
}
