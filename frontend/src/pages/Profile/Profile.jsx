import { useState } from "react";
import { motion } from "framer-motion";

import AccountSidebar from "../../components/account/AccountSidebar";
import ProfileHeader from "../../components/account/ProfileHeader";
import ProfileInfo from "../../components/account/ProfileInfo";
import AccountStats from "../../components/account/AccountStats";
import SecuritySection from "../../components/account/SecuritySection";
const initialUser = {
  name: "Pritam Sinha",
  email: "pritam@example.com",
  phone: "+91 98765 43210",
  joined: "August 2026",
  initials: "PS",
};

export default function Profile() {
  const [user, setUser] = useState(initialUser);
  const [form, setForm] = useState(initialUser);
  const [editing, setEditing] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setUser((current) => ({
      ...current,
      ...form,
    }));

    setEditing(false);
  };

  const handleEdit = () => {
    if (editing) {
      setForm(user);
    }

    setEditing((current) => !current);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Header */}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-semibold text-emerald-600">Account</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information and account settings.
          </p>
        </motion.div>

        {/* Account Layout */}

        <div className="mt-6 grid gap-5 lg:grid-cols-[240px_1fr]">
          <AccountSidebar />

          <div className="space-y-5">
            <ProfileHeader user={user} editing={editing} onEdit={handleEdit} />

            <ProfileInfo
              form={form}
              editing={editing}
              onChange={handleChange}
              onSave={handleSave}
            />

            <AccountStats />

            <SecuritySection />
          </div>
        </div>
      </div>
    </main>
  );
}
