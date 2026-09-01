import { LoaderCircle, Save, User } from "lucide-react";

export default function ProfileInfo({
  form,
  user,
  editing,
  saving,
  onChange,
  onSave,
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">
            Personal information
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Your basic account information.
          </p>
        </div>

        <User size={18} className="text-slate-400" />
      </div>

      {editing ? (
        <div className="mt-5 space-y-4">
          <ProfileInput
            label="Full name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={saving}
            required
          />

          <ProfileInput
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="Enter your email address"
            autoComplete="email"
            disabled={saving}
            required
          />

          <p className="text-xs leading-5 text-slate-400">
            Changing your email may affect where account notifications are sent.
          </p>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <InfoItem label="Full name" value={user.name || "Not provided"} />

          <InfoItem
            label="Email address"
            value={user.email || "Not provided"}
          />

          <InfoItem label="Account type" value={formatRole(user.role)} />

          <InfoItem label="Member since" value={user.joined || "Unknown"} />
        </div>
      )}
    </section>
  );
}

function ProfileInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled = false,
  required = false,
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
        autoComplete={autoComplete}
        disabled={disabled}
        required={required}
        className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
      />
    </label>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

function formatRole(role) {
  if (!role) {
    return "Customer";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}
