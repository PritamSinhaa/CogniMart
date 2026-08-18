import { Lock, ShieldCheck } from "lucide-react";
import SecurityItem from "./SecurityItem";

export default function SecuritySection() {
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

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        <SecurityItem
          icon={Lock}
          title="Password"
          description="Change your account password"
          action="Change"
        />

        <SecurityItem
          icon={ShieldCheck}
          title="Two-factor authentication"
          description="Add an extra layer of protection"
          action="Set up"
        />
      </div>
    </section>
  );
}