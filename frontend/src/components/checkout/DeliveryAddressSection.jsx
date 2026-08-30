import {
  Check,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useAddresses } from "../../context/AddressContext";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export default function DeliveryAddressSection() {
  const {
    addresses,
    selectedAddressId,
    loading,
    saving,
    error,
    addAddress,
    editAddress,
    removeAddress,
    makeDefaultAddress,
    selectAddress,
    clearAddressError,
  } = useAddresses();

  const [mode, setMode] = useState("list");
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [formError, setFormError] = useState("");

  /*
   * If the customer has no address, open the form.
   */
  useEffect(() => {
    if (!loading && addresses.length === 0) {
      setMode("add");
    }
  }, [loading, addresses.length]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingAddressId(null);
    setFormError("");
    clearAddressError();
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormError("");
    clearAddressError();
  };

  const openAddForm = () => {
    resetForm();

    setForm((currentForm) => ({
      ...currentForm,
      /*
       * A user's first address becomes default.
       */
      isDefault: addresses.length === 0,
    }));

    setMode("add");
  };

  const openEditForm = (address) => {
    setEditingAddressId(address._id);

    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "India",
      isDefault: Boolean(address.isDefault),
    });

    setFormError("");
    clearAddressError();
    setMode("edit");
  };

  const closeForm = () => {
    resetForm();

    if (addresses.length > 0) {
      setMode("list");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Frontend validation
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    if (form.fullName.trim().length < 3) {
      return "Full name must be at least 3 characters";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      return "Enter a valid 10-digit Indian phone number";
    }

    if (form.addressLine1.trim().length < 5) {
      return "Address must be at least 5 characters";
    }

    if (form.city.trim().length < 2) {
      return "Enter a valid city";
    }

    if (form.state.trim().length < 2) {
      return "Enter a valid state";
    }

    if (!/^\d{6}$/.test(form.postalCode.trim())) {
      return "Enter a valid 6-digit pincode";
    }

    if (form.country.trim().length < 2) {
      return "Enter a valid country";
    }

    return "";
  };

  const handleSave = async () => {
    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim(),
      isDefault: form.isDefault,
    };

    try {
      if (mode === "edit" && editingAddressId) {
        await editAddress(editingAddressId, payload);
      } else {
        await addAddress(payload);
      }

      resetForm();
      setMode("list");
    } catch {
      /*
       * AddressContext already stores the API error.
       */
    }
  };

  const handleDelete = async (address) => {
    const confirmed = window.confirm(
      `Delete the address for ${address.fullName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeAddress(address._id);

      if (String(editingAddressId) === String(address._id)) {
        resetForm();
        setMode("list");
      }
    } catch {
      // Context displays the API error.
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await makeDefaultAddress(addressId);
    } catch {
      // Context displays the API error.
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SectionHeader onAdd={mode === "list" ? openAddForm : null} />

      <div className="p-4">
        {loading ? (
          <AddressLoading />
        ) : mode === "list" && addresses.length > 0 ? (
          <AddressList
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            saving={saving}
            onSelect={selectAddress}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        ) : (
          <AddressForm
            form={form}
            mode={mode}
            saving={saving}
            canCancel={addresses.length > 0}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={closeForm}
          />
        )}

        {(formError || error) && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          >
            {formError || error}
          </p>
        )}
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function SectionHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <MapPin size={18} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Delivery address
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Select where your order should be delivered.
          </p>
        </div>
      </div>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
        >
          <Plus size={15} />
          Add address
        </button>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Saved address list
|--------------------------------------------------------------------------
*/

function AddressList({
  addresses,
  selectedAddressId,
  saving,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Saved delivery addresses"
      className="grid gap-3 sm:grid-cols-2"
    >
      {addresses.map((address) => {
        const selected = String(address._id) === String(selectedAddressId);

        return (
          <article
            key={address._id}
            className={`
              relative
              rounded-xl
              border
              p-4
              transition-all
              ${
                selected
                  ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/10 dark:bg-emerald-500/5"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
              }
            `}
          >
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(address._id)}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3">
                <SelectionIndicator selected={selected} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {address.fullName}
                    </p>

                    {address.isDefault && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {address.phone}
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {address.addressLine1}
                    {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                  </p>
                </div>
              </div>
            </button>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
              <AddressAction
                icon={Pencil}
                label="Edit"
                disabled={saving}
                onClick={() => onEdit(address)}
              />

              {!address.isDefault && (
                <AddressAction
                  icon={Star}
                  label="Make default"
                  disabled={saving}
                  onClick={() => onSetDefault(address._id)}
                />
              )}

              <AddressAction
                icon={Trash2}
                label="Delete"
                danger
                disabled={saving}
                onClick={() => onDelete(address)}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function SelectionIndicator({ selected }) {
  return (
    <span
      className={`
        mt-0.5
        flex
        h-5
        w-5
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        ${
          selected
            ? "border-emerald-600 bg-emerald-600"
            : "border-slate-300 dark:border-slate-600"
        }
      `}
    >
      {selected && <Check size={12} strokeWidth={3} className="text-white" />}
    </span>
  );
}

function AddressAction({
  icon: Icon,
  label,
  onClick,
  disabled,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-md
        px-2
        py-1.5
        text-xs
        font-medium
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          danger
            ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }
      `}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Address form
|--------------------------------------------------------------------------
*/

function AddressForm({
  form,
  mode,
  saving,
  canCancel,
  onChange,
  onSave,
  onCancel,
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {mode === "edit" ? "Edit address" : "Add a new address"}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            This address will be saved to your account.
          </p>
        </div>

        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="Close address form"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={17} />
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AddressInput
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          placeholder="Full name"
          autoComplete="name"
          required
        />

        <AddressInput
          label="Phone number"
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="10-digit phone number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          required
        />

        <div className="sm:col-span-2">
          <AddressInput
            label="House, street and area"
            name="addressLine1"
            value={form.addressLine1}
            onChange={onChange}
            placeholder="House no., street, area"
            autoComplete="address-line1"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <AddressInput
            label="Landmark or apartment (optional)"
            name="addressLine2"
            value={form.addressLine2}
            onChange={onChange}
            placeholder="Apartment, landmark, floor"
            autoComplete="address-line2"
          />
        </div>

        <AddressInput
          label="City"
          name="city"
          value={form.city}
          onChange={onChange}
          placeholder="City"
          autoComplete="address-level2"
          required
        />

        <AddressInput
          label="State"
          name="state"
          value={form.state}
          onChange={onChange}
          placeholder="State"
          autoComplete="address-level1"
          required
        />

        <AddressInput
          label="Pincode"
          name="postalCode"
          value={form.postalCode}
          onChange={onChange}
          placeholder="6-digit pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          required
        />

        <AddressInput
          label="Country"
          name="country"
          value={form.country}
          onChange={onChange}
          placeholder="Country"
          autoComplete="country-name"
          required
        />

        <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={onChange}
            className="h-4 w-4 cursor-pointer rounded accent-emerald-600"
          />

          <span className="text-sm text-slate-600 dark:text-slate-300">
            Use as my default delivery address
          </span>
        </label>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <LoaderCircle size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check size={16} />
              {mode === "edit" ? "Save changes" : "Save address"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function AddressInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required={required}
        disabled={false}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:border-slate-600"
      />
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function AddressLoading() {
  return (
    <div className="flex min-h-32 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      <LoaderCircle size={18} className="animate-spin text-emerald-600" />
      Loading saved addresses...
    </div>
  );
}
