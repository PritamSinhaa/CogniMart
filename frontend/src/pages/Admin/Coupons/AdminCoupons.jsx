import {
  AlertCircle,
  Check,
  Edit3,
  LoaderCircle,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../../../api/coupon.api";

const EMPTY_FORM = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscount: "",
  minOrderValue: "0",
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

const INPUT_CLASS =
  "mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

const STATUS_OPTIONS = [
  ["all", "All statuses"],
  ["active", "Active"],
  ["inactive", "Inactive"],
  ["expired", "Expired"],
  ["exhausted", "Usage exhausted"],
];

function extractCoupons(response) {
  const coupons = response?.data?.coupons || response?.coupons || [];
  return Array.isArray(coupons) ? coupons : [];
}

function extractCoupon(response) {
  return response?.data?.coupon || response?.coupon || null;
}

function getErrorMessage(error) {
  return (
    error?.data?.message ||
    error?.message ||
    "Unable to complete the coupon request."
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function toDateTimeLocal(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
}

function getCouponState(coupon) {
  if (coupon.isActive === false) return "inactive";

  const expiry = new Date(coupon.expiresAt).getTime();
  if (!Number.isNaN(expiry) && expiry <= Date.now()) return "expired";

  if (
    coupon.usageLimit !== null &&
    coupon.usageLimit !== undefined &&
    Number(coupon.usedCount) >= Number(coupon.usageLimit)
  ) {
    return "exhausted";
  }

  return "active";
}

function formatDiscount(coupon) {
  return coupon.discountType === "percentage"
    ? `${coupon.discountValue}%`
    : formatPrice(coupon.discountValue);
}

function validateForm(form, editingCoupon) {
  const code = form.code.trim().toUpperCase();

  if (code.length < 3 || code.length > 30) {
    return "Coupon code must contain between 3 and 30 characters.";
  }

  if (!/^[A-Z0-9_-]+$/.test(code)) {
    return "Coupon code can contain only letters, numbers, hyphens and underscores.";
  }

  if (form.description.trim().length > 300) {
    return "Description cannot exceed 300 characters.";
  }

  const discountValue = Number(form.discountValue);
  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    return "Discount value must be greater than zero.";
  }

  if (form.discountType === "percentage" && discountValue > 100) {
    return "Percentage discount cannot exceed 100%.";
  }

  if (form.maxDiscount !== "" && Number(form.maxDiscount) <= 0) {
    return "Maximum discount must be greater than zero.";
  }

  if (form.minOrderValue !== "" && Number(form.minOrderValue) < 0) {
    return "Minimum order value cannot be negative.";
  }

  if (form.usageLimit !== "") {
    const usageLimit = Number(form.usageLimit);
    if (!Number.isInteger(usageLimit) || usageLimit <= 0) {
      return "Usage limit must be a positive whole number.";
    }
  }

  const expiry = new Date(form.expiresAt).getTime();
  if (!form.expiresAt || Number.isNaN(expiry)) {
    return "Enter a valid expiry date.";
  }

  const originalExpiry = editingCoupon
    ? new Date(editingCoupon.expiresAt).getTime()
    : null;

  if ((!editingCoupon || expiry !== originalExpiry) && expiry <= Date.now()) {
    return "Coupon expiry date must be in the future.";
  }

  return "";
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadCoupons() {
      try {
        setLoading(true);
        setError("");

        const response = await getCoupons({ signal: controller.signal });
        if (active) setCoupons(extractCoupons(response));
      } catch (requestError) {
        if (requestError?.name !== "AbortError" && active) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCoupons();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey]);

  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const searchable = [coupon._id, coupon.code, coupon.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);
      const matchesStatus =
        statusFilter === "all" || getCouponState(coupon) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: coupons.length,
      active: coupons.filter((coupon) => getCouponState(coupon) === "active")
        .length,
      unavailable: coupons.filter(
        (coupon) => getCouponState(coupon) !== "active",
      ).length,
      usage: coupons.reduce(
        (total, coupon) => total + (Number(coupon.usedCount) || 0),
        0,
      ),
    };
  }, [coupons]);

  function openCreateModal() {
    setEditingCoupon(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(coupon) {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "percentage",
      discountValue: String(coupon.discountValue ?? ""),
      maxDiscount:
        coupon.maxDiscount === null || coupon.maxDiscount === undefined
          ? ""
          : String(coupon.maxDiscount),
      minOrderValue: String(coupon.minOrderValue ?? 0),
      usageLimit:
        coupon.usageLimit === null || coupon.usageLimit === undefined
          ? ""
          : String(coupon.usageLimit),
      expiresAt: toDateTimeLocal(coupon.expiresAt),
      isActive: coupon.isActive !== false,
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setModalOpen(false);
    setEditingCoupon(null);
    setForm(EMPTY_FORM);
    setFormError("");
  }

  function handleFormChange(event) {
    const { name, value, type, checked } = event.target;
    setFormError("");

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "code"
            ? value.toUpperCase()
            : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const validationError = validateForm(form, editingCoupon);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = {
      description: form.description.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: form.minOrderValue === "" ? 0 : Number(form.minOrderValue),
      isActive: form.isActive,
    };

    if (editingCoupon) {
      payload.maxDiscount =
        form.discountType === "percentage" && form.maxDiscount !== ""
          ? Number(form.maxDiscount)
          : null;
      payload.usageLimit =
        form.usageLimit === "" ? null : Number(form.usageLimit);

      const selectedExpiry = new Date(form.expiresAt).getTime();
      const originalExpiry = new Date(editingCoupon.expiresAt).getTime();
      if (selectedExpiry !== originalExpiry) {
        payload.expiresAt = new Date(form.expiresAt).toISOString();
      }
    } else {
      payload.code = form.code.trim().toUpperCase();
      payload.expiresAt = new Date(form.expiresAt).toISOString();

      if (form.discountType === "percentage" && form.maxDiscount !== "") {
        payload.maxDiscount = Number(form.maxDiscount);
      }

      if (form.usageLimit !== "") {
        payload.usageLimit = Number(form.usageLimit);
      }
    }

    try {
      setSubmitting(true);
      setFormError("");
      setError("");
      setSuccess("");

      const response = editingCoupon
        ? await updateCoupon(editingCoupon._id, payload)
        : await createCoupon(payload);

      const savedCoupon = extractCoupon(response);
      if (!savedCoupon) throw new Error("Saved coupon was not returned.");

      setCoupons((current) =>
        editingCoupon
          ? current.map((coupon) =>
              coupon._id === savedCoupon._id ? savedCoupon : coupon,
            )
          : [savedCoupon, ...current],
      );

      setSuccess(
        response?.message ||
          (editingCoupon
            ? "Coupon updated successfully."
            : "Coupon created successfully."),
      );
      closeModal();
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(coupon) {
    if (busyId) return;

    try {
      setBusyId(coupon._id);
      setError("");
      setSuccess("");

      const response = await updateCoupon(coupon._id, {
        isActive: !coupon.isActive,
      });
      const updatedCoupon = extractCoupon(response);
      if (!updatedCoupon) throw new Error("Updated coupon was not returned.");

      setCoupons((current) =>
        current.map((item) =>
          item._id === updatedCoupon._id ? updatedCoupon : item,
        ),
      );
      setSuccess(response?.message || "Coupon status updated.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(coupon) {
    if (busyId) return;

    const confirmed = window.confirm(
      `Permanently delete coupon "${coupon.code}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setBusyId(coupon._id);
      setError("");
      setSuccess("");

      const response = await deleteCoupon(coupon._id);
      setCoupons((current) =>
        current.filter((item) => item._id !== coupon._id),
      );
      setSuccess(response?.message || "Coupon deleted successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <LoadingState />;

  if (error && coupons.length === 0) {
    return (
      <ErrorState
        message={error}
        onRetry={() => setReloadKey((current) => current + 1)}
      />
    );
  }

  return (
    <>
      <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
        <div className="mx-auto w-full max-w-[1400px]">
          <PageHeader onCreate={openCreateModal} />

          {error && (
            <Message
              type="error"
              message={error}
              onClose={() => setError("")}
            />
          )}
          {success && (
            <Message
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            />
          )}

          <Stats stats={stats} />

          <Filters
            search={search}
            status={statusFilter}
            count={filteredCoupons.length}
            onSearch={setSearch}
            onStatus={setStatusFilter}
          />

          {filteredCoupons.length > 0 ? (
            <>
              <CouponTable
                coupons={filteredCoupons}
                busyId={busyId}
                onEdit={openEditModal}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
              <CouponCards
                coupons={filteredCoupons}
                busyId={busyId}
                onEdit={openEditModal}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            </>
          ) : (
            <EmptyState
              filtered={Boolean(search.trim()) || statusFilter !== "all"}
              onClear={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              onCreate={openCreateModal}
            />
          )}
        </div>
      </main>

      {modalOpen && (
        <CouponModal
          editing={Boolean(editingCoupon)}
          form={form}
          error={formError}
          submitting={submitting}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </>
  );
}

function PageHeader({ onCreate }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
          Marketing
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white sm:text-[26px]">
          Coupons
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create and manage promotional discounts.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
      >
        <Plus size={15} /> Create coupon
      </button>
    </div>
  );
}

function Message({ type, message, onClose }) {
  const successful = type === "success";
  return (
    <div
      role={successful ? "status" : "alert"}
      className={`mt-5 flex items-start justify-between rounded-xl border px-4 py-3 text-sm ${successful ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300" : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"}`}
    >
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss message">
        <X size={16} />
      </button>
    </div>
  );
}

function Stats({ stats }) {
  const cards = [
    ["Total coupons", stats.total, Tag, "text-slate-700 dark:text-slate-200"],
    ["Available", stats.active, Check, "text-emerald-600"],
    ["Unavailable", stats.unavailable, X, "text-red-600"],
    [
      "Total usage",
      stats.usage.toLocaleString("en-IN"),
      Percent,
      "text-blue-600",
    ],
  ];

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, Icon, color]) => (
        <article
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
            </div>
            <Icon size={18} className={color} />
          </div>
        </article>
      ))}
    </div>
  );
}

function Filters({ search, status, count, onSearch, onStatus }) {
  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search coupons..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
        <select
          value={status}
          onChange={(event) => onStatus(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-400">{count} coupons</p>
      </div>
    </section>
  );
}

function CouponTable({ coupons, busyId, onEdit, onToggle, onDelete }) {
  return (
    <section className="mt-5 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
      <table className="w-full min-w-[950px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-900">
            {[
              "Coupon",
              "Discount",
              "Minimum",
              "Usage",
              "Expiry",
              "Status",
              "Actions",
            ].map((heading) => (
              <th key={heading} className="px-4 py-3">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {coupons.map((coupon) => (
            <tr key={coupon._id}>
              <td className="px-4 py-4">
                <p className="font-mono text-sm font-bold dark:text-white">
                  {coupon.code}
                </p>
                <p className="mt-1 max-w-52 truncate text-xs text-slate-400">
                  {coupon.description || "No description"}
                </p>
              </td>
              <td className="px-4 py-4 font-bold text-emerald-600">
                {formatDiscount(coupon)}
              </td>
              <td className="px-4 py-4 text-sm dark:text-slate-200">
                {formatPrice(coupon.minOrderValue)}
              </td>
              <td className="px-4 py-4 text-sm dark:text-slate-200">
                {coupon.usedCount || 0} / {coupon.usageLimit ?? "Unlimited"}
              </td>
              <td className="px-4 py-4 text-xs text-slate-500">
                {formatDate(coupon.expiresAt)}
              </td>
              <td className="px-4 py-4">
                <StatusBadge state={getCouponState(coupon)} />
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <IconButton label="Edit" onClick={() => onEdit(coupon)}>
                    <Edit3 size={15} />
                  </IconButton>
                  <IconButton
                    label="Toggle"
                    disabled={busyId === coupon._id}
                    onClick={() => onToggle(coupon)}
                  >
                    {busyId === coupon._id ? (
                      <LoaderCircle size={15} className="animate-spin" />
                    ) : coupon.isActive ? (
                      <ToggleRight size={17} />
                    ) : (
                      <ToggleLeft size={17} />
                    )}
                  </IconButton>
                  <IconButton
                    label="Delete"
                    danger
                    disabled={busyId === coupon._id}
                    onClick={() => onDelete(coupon)}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function CouponCards({ coupons, busyId, onEdit, onToggle, onDelete }) {
  return (
    <div className="mt-5 space-y-3 md:hidden">
      {coupons.map((coupon) => (
        <article
          key={coupon._id}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-mono font-bold dark:text-white">
                {coupon.code}
              </p>
              <p className="mt-1 font-bold text-emerald-600">
                {formatDiscount(coupon)}
              </p>
            </div>
            <StatusBadge state={getCouponState(coupon)} />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {coupon.description || "No description"}
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Used {coupon.usedCount || 0} / {coupon.usageLimit ?? "Unlimited"} •
            Expires {formatDate(coupon.expiresAt)}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <TextButton onClick={() => onEdit(coupon)}>
              <Edit3 size={14} /> Edit
            </TextButton>
            <TextButton
              disabled={busyId === coupon._id}
              onClick={() => onToggle(coupon)}
            >
              <ToggleRight size={14} /> Toggle
            </TextButton>
            <TextButton
              danger
              disabled={busyId === coupon._id}
              onClick={() => onDelete(coupon)}
            >
              <Trash2 size={14} /> Delete
            </TextButton>
          </div>
        </article>
      ))}
    </div>
  );
}

function StatusBadge({ state }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700",
    inactive: "bg-slate-100 text-slate-600",
    expired: "bg-red-50 text-red-700",
    exhausted: "bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${styles[state] || styles.inactive}`}
    >
      {state}
    </span>
  );
}

function IconButton({ children, label, onClick, disabled, danger }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-50 ${danger ? "border-red-200 text-red-500" : "border-slate-200 text-slate-500 dark:border-slate-700"}`}
    >
      {children}
    </button>
  );
}

function TextButton({ children, onClick, disabled, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 items-center justify-center gap-1 rounded-lg border text-xs disabled:opacity-50 ${danger ? "border-red-200 text-red-500" : "border-slate-200 dark:border-slate-700 dark:text-white"}`}
    >
      {children}
    </button>
  );
}

function CouponModal({
  editing,
  form,
  error,
  submitting,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-900"
      >
        <div className="flex justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="font-bold dark:text-white">
              {editing ? "Edit coupon" : "Create coupon"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Configure the promotional discount.
            </p>
          </div>
          <button type="button" onClick={onClose}>
            <X size={17} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5">
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-600"
            >
              {error}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Coupon code">
              <input
                name="code"
                value={form.code}
                onChange={onChange}
                disabled={editing || submitting}
                required
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Discount type">
              <select
                name="discountType"
                value={form.discountType}
                onChange={onChange}
                disabled={submitting}
                className={INPUT_CLASS}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </select>
            </Field>
            <Field label="Discount value">
              <input
                type="number"
                name="discountValue"
                value={form.discountValue}
                onChange={onChange}
                min="0.01"
                max={form.discountType === "percentage" ? "100" : undefined}
                step="0.01"
                required
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Maximum discount">
              <input
                type="number"
                name="maxDiscount"
                value={form.maxDiscount}
                onChange={onChange}
                disabled={submitting || form.discountType === "fixed"}
                min="0.01"
                step="0.01"
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Minimum order">
              <input
                type="number"
                name="minOrderValue"
                value={form.minOrderValue}
                onChange={onChange}
                min="0"
                step="0.01"
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Usage limit">
              <input
                type="number"
                name="usageLimit"
                value={form.usageLimit}
                onChange={onChange}
                min="1"
                step="1"
                placeholder="Unlimited"
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Expiry">
              <input
                type="datetime-local"
                name="expiresAt"
                value={form.expiresAt}
                onChange={onChange}
                required
                className={INPUT_CLASS}
              />
            </Field>
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
              />
              <span className="text-sm dark:text-white">Active coupon</span>
            </label>
          </div>
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              maxLength={300}
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </Field>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border px-5 dark:border-slate-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-white disabled:opacity-50"
            >
              {submitting && (
                <LoaderCircle size={15} className="animate-spin" />
              )}
              {editing ? "Save changes" : "Create coupon"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="mt-4 block">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

function LoadingState() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <LoaderCircle
          size={29}
          className="mx-auto animate-spin text-emerald-600"
        />
        <p className="mt-3 text-sm text-slate-500">Loading coupons...</p>
      </div>
    </main>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="max-w-md text-center">
        <AlertCircle size={35} className="mx-auto text-red-500" />
        <h1 className="mt-4 text-xl font-bold">Unable to load coupons</h1>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-white"
        >
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    </main>
  );
}

function EmptyState({ filtered, onClear, onCreate }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white py-14 text-center dark:border-slate-800 dark:bg-slate-900">
      <Tag size={35} className="mx-auto text-slate-300" />
      <h2 className="mt-4 font-bold dark:text-white">
        {filtered ? "No matching coupons" : "No coupons yet"}
      </h2>
      <button
        type="button"
        onClick={filtered ? onClear : onCreate}
        className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 text-white"
      >
        {filtered ? "Clear filters" : "Create coupon"}
      </button>
    </div>
  );
}
