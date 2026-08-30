import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  changePassword,
} from "../../api/users.api";

const INITIAL_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SecuritySection() {
  const [form, setForm] =
    useState(
      INITIAL_PASSWORD_FORM,
    );

  const [showForm, setShowForm] =
    useState(false);

  const [showPasswords, setShowPasswords] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const updateField = (
    event,
  ) => {
    const { name, value } =
      event.target;

    setForm(
      (currentForm) => ({
        ...currentForm,
        [name]: value,
      }),
    );

    setError("");
    setSuccess("");
  };

  const closeForm = () => {
    setShowForm(false);
    setShowPasswords(false);
    setError("");
    setForm(
      INITIAL_PASSWORD_FORM,
    );
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        form.newPassword !==
        form.confirmPassword
      ) {
        setError(
          "New passwords do not match.",
        );
        return;
      }

      if (
        form.newPassword.length < 8
      ) {
        setError(
          "New password must be at least 8 characters.",
        );
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        await changePassword({
          currentPassword:
            form.currentPassword,
          newPassword:
            form.newPassword,
        });

        setForm(
          INITIAL_PASSWORD_FORM,
        );

        setShowForm(false);
        setShowPasswords(false);

        setSuccess(
          "Password changed successfully.",
        );
      } catch (error) {
        setError(
          error?.data?.message ||
            error?.message ||
            "Unable to change password.",
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">
            Security
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Keep your account secure.
          </p>
        </div>

        <ShieldCheck
          size={19}
          className="text-emerald-600"
        />
      </div>

      <div className="p-5">
        {success && (
          <p
            className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
            role="status"
          >
            {success}
          </p>
        )}

        {error && (
          <p
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            role="alert"
          >
            {error}
          </p>
        )}

        {!showForm ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                <Lock size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Password
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Change your account
                  password.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowForm(true)
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300"
            >
              Change
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <PasswordInput
              label="Current password"
              name="currentPassword"
              value={
                form.currentPassword
              }
              onChange={
                updateField
              }
              visible={
                showPasswords
              }
            />

            <PasswordInput
              label="New password"
              name="newPassword"
              value={
                form.newPassword
              }
              onChange={
                updateField
              }
              visible={
                showPasswords
              }
            />

            <PasswordInput
              label="Confirm new password"
              name="confirmPassword"
              value={
                form.confirmPassword
              }
              onChange={
                updateField
              }
              visible={
                showPasswords
              }
            />

            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <input
                type="checkbox"
                checked={
                  showPasswords
                }
                onChange={(
                  event,
                ) =>
                  setShowPasswords(
                    event.target
                      .checked,
                  )
                }
                className="accent-emerald-600"
              />

              {showPasswords ? (
                <EyeOff
                  size={14}
                />
              ) : (
                <Eye size={14} />
              )}

              Show passwords
            </label>

            <p className="text-xs leading-5 text-slate-400">
              Use at least 8 characters
              with uppercase, lowercase,
              a number and a special
              character.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving
                  ? "Changing..."
                  : "Change password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
  visible,
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <input
        type={
          visible
            ? "text"
            : "password"
        }
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={
          name ===
          "currentPassword"
            ? "current-password"
            : "new-password"
        }
        required
        className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}