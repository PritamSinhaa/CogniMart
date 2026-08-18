import { useState } from "react";
import { Check, User } from "lucide-react";

export default function ProfileInfo({
  form,
  editing,
  onChange,
  onSave,
}) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    onSave();
    setSaving(false);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            Personal information
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Your basic account information.
          </p>
        </div>

        <User
          size={18}
          className="text-slate-400"
        />
      </div>

      {editing ? (
        <div className="mt-5 space-y-4">
          <ProfileInput
            label="Full name"
            name="name"
            value={form.name}
            onChange={onChange}
          />

          <ProfileInput
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
          />

          <ProfileInput
            label="Phone number"
            name="phone"
            value={form.phone}
            onChange={onChange}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              <Check size={15} />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <InfoItem
            label="Full name"
            value={form.name}
          />

          <InfoItem
            label="Email address"
            value={form.email}
          />

          <InfoItem
            label="Phone number"
            value={form.phone}
          />

          <InfoItem
            label="Account type"
            value="Customer"
          />
        </div>
      )}
    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

function ProfileInput({
  label,
  name,
  type = "text",
  value,
  onChange,
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
        className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
    </label>
  );
}