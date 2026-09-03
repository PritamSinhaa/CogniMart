import { useEffect, useMemo, useState } from "react";

import { getAllOrders } from "../api/order.api";

import { getAdminProducts } from "../api/products.api";

const LOW_STOCK_LIMIT = 5;
const NOTIFICATION_LIMIT = 50;

const READ_STORAGE_KEY = "cognimart_admin_read_notifications";

const DISMISSED_STORAGE_KEY = "cognimart_admin_dismissed_notifications";

function extractOrders(response) {
  const orders = response?.data?.orders || response?.orders || [];

  return Array.isArray(orders) ? orders : [];
}

function extractProducts(response) {
  const products = response?.data?.products || response?.products || [];

  return Array.isArray(products) ? products : [];
}

function getErrorMessage(error) {
  return (
    error?.data?.message || error?.message || "Unable to load notifications."
  );
}

function getStoredIds(key) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredIds(key, ids) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /*
     * Notification data can still work
     * during this browser session when
     * localStorage is unavailable.
     */
  }
}

function getTime(value) {
  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function getShortOrderId(orderId) {
  if (!orderId) {
    return "UNKNOWN";
  }

  return orderId.slice(-8).toUpperCase();
}

function getCustomerName(order) {
  return order?.user?.name || "Customer";
}

/*
|--------------------------------------------------------------------------
| Create order notifications
|--------------------------------------------------------------------------
*/

function createOrderNotifications(orders) {
  const notifications = [];

  orders.forEach((order) => {
    const orderId = order._id;

    const shortId = getShortOrderId(orderId);

    const customerName = getCustomerName(order);

    const createdAt =
      order.createdAt || order.updatedAt || new Date().toISOString();

    if (order.orderStatus === "pending") {
      notifications.push({
        id: `order-pending-${orderId}`,

        type: "order",

        severity: "info",

        title: "New order received",

        message: `Order #${shortId} was placed by ${customerName}.`,

        createdAt,

        href: `/admin/orders/${orderId}`,

        actionLabel: "View order",
      });
    }

    if (["confirmed", "processing"].includes(order.orderStatus)) {
      notifications.push({
        id: `order-processing-${orderId}-${order.orderStatus}`,

        type: "order",

        severity: "warning",

        title: "Order needs attention",

        message: `Order #${shortId} is currently ${order.orderStatus}.`,

        createdAt: order.updatedAt || createdAt,

        href: `/admin/orders/${orderId}`,

        actionLabel: "Manage order",
      });
    }

    if (order.paymentStatus === "failed") {
      notifications.push({
        id: `payment-failed-${orderId}`,

        type: "payment",

        severity: "critical",

        title: "Payment failed",

        message: `Payment failed for order #${shortId}.`,

        createdAt: order.updatedAt || createdAt,

        href: `/admin/orders/${orderId}`,

        actionLabel: "Review payment",
      });
    }

    if (order.orderStatus === "cancelled") {
      notifications.push({
        id: `order-cancelled-${orderId}`,

        type: "order",

        severity: "warning",

        title: "Order cancelled",

        message: `Order #${shortId} was cancelled.`,

        createdAt: order.updatedAt || createdAt,

        href: `/admin/orders/${orderId}`,

        actionLabel: "View order",
      });
    }
  });

  return notifications;
}

/*
|--------------------------------------------------------------------------
| Create inventory notifications
|--------------------------------------------------------------------------
*/

function createInventoryNotifications(products) {
  const notifications = [];

  products
    .filter((product) => product.isActive !== false)
    .forEach((product) => {
      const stock = Number(product.stock) || 0;

      const productId = product._id || product.id;

      const createdAt =
        product.updatedAt || product.createdAt || new Date().toISOString();

      if (stock <= 0) {
        notifications.push({
          id: `stock-empty-${productId}`,

          type: "inventory",

          severity: "critical",

          title: "Product out of stock",

          message: `${product.name} is currently out of stock.`,

          createdAt,

          href: `/admin/products/${productId}/edit`,

          actionLabel: "Update stock",
        });

        return;
      }

      if (stock <= LOW_STOCK_LIMIT) {
        notifications.push({
          id: `stock-low-${productId}-${stock}`,

          type: "inventory",

          severity: "warning",

          title: "Low stock alert",

          message: `${product.name} has only ${stock} ${
            stock === 1 ? "unit" : "units"
          } remaining.`,

          createdAt,

          href: `/admin/products/${productId}/edit`,

          actionLabel: "Update stock",
        });
      }
    });

  return notifications;
}

function createNotifications(orders, products) {
  return [
    ...createOrderNotifications(orders),

    ...createInventoryNotifications(products),
  ]
    .sort(
      (firstNotification, secondNotification) =>
        getTime(secondNotification.createdAt) -
        getTime(firstNotification.createdAt),
    )
    .slice(0, NOTIFICATION_LIMIT);
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export default function useAdminNotifications() {
  const [orders, setOrders] = useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  const [readIds, setReadIds] = useState(() => getStoredIds(READ_STORAGE_KEY));

  const [dismissedIds, setDismissedIds] = useState(() =>
    getStoredIds(DISMISSED_STORAGE_KEY),
  );

  /*
  |--------------------------------------------------------------------------
  | Load orders and products
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller = new AbortController();

    let active = true;

    async function loadNotifications() {
      try {
        setLoading(true);
        setError("");

        const [ordersResponse, productsResponse] = await Promise.all([
          getAllOrders({
            signal: controller.signal,
          }),

          getAdminProducts(
            {
              page: 1,
              limit: 100,
              sort: "newest",
            },
            {
              signal: controller.signal,
            },
          ),
        ]);

        if (!active) {
          return;
        }

        setOrders(extractOrders(ordersResponse));

        setProducts(extractProducts(productsResponse));
      } catch (requestError) {
        if (requestError?.name === "AbortError") {
          return;
        }

        if (active) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey]);

  /*
  |--------------------------------------------------------------------------
  | Derived notification list
  |--------------------------------------------------------------------------
  */

  const notifications = useMemo(() => {
    const readSet = new Set(readIds);

    const dismissedSet = new Set(dismissedIds);

    return createNotifications(orders, products)
      .filter((notification) => !dismissedSet.has(notification.id))
      .map((notification) => ({
        ...notification,

        read: readSet.has(notification.id),
      }));
  }, [orders, products, readIds, dismissedIds]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const urgentCount = notifications.filter(
    (notification) => notification.severity === "critical",
  ).length;

  /*
  |--------------------------------------------------------------------------
  | Read and dismiss actions
  |--------------------------------------------------------------------------
  */

  const markAsRead = (notificationId) => {
    setReadIds((currentIds) => {
      if (currentIds.includes(notificationId)) {
        return currentIds;
      }

      const updatedIds = [...currentIds, notificationId];

      saveStoredIds(READ_STORAGE_KEY, updatedIds);

      return updatedIds;
    });
  };

  const markAllAsRead = () => {
    setReadIds((currentIds) => {
      const updatedIds = [
        ...new Set([
          ...currentIds,
          ...notifications.map((notification) => notification.id),
        ]),
      ];

      saveStoredIds(READ_STORAGE_KEY, updatedIds);

      return updatedIds;
    });
  };

  const dismissNotification = (notificationId) => {
    setDismissedIds((currentIds) => {
      const updatedIds = [...new Set([...currentIds, notificationId])];

      saveStoredIds(DISMISSED_STORAGE_KEY, updatedIds);

      return updatedIds;
    });
  };

  const dismissAll = () => {
    setDismissedIds((currentIds) => {
      const updatedIds = [
        ...new Set([
          ...currentIds,
          ...notifications.map((notification) => notification.id),
        ]),
      ];

      saveStoredIds(DISMISSED_STORAGE_KEY, updatedIds);

      return updatedIds;
    });
  };

  const refresh = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  return {
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
  };
}
