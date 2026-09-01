import {
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Lock,
  ShieldCheck,
  X,
} from "lucide-react";

import { useState } from "react";

import { changePassword } from "../../api/users.api";

const INITIAL_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getErrorMessage(error) {
  return (
    error?.data?.message || error?.message || "Unable to change your password."
  );
}

function validatePasswordForm(form) {
  if (!form.currentPassword) {
    return "Enter your current password.";
  }

  if (!form.newPassword) {
    return "Enter a new password.";
  }

  if (form.newPassword.length < 8) {
    return "New password must be at least 8 characters.";
  }

  const strongPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

  if (!strongPasswordPattern.test(form.newPassword)) {
    return "New password must contain uppercase, lowercase, number and special character.";
  }

  if (form.currentPassword === form.newPassword) {
    return "New password must be different from your current password.";
  }

  if (!form.confirmPassword) {
    return "Confirm your new password.";
  }

  if (form.newPassword !== form.confirmPassword) {
    return "New passwords do not match.";
  }

  return "";
}

export default function SecuritySection() {
  const [changingPassword, setChangingPassword] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleOpen = () => {
    setForm(INITIAL_FORM);
    setError("");
    setSuccess("");
    setChangingPassword(true);
  };

  const handleCancel = () => {
    if (submitting) {
      return;
    }

    setForm(INITIAL_FORM);
    setError("");
    setChangingPassword(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const validationError = validatePasswordForm(form);

    if (validationError) {
      setError(validationError);
      setSuccess("");

      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await changePassword({
        currentPassword: form.currentPassword,

        newPassword: form.newPassword,
      });

      setForm(INITIAL_FORM);
      setChangingPassword(false);

      setSuccess(response?.message || "Password changed successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">
            Security
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Keep your account credentials secure.
          </p>
        </div>

        <ShieldCheck size={19} className="text-emerald-600" />
      </div>

      {success && (
        <div
          role="status"
          className="mx-5 mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mx-5 mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {changingPassword ? (
        <PasswordForm
          form={form}
          submitting={submitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <PasswordSummary onChangePassword={handleOpen} />
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Password summary
|--------------------------------------------------------------------------
*/

function PasswordSummary({ onChangePassword }) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <Lock size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Account password
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Use a strong and unique password for your account.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChangePassword}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
      >
        <KeyRound size={14} />
        Change password
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Password form
|--------------------------------------------------------------------------
*/

function PasswordForm({ form, submitting, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Change password
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Enter your current password and choose a new one.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          aria-label="Cancel password change"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X size={17} />
        </button>
      </div>

      <div className="space-y-4">
        <PasswordInput
          label="Current password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={onChange}
          autoComplete="current-password"
          disabled={submitting}
        />

        <PasswordInput
          label="New password"
          name="newPassword"
          value={form.newPassword}
          onChange={onChange}
          autoComplete="new-password"
          disabled={submitting}
        />

        <PasswordInput
          label="Confirm new password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          autoComplete="new-password"
          disabled={submitting}
        />
      </div>

      <PasswordRequirements />

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <LoaderCircle size={15} className="animate-spin" />
              Changing...
            </>
          ) : (
            <>
              <KeyRound size={15} />
              Change password
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/*
|--------------------------------------------------------------------------
| Password input
|--------------------------------------------------------------------------
*/

function PasswordInput({
  label,
  name,
  value,
  onChange,
  autoComplete,
  disabled,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <div className="relative mt-1.5">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          required
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-slate-400 transition-colors hover:text-slate-700 disabled:cursor-not-allowed dark:hover:text-slate-200"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Password requirements
|--------------------------------------------------------------------------
*/

function PasswordRequirements() {
  return (
    <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        Password requirements
      </p>

      <ul className="mt-2 grid gap-1 text-xs leading-5 text-slate-500 dark:text-slate-400 sm:grid-cols-2">
        <li>At least 8 characters</li>
        <li>One uppercase letter</li>
        <li>One lowercase letter</li>
        <li>One number</li>
        <li>One special character: @$!%*?&</li>
      </ul>
    </div>
  );
}
