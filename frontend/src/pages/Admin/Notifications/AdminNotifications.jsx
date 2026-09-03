import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Check,
  Clock3,
  CreditCard,
  LoaderCircle,
  Package,
  RefreshCw,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import useAdminNotifications from "../../../hooks/useAdminNotifications";

const FILTERS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Unread",
    value: "unread",
  },
  {
    label: "Orders",
    value: "order",
  },
  {
    label: "Inventory",
    value: "inventory",
  },
  {
    label: "Payments",
    value: "payment",
  },
];

const TYPE_STYLES = {
  order: {
    icon: ShoppingCart,

    wrapper: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },

  inventory: {
    icon: Package,

    wrapper:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },

  payment: {
    icon: CreditCard,

    wrapper: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
};

function formatRelativeTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const difference = date.getTime() - Date.now();

  const absoluteDifference = Math.abs(difference);

  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  if (absoluteDifference < 60 * 1000) {
    return formatter.format(Math.round(difference / 1000), "second");
  }

  if (absoluteDifference < 60 * 60 * 1000) {
    return formatter.format(Math.round(difference / (60 * 1000)), "minute");
  }

  if (absoluteDifference < 24 * 60 * 60 * 1000) {
    return formatter.format(Math.round(difference / (60 * 60 * 1000)), "hour");
  }

  if (absoluteDifference < 30 * 24 * 60 * 60 * 1000) {
    return formatter.format(
      Math.round(difference / (24 * 60 * 60 * 1000)),
      "day",
    );
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

export default function AdminNotifications() {
  const [activeFilter, setActiveFilter] = useState("all");

  const {
    notifications,
    unreadCount,
    urgentCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    dismissAll,
    refresh,
  } = useAdminNotifications();

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    if (activeFilter === "unread") {
      return notifications.filter((notification) => !notification.read);
    }

    return notifications.filter(
      (notification) => notification.type === activeFilter,
    );
  }, [notifications, activeFilter]);

  const getFilterCount = (filter) => {
    if (filter === "all") {
      return notifications.length;
    }

    if (filter === "unread") {
      return unreadCount;
    }

    return notifications.filter((notification) => notification.type === filter)
      .length;
  };

  const handleDismissAll = () => {
    if (notifications.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Dismiss all current notifications? This will not change any orders or products.",
    );

    if (confirmed) {
      dismissAll();
    }
  };

  if (loading) {
    return <NotificationsLoading />;
  }

  if (error) {
    return <NotificationsError message={error} onRetry={refresh} />;
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <NotificationsHeader
          unreadCount={unreadCount}
          totalCount={notifications.length}
          onRefresh={refresh}
          onMarkAllRead={markAllAsRead}
          onDismissAll={handleDismissAll}
        />

        <NotificationSummary
          totalCount={notifications.length}
          unreadCount={unreadCount}
          urgentCount={urgentCount}
        />

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <NotificationFilters
            activeFilter={activeFilter}
            onChange={setActiveFilter}
            getCount={getFilterCount}
          />

          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onDismiss={dismissNotification}
                />
              ))}
            </div>
          ) : (
            <NotificationsEmpty filtered={notifications.length > 0} />
          )}
        </section>

        <p className="py-5 text-center text-[10px] leading-5 text-slate-400">
          Alerts are generated from live order and inventory data. Read and
          dismissed states are stored in this browser.
        </p>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

function NotificationsHeader({
  unreadCount,
  totalCount,
  onRefresh,
  onMarkAllRead,
  onDismissAll,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Bell size={17} />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            System center
          </p>
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          Notifications
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review order, payment and inventory alerts.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <RefreshCw size={14} />
          Refresh
        </button>

        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <Check size={14} />
          Mark all read
        </button>

        <button
          type="button"
          onClick={onDismissAll}
          disabled={totalCount === 0}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-xs font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 size={14} />
          Dismiss all
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Summary
|--------------------------------------------------------------------------
*/

function NotificationSummary({ totalCount, unreadCount, urgentCount }) {
  return (
    <section className="mt-6 grid gap-3 sm:grid-cols-3">
      <SummaryCard
        icon={Bell}
        label="Total alerts"
        value={totalCount}
        tone="default"
      />

      <SummaryCard
        icon={Check}
        label="Unread"
        value={unreadCount}
        tone="info"
      />

      <SummaryCard
        icon={AlertTriangle}
        label="Urgent"
        value={urgentCount}
        tone="danger"
      />
    </section>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
  const styles = {
    default:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",

    info: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

    danger: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          styles[tone] || styles.default
        }`}
      >
        <Icon size={16} />
      </div>

      <div>
        <p className="text-lg font-bold text-slate-900 dark:text-white">
          {value}
        </p>

        <p className="text-[10px] font-medium text-slate-400">{label}</p>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

function NotificationFilters({ activeFilter, onChange, getCount }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-4 py-3 dark:border-slate-800">
      {FILTERS.map((filter) => {
        const active = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            aria-pressed={active}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              active
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {filter.label}

            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                active
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {getCount(filter.value)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Notification
|--------------------------------------------------------------------------
*/

function NotificationItem({ notification, onRead, onDismiss }) {
  const style = TYPE_STYLES[notification.type] || TYPE_STYLES.order;

  const Icon = style.icon;

  const urgent = notification.severity === "critical";

  return (
    <article
      className={`group flex items-start gap-3 px-4 py-4 transition-colors sm:px-5 ${
        notification.read
          ? "bg-white dark:bg-slate-900"
          : "bg-emerald-50/40 dark:bg-emerald-500/5"
      } hover:bg-slate-50 dark:hover:bg-slate-800/50`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.wrapper}`}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {!notification.read && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              )}

              <h2
                className={`truncate text-sm ${
                  notification.read
                    ? "font-semibold text-slate-700 dark:text-slate-300"
                    : "font-bold text-slate-950 dark:text-white"
                }`}
              >
                {notification.title}
              </h2>

              {urgent && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[8px] font-bold uppercase text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  Urgent
                </span>
              )}
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {notification.message}
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1 text-[10px] text-slate-400">
            <Clock3 size={11} />

            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {notification.href && (
            <Link
              to={notification.href}
              onClick={() => onRead(notification.id)}
              className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            >
              {notification.actionLabel || "View details"}
            </Link>
          )}

          {!notification.read && (
            <button
              type="button"
              onClick={() => onRead(notification.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              <Check size={12} />
              Mark as read
            </button>
          )}

          <button
            type="button"
            onClick={() => onDismiss(notification.id)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <Trash2 size={12} />
            Dismiss
          </button>
        </div>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| States
|--------------------------------------------------------------------------
*/

function NotificationsEmpty({ filtered }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Bell size={20} />
      </div>

      <h2 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
        {filtered ? "No matching alerts" : "No active alerts"}
      </h2>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {filtered
          ? "Try selecting another notification filter."
          : "There are no pending order, payment or inventory issues."}
      </p>
    </div>
  );
}

function NotificationsLoading() {
  return (
    <main
      className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950"
      role="status"
    >
      <div className="text-center">
        <LoaderCircle
          size={30}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Loading notifications...
        </p>
      </div>
    </main>
  );
}

function NotificationsError({ message, onRetry }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <AlertCircle size={34} className="mx-auto text-red-500" />

        <h1 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
          Unable to load notifications
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    </main>
  );
}
