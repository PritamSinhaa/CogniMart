import {
  Check,
  Edit3,
  FolderTree,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const initialCategories = [
  {
    id: "CAT-001",
    name: "Electronics",
    description: "Phones, computers and electronic devices",
    products: 48,
    status: "Active",
    created: "Jan 12, 2026",
  },
  {
    id: "CAT-002",
    name: "Fashion",
    description: "Clothing, footwear and fashion accessories",
    products: 36,
    status: "Active",
    created: "Jan 18, 2026",
  },
  {
    id: "CAT-003",
    name: "Home & Living",
    description: "Furniture, decor and home essentials",
    products: 29,
    status: "Active",
    created: "Jan 24, 2026",
  },
  {
    id: "CAT-004",
    name: "Accessories",
    description: "Useful everyday tech and lifestyle accessories",
    products: 24,
    status: "Active",
    created: "Feb 02, 2026",
  },
  {
    id: "CAT-005",
    name: "Audio",
    description: "Headphones, speakers and audio equipment",
    products: 18,
    status: "Active",
    created: "Feb 08, 2026",
  },
  {
    id: "CAT-006",
    name: "Wearables",
    description: "Smart watches and wearable technology",
    products: 12,
    status: "Active",
    created: "Feb 15, 2026",
  },
  {
    id: "CAT-007",
    name: "Gaming",
    description: "Gaming hardware and accessories",
    products: 17,
    status: "Inactive",
    created: "Mar 01, 2026",
  },
  {
    id: "CAT-008",
    name: "Office",
    description: "Office furniture and productivity products",
    products: 15,
    status: "Active",
    created: "Mar 06, 2026",
  },
];

const statusOptions = ["All", "Active", "Inactive"];

export default function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.status === "Active",
  ).length;

  const inactiveCategories = categories.filter(
    (category) => category.status === "Inactive",
  ).length;

  const totalProducts = categories.reduce(
    (total, category) => total + category.products,
    0,
  );

  const openCreateModal = () => {
    setEditingCategory(null);

    setForm({
      name: "",
      description: "",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name,
      description: category.description,
      status: category.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) return;

    if (editingCategory) {
      setCategories((current) =>
        current.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                name,
                description: form.description.trim(),
                status: form.status,
              }
            : category,
        ),
      );
    } else {
      const newCategory = {
        id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
        name,
        description:
          form.description.trim() || "No category description added yet.",
        products: 0,
        status: form.status,
        created: "Today",
      };

      setCategories((current) => [newCategory, ...current]);
    }

    closeModal();
  };

  const toggleStatus = (categoryId) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              status: category.status === "Active" ? "Inactive" : "Active",
            }
          : category,
      ),
    );
  };

  const deleteCategory = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);

    if (!category) return;

    if (category.products > 0) {
      toggleStatus(categoryId);
      return;
    }

    setCategories((current) =>
      current.filter((item) => item.id !== categoryId),
    );
  };

  return (
    <>
      <main
        className="
          min-h-full
          bg-slate-50
          px-4
          py-5
          sm:px-6
          sm:py-6
          lg:px-8
          lg:py-7
          xl:px-10
          dark:bg-slate-950
        "
      >
        <div className="mx-auto w-full max-w-[1400px]">
          {/* ==================================================
              HEADER
          ================================================== */}

          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                Catalog
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-950
                  sm:text-[26px]
                  dark:text-white
                "
              >
                Categories
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Organize your product catalog into clear, manageable categories.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-600
                px-4
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-emerald-700
              "
            >
              <Plus size={15} />
              Add category
            </button>
          </div>

          {/* ==================================================
              STATS
          ================================================== */}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <CategoryStat
              icon={FolderTree}
              label="Total categories"
              value={totalCategories}
              description="Catalog categories"
            />

            <CategoryStat
              icon={Check}
              label="Active"
              value={activeCategories}
              description="Currently visible"
              success
            />

            <CategoryStat
              icon={X}
              label="Inactive"
              value={inactiveCategories}
              description="Hidden from catalog"
              warning
            />

            <CategoryStat
              icon={Package}
              label="Products assigned"
              value={totalProducts}
              description="Across all categories"
            />
          </div>

          {/* ==================================================
              SEARCH + FILTER
          ================================================== */}

          <section
            className="
              mt-5
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                lg:flex-row
                lg:items-center
              "
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search categories..."
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    pl-10
                    pr-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-emerald-500/10
                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="
                  h-11
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  font-medium
                  text-slate-700
                  outline-none
                  focus:border-emerald-500
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-slate-300
                "
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "All" ? "All status" : option}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* ==================================================
              CATEGORY TABLE
          ================================================== */}

          <section
            className="
              mt-5
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-5
                py-4
                dark:border-slate-800
              "
            >
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  All categories
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Manage your product classification.
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {filteredCategories.length} categories
              </span>
            </div>

            {/* Desktop */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50/80
                      dark:border-slate-800
                      dark:bg-slate-950/50
                    "
                  >
                    <CategoryHeader>Category</CategoryHeader>

                    <CategoryHeader>Description</CategoryHeader>

                    <CategoryHeader>Products</CategoryHeader>

                    <CategoryHeader>Status</CategoryHeader>

                    <CategoryHeader>Created</CategoryHeader>

                    <CategoryHeader align="right">Actions</CategoryHeader>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="
                          border-b
                          border-slate-100
                          last:border-0
                          hover:bg-slate-50/70
                          dark:border-slate-800/80
                          dark:hover:bg-slate-800/30
                        "
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-emerald-50
                                text-emerald-600
                                dark:bg-emerald-950/40
                                dark:text-emerald-400
                              "
                          >
                            <Tag size={15} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {category.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {category.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="max-w-[300px] px-5 py-4">
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {category.description}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {category.products}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={category.status} />
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-400">
                          {category.created}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton
                            label="Edit category"
                            onClick={() => openEditModal(category)}
                          >
                            <Edit3 size={14} />
                          </ActionButton>

                          <ActionButton
                            label={
                              category.status === "Active"
                                ? "Deactivate category"
                                : "Activate category"
                            }
                            onClick={() => toggleStatus(category.id)}
                          >
                            {category.status === "Active" ? (
                              <X size={14} />
                            ) : (
                              <Check size={14} />
                            )}
                          </ActionButton>

                          <ActionButton
                            label="Delete category"
                            danger
                            onClick={() => deleteCategory(category.id)}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
              {filteredCategories.map((category) => (
                <article key={category.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-50
                            text-emerald-600
                            dark:bg-emerald-950/40
                            dark:text-emerald-400
                          "
                      >
                        <Tag size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {category.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {category.id}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={category.status} />
                  </div>

                  <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {category.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-slate-400">Products</p>

                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {category.products}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400">Created</p>

                      <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {category.created}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(category)}
                      className="
                          flex
                          h-9
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-slate-200
                          text-xs
                          font-semibold
                          text-slate-700
                          dark:border-slate-700
                          dark:text-slate-300
                        "
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleStatus(category.id)}
                      className="
                          flex
                          h-9
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-slate-200
                          px-3
                          text-xs
                          font-semibold
                          text-slate-600
                          dark:border-slate-700
                          dark:text-slate-400
                        "
                    >
                      {category.status === "Active" ? (
                        <X size={13} />
                      ) : (
                        <Check size={13} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCategory(category.id)}
                      className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-red-100
                          text-red-500
                          dark:border-red-900/50
                          dark:text-red-400
                        "
                      aria-label="Delete category"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {!filteredCategories.length && (
              <div className="px-6 py-16 text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-100
                    text-slate-400
                    dark:bg-slate-800
                  "
                >
                  <FolderTree size={20} />
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  No categories found
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ========================================================
          CATEGORY MODAL
      ======================================================== */}

      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/40
            px-4
            py-6
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-5
                py-4
                dark:border-slate-800
              "
            >
              <div>
                <h2 className="text-base font-bold text-slate-950 dark:text-white">
                  {editingCategory ? "Edit category" : "Add category"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  {editingCategory
                    ? "Update category information."
                    : "Create a new product category."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-100
                  hover:text-slate-700
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 p-5">
                <div>
                  <label
                    htmlFor="category-name"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Category name
                  </label>

                  <input
                    id="category-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Electronics"
                    autoFocus
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      text-sm
                      text-slate-900
                      outline-none
                      focus:border-emerald-500
                      focus:ring-2
                      focus:ring-emerald-500/10
                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-white
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="category-description"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="category-description"
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Briefly describe this category..."
                    rows={4}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      py-2.5
                      text-sm
                      leading-5
                      text-slate-900
                      outline-none
                      focus:border-emerald-500
                      focus:ring-2
                      focus:ring-emerald-500/10
                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-white
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="category-status"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Status
                  </label>

                  <select
                    id="category-status"
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value,
                      }))
                    }
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      text-sm
                      text-slate-700
                      outline-none
                      focus:border-emerald-500
                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-slate-300
                    "
                  >
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div
                className="
                  flex
                  justify-end
                  gap-2
                  border-t
                  border-slate-200
                  bg-slate-50/70
                  px-5
                  py-4
                  dark:border-slate-800
                  dark:bg-slate-950/40
                "
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    h-9
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    text-xs
                    font-semibold
                    text-slate-600
                    hover:bg-white
                    dark:border-slate-700
                    dark:text-slate-300
                    dark:hover:bg-slate-900
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    h-9
                    rounded-xl
                    bg-emerald-600
                    px-4
                    text-xs
                    font-semibold
                    text-white
                    hover:bg-emerald-700
                  "
                >
                  {editingCategory ? "Save changes" : "Create category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function CategoryStat({
  icon: Icon,
  label,
  value,
  description,
  success,
  warning,
}) {
  const iconClass = success
    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
    : warning
      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
      : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400";

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{label}</p>

        <div
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          <Icon size={15} />
        </div>
      </div>

      <p className="mt-3 text-xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">{description}</p>
    </div>
  );
}

function CategoryHeader({ children, align }) {
  return (
    <th
      className={`
        px-5
        py-3.5
        text-[10px]
        font-bold
        uppercase
        tracking-wider
        text-slate-400
        ${align === "right" ? "text-right" : "text-left"}
      `}
    >
      {children}
    </th>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-[10px]
        font-bold
        ${
          active
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        }
      `}
    >
      {status}
    </span>
  );
}

function ActionButton({ children, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-lg
        transition
        ${
          danger
            ? "text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
        }
      `}
    >
      {children}
    </button>
  );
}
