import {
  Bell,
  Bot,
  Database,
  Lock,
  Palette,
  Save,
  Shield,
  Store,
} from "lucide-react";

import { useState } from "react";

const SETTINGS_SECTIONS = [
  {
    id: "store",
    label: "Store",
    description: "Store information",
    icon: Store,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme and branding",
    icon: Palette,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alerts and updates",
    icon: Bell,
  },
  {
    id: "ai",
    label: "AI Preferences",
    description: "CogniMart AI",
    icon: Bot,
  },
  {
    id: "security",
    label: "Security",
    description: "Account protection",
    icon: Shield,
  },
];

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("store");

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <SettingsHeader />

        <BackendNotice />

        <div className="mt-6 grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <SettingsNavigation
            activeSection={activeSection}
            onChange={setActiveSection}
          />

          <div className="min-w-0">
            {activeSection === "store" && <StoreSettings />}

            {activeSection === "appearance" && <AppearanceSettings />}

            {activeSection === "notifications" && <NotificationSettings />}

            {activeSection === "ai" && <AISettings />}

            {activeSection === "security" && <SecuritySettings />}
          </div>
        </div>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function SettingsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Palette size={17} />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            Administration
          </p>
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure store preferences after the settings API is available.
        </p>
      </div>

      <button
        type="button"
        disabled
        title="Settings persistence is not available yet"
        className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      >
        <Save size={14} />
        Save changes
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Backend notice
|--------------------------------------------------------------------------
*/

function BackendNotice() {
  return (
    <div
      role="status"
      className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm dark:bg-slate-900 dark:text-amber-400">
        <Database size={17} />
      </div>

      <div>
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          Settings API not connected
        </p>

        <p className="mt-1 text-xs leading-5 text-amber-700/80 dark:text-amber-300/70">
          These sections are currently read-only. Saving will be enabled after
          the backend settings model and endpoints are implemented.
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

function SettingsNavigation({ activeSection, onChange }) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon;

          const active = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id)}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-3 text-left transition lg:w-full ${
                active
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={17} className="shrink-0" />

              <span>
                <span className="block text-xs font-semibold">
                  {section.label}
                </span>

                <span className="mt-0.5 hidden text-[10px] text-slate-400 lg:block">
                  {section.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

/*
|--------------------------------------------------------------------------
| Store settings
|--------------------------------------------------------------------------
*/

function StoreSettings() {
  return (
    <SettingsCard
      title="Store information"
      description="Information used across the customer storefront."
      icon={Store}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <PreviewField label="Store name" placeholder="Not configured" />

        <PreviewField label="Support email" placeholder="Not configured" />

        <PreviewField label="Phone number" placeholder="Not configured" />

        <PreviewField label="Currency" placeholder="Indian Rupee (INR)" />

        <PreviewField label="Timezone" placeholder="Asia/Kolkata" />
      </div>
    </SettingsCard>
  );
}

/*
|--------------------------------------------------------------------------
| Appearance
|--------------------------------------------------------------------------
*/

function AppearanceSettings() {
  return (
    <SettingsCard
      title="Appearance"
      description="Customize the admin panel theme and branding."
      icon={Palette}
    >
      <SettingsGroup
        title="Theme"
        description="Choose light, dark or system appearance."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <DisabledChoice title="Light" description="Always use light mode" />

          <DisabledChoice title="Dark" description="Always use dark mode" />

          <DisabledChoice
            title="System"
            description="Follow device preference"
          />
        </div>
      </SettingsGroup>

      <SettingsDivider />

      <SettingsGroup
        title="Brand color"
        description="Configure the primary storefront and admin color."
      >
        <div className="flex flex-wrap gap-3">
          <ColorPreview label="Emerald" colorClass="bg-emerald-500" />

          <ColorPreview label="Blue" colorClass="bg-blue-500" />

          <ColorPreview label="Violet" colorClass="bg-violet-500" />

          <ColorPreview label="Rose" colorClass="bg-rose-500" />

          <ColorPreview label="Amber" colorClass="bg-amber-500" />
        </div>
      </SettingsGroup>
    </SettingsCard>
  );
}

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

function NotificationSettings() {
  return (
    <SettingsCard
      title="Notifications"
      description="Choose which store events generate admin alerts."
      icon={Bell}
    >
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        <DisabledToggle
          title="Order notifications"
          description="Alerts for new orders and order-status updates."
        />

        <DisabledToggle
          title="Inventory alerts"
          description="Alerts for low-stock and out-of-stock products."
        />

        <DisabledToggle
          title="Customer activity"
          description="Alerts for important customer account activity."
        />

        <DisabledToggle
          title="AI recommendations"
          description="Alerts generated by future CogniMart AI agents."
        />
      </div>
    </SettingsCard>
  );
}

/*
|--------------------------------------------------------------------------
| AI settings
|--------------------------------------------------------------------------
*/

function AISettings() {
  return (
    <SettingsCard
      title="AI preferences"
      description="Future configuration for CogniMart AI agents."
      icon={Bot}
    >
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
        <div className="flex items-start gap-3">
          <Bot
            className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
            size={18}
          />

          <div>
            <p className="text-xs font-semibold text-violet-800 dark:text-violet-300">
              AI integration is planned
            </p>

            <p className="mt-1 text-[11px] leading-5 text-violet-700/80 dark:text-violet-300/70">
              This UI is intentionally retained for the future AI
              implementation.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
        <DisabledToggle
          title="AI recommendations"
          description="Generate business recommendations from store data."
        />

        <DisabledToggle
          title="Weekly AI report"
          description="Generate a weekly business-performance summary."
        />
      </div>

      <div className="mt-5">
        <PreviewField
          label="Low-stock analysis threshold"
          placeholder="Configure after AI integration"
        />
      </div>
    </SettingsCard>
  );
}

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

function SecuritySettings() {
  return (
    <SettingsCard
      title="Security"
      description="Administrative security settings and session management."
      icon={Shield}
    >
      <div className="space-y-3">
        <SecurityPreview
          icon={Lock}
          title="Password management"
          description="Use your profile security section to change your password."
        />

        <SecurityPreview
          icon={Shield}
          title="Two-factor authentication"
          description="Two-factor authentication is not implemented yet."
        />

        <SecurityPreview
          icon={Database}
          title="Active sessions"
          description="Session management is not implemented yet."
        />
      </div>
    </SettingsCard>
  );
}

/*
|--------------------------------------------------------------------------
| Shared components
|--------------------------------------------------------------------------
*/

function SettingsCard({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3 border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Icon size={17} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function PreviewField({ label, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <input
        type="text"
        disabled
        value=""
        placeholder={placeholder}
        className="mt-1.5 h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 outline-none placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500 dark:placeholder:text-slate-500"
      />
    </label>
  );
}

function SettingsGroup({ title, description, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {title}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">{description}</p>

      <div className="mt-3">{children}</div>
    </div>
  );
}

function SettingsDivider() {
  return (
    <div className="my-6 border-t border-slate-100 dark:border-slate-800" />
  );
}

function DisabledChoice({ title, description }) {
  return (
    <button
      type="button"
      disabled
      className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 p-3 text-left opacity-70 dark:border-slate-800 dark:bg-slate-950"
    >
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-slate-400">{description}</p>
    </button>
  );
}

function ColorPreview({ label, colorClass }) {
  return (
    <button
      type="button"
      disabled
      className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
    >
      <span className={`h-4 w-4 rounded-full ${colorClass}`} />

      {label}
    </button>
  );
}

function DisabledToggle({ title, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <p className="mt-1 max-w-xl text-[11px] leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked="false"
        disabled
        title="Requires the settings API"
        className="relative h-6 w-11 shrink-0 cursor-not-allowed rounded-full bg-slate-200 opacity-70 dark:bg-slate-700"
      >
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}

function SecurityPreview({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-slate-400">
          {description}
        </p>
      </div>

      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        Coming soon
      </span>
    </div>
  );
}
