import { Pencil, X } from "lucide-react";

export default function ProfileHeader({ user, editing, onEdit }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-20 bg-gradient-to-r from-emerald-600 to-teal-500" />

      <div className="px-5 pb-5">
        <div className="-mt-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-end gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-xl font-bold text-emerald-700 shadow-sm dark:border-slate-900 dark:bg-emerald-500/10 dark:text-emerald-400">
              {user.initials}
            </div>

            <div className="min-w-0 pb-1">
              <h2 className="truncate text-lg font-bold text-slate-950 dark:text-white">
                {user.name}
              </h2>

              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors ${
              editing
                ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
                : "border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
            }`}
          >
            {editing ? (
              <>
                <X size={14} />
                Cancel
              </>
            ) : (
              <>
                <Pencil size={14} />
                Edit profile
              </>
            )}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <ProfileBadge label={formatRole(user.role)} />

          <ProfileBadge label={`Member since ${user.joined}`} secondary />
        </div>
      </div>
    </section>
  );
}

function ProfileBadge({ label, secondary = false }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        secondary
          ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      }`}
    >
      {label}
    </span>
  );
}

function formatRole(role) {
  if (!role) {
    return "Customer";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}
