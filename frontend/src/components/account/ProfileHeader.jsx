import { Camera, Pencil } from "lucide-react";

export default function ProfileHeader({
  user,
  editing,
  onEdit,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-5 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {user.initials}
            </div>

            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-sm dark:border-slate-900"
              aria-label="Change profile photo"
            >
              <Camera size={13} />
            </button>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Member since {user.joined}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200"
        >
          <Pencil size={14} />

          {editing ? "Cancel" : "Edit profile"}
        </button>
      </div>
    </section>
  );
}