import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingCart,
  Sparkles,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";

const initialNotifications = [
  {
    id: 1,
    type: "order",
    title: "New order received",
    message: "Order #CM-1048 has been placed by Arjun Sharma for ₹12,499.",
    time: "5 minutes ago",
    read: false,
    icon: ShoppingCart,
  },
  {
    id: 2,
    type: "inventory",
    title: "Low stock alert",
    message: "Wireless Headphones have only 8 units remaining in inventory.",
    time: "18 minutes ago",
    read: false,
    icon: Package,
  },
  {
    id: 3,
    type: "ai",
    title: "New AI recommendation",
    message:
      "CogniMart AI recommends restocking Gaming Keyboards due to a 34% demand increase.",
    time: "42 minutes ago",
    read: false,
    icon: Sparkles,
  },
  {
    id: 4,
    type: "customer",
    title: "New customer registered",
    message: "Priya Mehta created a new customer account.",
    time: "1 hour ago",
    read: true,
    icon: UserPlus,
  },
  {
    id: 5,
    type: "order",
    title: "Order delivered",
    message: "Order #CM-1041 was successfully delivered to the customer.",
    time: "2 hours ago",
    read: true,
    icon: CheckCircle2,
  },
  {
    id: 6,
    type: "inventory",
    title: "Product out of stock",
    message: "USB-C Fast Charger is currently out of stock.",
    time: "3 hours ago",
    read: true,
    icon: AlertTriangle,
  },
  {
    id: 7,
    type: "system",
    title: "Daily report generated",
    message: "Your daily sales and performance report is ready to review.",
    time: "Yesterday",
    read: true,
    icon: Clock3,
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Orders", value: "order" },
  { label: "Inventory", value: "inventory" },
  { label: "AI Insights", value: "ai" },
];

const typeStyles = {
  order: {
    icon: ShoppingCart,
    wrapper: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  inventory: {
    icon: Package,
    wrapper:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  },
  ai: {
    icon: Sparkles,
    wrapper:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  customer: {
    icon: UserPlus,
    wrapper:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  },
  system: {
    icon: CheckCircle2,
    wrapper:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

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

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const removeNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

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

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
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
                <Bell size={17} />
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
                System Center
              </p>
            </div>

            <h1
              className="
                mt-3
                text-2xl
                font-bold
                tracking-tight
                text-slate-950
                dark:text-white
              "
            >
              Notifications
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Stay updated with orders, inventory, customers, and AI
              recommendations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-xs
                font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              <Check size={14} />
              Mark all read
            </button>

            <button
              type="button"
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-xs
                font-semibold
                text-slate-600
                shadow-sm
                transition
                hover:bg-red-50
                hover:text-red-600
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-400
                dark:hover:bg-red-950/30
                dark:hover:text-red-400
              "
            >
              <Trash2 size={14} />
              Clear all
            </button>
          </div>
        </div>

        {/* SUMMARY */}

        <div
          className="
            mt-6
            grid
            gap-3
            sm:grid-cols-3
          "
        >
          <SummaryCard
            icon={Bell}
            label="Total notifications"
            value={notifications.length}
          />

          <SummaryCard
            icon={AlertTriangle}
            label="Unread"
            value={unreadCount}
          />

          <SummaryCard
            icon={Sparkles}
            label="AI alerts"
            value={
              notifications.filter((notification) => notification.type === "ai")
                .length
            }
          />
        </div>

        {/* NOTIFICATION PANEL */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          {/* FILTERS */}

          <div
            className="
              flex
              gap-1
              overflow-x-auto
              border-b
              border-slate-200
              px-4
              py-3
              dark:border-slate-800
            "
          >
            {filters.map((filter) => {
              const active = activeFilter === filter.value;

              const count =
                filter.value === "all"
                  ? notifications.length
                  : filter.value === "unread"
                    ? unreadCount
                    : notifications.filter(
                        (notification) => notification.type === filter.value,
                      ).length;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`
                    inline-flex
                    shrink-0
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    transition
                    ${
                      active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    }
                  `}
                >
                  {filter.label}

                  <span
                    className={`
                      rounded-full
                      px-1.5
                      py-0.5
                      text-[9px]
                      ${
                        active
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }
                    `}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* LIST */}

          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onRemove={removeNotification}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

        <p className="py-5 text-center text-[10px] text-slate-400">
          Notifications are updated automatically as activity occurs.
        </p>
      </div>
    </main>
  );
}

function NotificationItem({ notification, onRead, onRemove }) {
  const fallbackStyle = typeStyles.system;

  const style = typeStyles[notification.type] || fallbackStyle;

  const Icon = notification.icon || style.icon;

  return (
    <div
      className={`
        group
        flex
        items-start
        gap-3
        px-4
        py-4
        transition
        sm:px-5
        ${
          notification.read
            ? "bg-white dark:bg-slate-900"
            : "bg-emerald-50/40 dark:bg-emerald-950/10"
        }
        hover:bg-slate-50
        dark:hover:bg-slate-800/50
      `}
    >
      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${style.wrapper}
        `}
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

              <h3
                className={`
                  truncate
                  text-sm
                  ${
                    notification.read
                      ? "font-semibold text-slate-700 dark:text-slate-300"
                      : "font-bold text-slate-950 dark:text-white"
                  }
                `}
              >
                {notification.title}
              </h3>
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {notification.message}
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1 text-[10px] text-slate-400">
            <Clock3 size={11} />
            {notification.time}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!notification.read && (
            <button
              type="button"
              onClick={() => onRead(notification.id)}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-emerald-50
                px-2.5
                py-1.5
                text-[10px]
                font-semibold
                text-emerald-700
                transition
                hover:bg-emerald-100
                dark:bg-emerald-950/40
                dark:text-emerald-400
                dark:hover:bg-emerald-950/60
              "
            >
              <Check size={12} />
              Mark as read
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(notification.id)}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              px-2.5
              py-1.5
              text-[10px]
              font-semibold
              text-slate-400
              transition
              hover:bg-red-50
              hover:text-red-600
              dark:hover:bg-red-950/30
              dark:hover:text-red-400
            "
          >
            <Trash2 size={12} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
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

      <div>
        <p className="text-lg font-bold text-slate-900 dark:text-white">
          {value}
        </p>

        <p className="text-[10px] font-medium text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-slate-100
          text-slate-400
          dark:bg-slate-800
        "
      >
        <Bell size={20} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
        No notifications
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        You're all caught up. New order, inventory, and AI notifications will
        appear here.
      </p>
    </div>
  );
}
