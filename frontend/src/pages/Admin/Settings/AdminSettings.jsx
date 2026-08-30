import {
  Bell,
  Bot,
  Check,
  Globe,
  Lock,
  Palette,
  Save,
  Shield,
  Store,
  User,
} from "lucide-react";
import { useState } from "react";

const brandColors = [
  { name: "Emerald", value: "emerald" },
  { name: "Blue", value: "blue" },
  { name: "Violet", value: "violet" },
  { name: "Rose", value: "rose" },
  { name: "Amber", value: "amber" },
];

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("store");
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "CogniMart",
    email: "admin@cognimart.com",
    phone: "+91 98765 43210",
    currency: "INR",
    timezone: "Asia/Kolkata",
    theme: "system",
    brandColor: "emerald",
    orderNotifications: true,
    inventoryNotifications: true,
    customerNotifications: true,
    aiNotifications: true,
    lowStockThreshold: "10",
    aiRecommendations: true,
    weeklyReports: true,
  });

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const sections = [
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

  return (
    <main
      className="
        min-h-full
        bg-slate-50
        px-4
        py-5
        sm:px-6
        sm:py-6
        lg:px-8
        lg:py-7
        xl:px-10
        dark:bg-slate-950
      "
    >
      <div className="mx-auto w-full max-w-[1200px]">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  dark:bg-emerald-950/40
                  dark:text-emerald-400
                "
              >
                <Palette size={17} />
              </div>

              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                Administration
              </p>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your store, appearance, notifications, and AI preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-4
              text-xs
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-emerald-700
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500/30
            "
          >
            {saved ? <Check size={14} /> : <Save size={14} />}

            {saved ? "Changes saved" : "Save changes"}
          </button>
        </div>

        {/* SETTINGS LAYOUT */}

        <div className="mt-6 grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* NAVIGATION */}

          <aside
            className="
              h-fit
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-2
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      flex
                      min-w-max
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-left
                      transition
                      lg:w-full
                      ${
                        active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      }
                    `}
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

          {/* CONTENT */}

          <div className="min-w-0">
            {activeSection === "store" && (
              <StoreSettings
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {activeSection === "appearance" && (
              <AppearanceSettings
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {activeSection === "notifications" && (
              <NotificationSettings
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {activeSection === "ai" && (
              <AISettings settings={settings} updateSetting={updateSetting} />
            )}

            {activeSection === "security" && <SecuritySettings />}
          </div>
        </div>
      </div>
    </main>
  );
}

function StoreSettings({ settings, updateSetting }) {
  return (
    <SettingsCard
      title="Store information"
      description="Basic information used across your CogniMart store."
      icon={Store}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Store name"
          value={settings.storeName}
          onChange={(value) => updateSetting("storeName", value)}
        />

        <Field
          label="Admin email"
          type="email"
          value={settings.email}
          onChange={(value) => updateSetting("email", value)}
        />

        <Field
          label="Phone number"
          value={settings.phone}
          onChange={(value) => updateSetting("phone", value)}
        />

        <SelectField
          label="Currency"
          value={settings.currency}
          onChange={(value) => updateSetting("currency", value)}
          options={[
            { value: "INR", label: "Indian Rupee (₹)" },
            { value: "USD", label: "US Dollar ($)" },
            { value: "EUR", label: "Euro (€)" },
            { value: "GBP", label: "British Pound (£)" },
          ]}
        />

        <SelectField
          label="Timezone"
          value={settings.timezone}
          onChange={(value) => updateSetting("timezone", value)}
          options={[
            { value: "Asia/Kolkata", label: "India — Kolkata" },
            { value: "UTC", label: "UTC" },
            { value: "America/New_York", label: "US — Eastern" },
            { value: "Europe/London", label: "UK — London" },
          ]}
        />
      </div>
    </SettingsCard>
  );
}

function AppearanceSettings({ settings, updateSetting }) {
  return (
    <SettingsCard
      title="Appearance"
      description="Customize how the CogniMart admin panel looks."
      icon={Palette}
    >
      <div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Theme
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            {
              value: "light",
              label: "Light",
              description: "Always use light mode",
            },
            {
              value: "dark",
              label: "Dark",
              description: "Always use dark mode",
            },
            {
              value: "system",
              label: "System",
              description: "Follow device preference",
            },
          ].map((theme) => (
            <ChoiceCard
              key={theme.value}
              selected={settings.theme === theme.value}
              title={theme.label}
              description={theme.description}
              onClick={() => updateSetting("theme", theme.value)}
            />
          ))}
        </div>
      </div>

      <div className="mt-7 border-t border-slate-100 pt-6 dark:border-slate-800">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Brand color
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          Choose the primary accent used throughout the admin experience.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {brandColors.map((color) => {
            const selected = settings.brandColor === color.value;

            const colorClasses = {
              emerald: "bg-emerald-500",
              blue: "bg-blue-500",
              violet: "bg-violet-500",
              rose: "bg-rose-500",
              amber: "bg-amber-500",
            };

            return (
              <button
                key={color.value}
                type="button"
                onClick={() => updateSetting("brandColor", color.value)}
                className={`
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  transition
                  ${
                    selected
                      ? "border-slate-400 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  }
                `}
              >
                <span
                  className={`h-4 w-4 rounded-full ${colorClasses[color.value]}`}
                />

                {color.name}

                {selected && <Check size={13} />}
              </button>
            );
          })}
        </div>
      </div>
    </SettingsCard>
  );
}

function NotificationSettings({ settings, updateSetting }) {
  const options = [
    {
      key: "orderNotifications",
      title: "Order notifications",
      description: "Get alerts when new orders are placed or updated.",
    },
    {
      key: "inventoryNotifications",
      title: "Inventory alerts",
      description: "Receive alerts for low-stock and out-of-stock products.",
    },
    {
      key: "customerNotifications",
      title: "Customer activity",
      description: "Get notified about important customer activity.",
    },
    {
      key: "aiNotifications",
      title: "AI recommendations",
      description: "Receive actionable recommendations from CogniMart AI.",
    },
  ];

  return (
    <SettingsCard
      title="Notifications"
      description="Choose which events should generate admin notifications."
      icon={Bell}
    >
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {options.map((option) => (
          <ToggleRow
            key={option.key}
            title={option.title}
            description={option.description}
            enabled={settings[option.key]}
            onChange={(value) => updateSetting(option.key, value)}
          />
        ))}
      </div>
    </SettingsCard>
  );
}

function AISettings({ settings, updateSetting }) {
  return (
    <SettingsCard
      title="AI preferences"
      description="Control how CogniMart AI analyzes your business."
      icon={Bot}
    >
      <ToggleRow
        title="AI recommendations"
        description="Allow CogniMart AI to generate business recommendations."
        enabled={settings.aiRecommendations}
        onChange={(value) => updateSetting("aiRecommendations", value)}
      />

      <div className="mt-5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Low-stock threshold
        </label>

        <p className="mt-1 text-[11px] text-slate-400">
          Products below this quantity will be flagged by AI.
        </p>

        <div className="mt-3 max-w-[180px]">
          <input
            type="number"
            min="1"
            value={settings.lowStockThreshold}
            onChange={(event) =>
              updateSetting("lowStockThreshold", event.target.value)
            }
            className="
              h-10
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              text-slate-800
              outline-none
              transition
              focus:border-emerald-500
              focus:ring-2
              focus:ring-emerald-500/10
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-white
            "
          />
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
        <ToggleRow
          title="Weekly AI report"
          description="Receive a weekly summary of important business insights."
          enabled={settings.weeklyReports}
          onChange={(value) => updateSetting("weeklyReports", value)}
        />
      </div>
    </SettingsCard>
  );
}

function SecuritySettings() {
  return (
    <SettingsCard
      title="Security"
      description="Manage your admin account security."
      icon={Shield}
    >
      <div className="space-y-3">
        <SecurityRow
          icon={User}
          title="Admin account"
          description="admin@cognimart.com"
          action="Manage"
        />

        <SecurityRow
          icon={Lock}
          title="Password"
          description="Last changed recently"
          action="Change"
        />

        <SecurityRow
          icon={Shield}
          title="Two-factor authentication"
          description="Add an additional layer of account protection."
          action="Enable"
        />

        <SecurityRow
          icon={Globe}
          title="Active sessions"
          description="Review devices currently signed in to your account."
          action="Review"
        />
      </div>
    </SettingsCard>
  );
}

function SettingsCard({ title, description, icon: Icon, children }) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
          border-b
          border-slate-100
          p-5
          sm:p-6
          dark:border-slate-800
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-600
            dark:bg-slate-800
            dark:text-slate-300
          "
        >
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

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          mt-2
          h-10
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          text-sm
          text-slate-800
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-emerald-500
          focus:ring-2
          focus:ring-emerald-500/10
          dark:border-slate-700
          dark:bg-slate-950
          dark:text-white
        "
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          mt-2
          h-10
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          text-sm
          text-slate-800
          outline-none
          focus:border-emerald-500
          focus:ring-2
          focus:ring-emerald-500/10
          dark:border-slate-700
          dark:bg-slate-950
          dark:text-white
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChoiceCard({ selected, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl
        border
        p-4
        text-left
        transition
        ${
          selected
            ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30"
            : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
        }
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {title}
        </span>

        {selected && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={11} />
          </span>
        )}
      </div>

      <p className="mt-1 text-[10px] leading-4 text-slate-400">{description}</p>
    </button>
  );
}

function ToggleRow({ title, description, enabled, onChange }) {
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
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`
          relative
          h-6
          w-11
          shrink-0
          rounded-full
          transition
          ${enabled ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}
        `}
      >
        <span
          className={`
            absolute
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow-sm
            transition
            ${enabled ? "left-6" : "left-1"}
          `}
        />
      </button>
    </div>
  );
}

function SecurityRow({ icon: Icon, title, description, action }) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        p-4
        dark:border-slate-800
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-slate-100
          text-slate-600
          dark:bg-slate-800
          dark:text-slate-300
        "
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <p className="mt-1 truncate text-[10px] text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        className="
          shrink-0
          rounded-lg
          px-3
          py-1.5
          text-[10px]
          font-semibold
          text-emerald-600
          transition
          hover:bg-emerald-50
          dark:text-emerald-400
          dark:hover:bg-emerald-950/30
        "
      >
        {action}
      </button>
    </div>
  );
}
