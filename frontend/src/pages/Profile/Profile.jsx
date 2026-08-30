import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "motion/react";

import AccountSidebar from "../../components/account/AccountSidebar";
import ProfileHeader from "../../components/account/ProfileHeader";
import ProfileInfo from "../../components/account/ProfileInfo";
import SecuritySection from "../../components/account/SecuritySection";

import {
  updateProfile,
} from "../../api/users.api";

import {
  useAuth,
} from "../../context/AuthContext";

function createInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatJoinedDate(
  createdAt,
) {
  if (!createdAt) {
    return "Unknown";
  }

  const date = new Date(
    createdAt,
  );

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    },
  );
}

export default function Profile() {
  const {
    user,
    refreshUser,
  } = useAuth();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
    });

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name: user.name || "",
      email: user.email || "",
    });
  }, [user]);

  const displayUser = useMemo(
    () => ({
      name:
        user?.name || "Customer",
      email: user?.email || "",
      role:
        user?.role || "customer",
      initials:
        createInitials(user?.name) ||
        "CM",
      joined: formatJoinedDate(
        user?.createdAt,
      ),
    }),
    [user],
  );

  const handleChange = (
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

  const handleEdit = () => {
    if (editing) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
      });
    }

    setError("");
    setSuccess("");

    setEditing(
      (current) => !current,
    );
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const email =
      form.email
        .trim()
        .toLowerCase();

    if (name.length < 3) {
      setError(
        "Name must be at least 3 characters.",
      );
      return;
    }

    if (!email) {
      setError(
        "Email address is required.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateProfile({
        name,
        email,
      });

      await refreshUser();

      setEditing(false);

      setSuccess(
        "Profile updated successfully.",
      );
    } catch (error) {
      setError(
        error?.data?.message ||
          error?.message ||
          "Unable to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <p className="text-sm font-semibold text-emerald-600">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal
            information and account
            security.
          </p>
        </motion.div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[240px_1fr]">
          <AccountSidebar />

          <div className="space-y-5">
            {error && (
              <Message
                type="error"
                message={error}
              />
            )}

            {success && (
              <Message
                type="success"
                message={success}
              />
            )}

            <ProfileHeader
              user={displayUser}
              editing={editing}
              onEdit={handleEdit}
            />

            <ProfileInfo
              form={form}
              user={displayUser}
              editing={editing}
              saving={saving}
              onChange={
                handleChange
              }
              onSave={handleSave}
            />

            <SecuritySection />
          </div>
        </div>
      </div>
    </div>
  );
}

function Message({
  type,
  message,
}) {
  const style =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
      : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300";

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${style}`}
      role={
        type === "error"
          ? "alert"
          : "status"
      }
    >
      {message}
    </div>
  );
}