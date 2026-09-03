import { useEffect, useMemo, useState } from "react";

import { getAllOrders } from "../api/order.api";

import { getAdminProducts } from "../api/products.api";

import { getUsers } from "../api/users.api";

export const ANALYTICS_RANGES = [
  {
    value: "last_30_days",
    label: "Last 30 days",
  },
  {
    value: "last_3_months",
    label: "Last 3 months",
  },
  {
    value: "last_6_months",
    label: "Last 6 months",
  },
  {
    value: "this_year",
    label: "This year",
  },
];

function extractOrders(response) {
  const orders = response?.data?.orders || response?.orders || [];

  return Array.isArray(orders) ? orders : [];
}

function extractProducts(response) {
  const products = response?.data?.products || response?.products || [];

  return Array.isArray(products) ? products : [];
}

function extractUsers(response) {
  const users = Array.isArray(response?.data)
    ? response.data
    : response?.data?.users || response?.users || [];

  return Array.isArray(users) ? users : [];
}

function getErrorMessage(error) {
  return error?.data?.message || error?.message || "Unable to load analytics.";
}

function getDate(value) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getRangeStart(range, now) {
  switch (range) {
    case "last_30_days": {
      const date = new Date(now);

      date.setDate(date.getDate() - 29);

      date.setHours(0, 0, 0, 0);

      return date;
    }

    case "last_3_months":
      return new Date(now.getFullYear(), now.getMonth() - 2, 1);

    case "this_year":
      return new Date(now.getFullYear(), 0, 1);

    case "last_6_months":
    default:
      return new Date(now.getFullYear(), now.getMonth() - 5, 1);
  }
}

function isInsideRange(value, start, end) {
  const date = getDate(value);

  if (!date) {
    return false;
  }

  return date >= start && date <= end;
}

function isRevenueOrder(order) {
  return order?.orderStatus === "delivered" && order?.paymentStatus === "paid";
}

function calculateGrowth(currentValue, previousValue) {
  if (previousValue <= 0) {
    return currentValue > 0 ? null : 0;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

function getOrderUserId(order) {
  if (typeof order?.user === "object") {
    return order.user?._id;
  }

  return order?.user;
}

function getItemProductId(item) {
  if (typeof item?.product === "object") {
    return item.product?._id;
  }

  return item?.product;
}

/*
|--------------------------------------------------------------------------
| Time series
|--------------------------------------------------------------------------
*/

function createMonthlySeries(orders, users, start, end) {
  const months = [];

  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

  while (cursor <= end) {
    const date = new Date(cursor);

    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,

      label: new Intl.DateTimeFormat("en-IN", {
        month: "short",
      }).format(date),

      revenue: 0,
      orders: 0,
      customers: 0,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  const monthMap = new Map(months.map((month) => [month.key, month]));

  orders.forEach((order) => {
    const date = getDate(order.createdAt);

    if (!date || date < start || date > end) {
      return;
    }

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const month = monthMap.get(key);

    if (!month) {
      return;
    }

    month.orders += 1;

    if (isRevenueOrder(order)) {
      month.revenue += Number(order.total) || 0;
    }
  });

  users.forEach((user) => {
    if (user.role !== "customer") {
      return;
    }

    const date = getDate(user.createdAt);

    if (!date || date < start || date > end) {
      return;
    }

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const month = monthMap.get(key);

    if (month) {
      month.customers += 1;
    }
  });

  return months;
}

/*
|--------------------------------------------------------------------------
| Category revenue
|--------------------------------------------------------------------------
*/

function createCategoryData(revenueOrders, products) {
  const productMap = new Map(
    products.map((product) => [String(product._id), product]),
  );

  const categories = new Map();

  revenueOrders.forEach((order) => {
    if (!Array.isArray(order.items)) {
      return;
    }

    order.items.forEach((item) => {
      const productId = getItemProductId(item);

      const product = productId ? productMap.get(String(productId)) : null;

      const category = product?.category || "Uncategorized";

      const current = categories.get(category) || {
        name: category,
        revenue: 0,
        units: 0,
      };

      current.revenue += Number(item.subtotal) || 0;

      current.units += Number(item.quantity) || 0;

      categories.set(category, current);
    });
  });

  const totalRevenue = [...categories.values()].reduce(
    (total, category) => total + category.revenue,
    0,
  );

  return [...categories.values()]
    .map((category) => ({
      ...category,

      percentage:
        totalRevenue > 0
          ? Number(((category.revenue / totalRevenue) * 100).toFixed(1))
          : 0,
    }))
    .sort(
      (firstCategory, secondCategory) =>
        secondCategory.revenue - firstCategory.revenue,
    );
}

/*
|--------------------------------------------------------------------------
| Top products
|--------------------------------------------------------------------------
*/

function createTopProducts(revenueOrders, products) {
  const productMap = new Map(
    products.map((product) => [String(product._id), product]),
  );

  const sales = new Map();

  revenueOrders.forEach((order) => {
    if (!Array.isArray(order.items)) {
      return;
    }

    order.items.forEach((item) => {
      const productId = getItemProductId(item);

      const product = productId ? productMap.get(String(productId)) : null;

      const name = item.name || product?.name || "Unknown product";

      const key = productId ? String(productId) : `deleted-${name}`;

      const current = sales.get(key) || {
        id: productId,
        name,
        category: product?.category || "Uncategorized",
        units: 0,
        revenue: 0,
      };

      current.units += Number(item.quantity) || 0;

      current.revenue += Number(item.subtotal) || 0;

      sales.set(key, current);
    });
  });

  return [...sales.values()]
    .sort(
      (firstProduct, secondProduct) =>
        secondProduct.revenue - firstProduct.revenue,
    )
    .slice(0, 5);
}

/*
|--------------------------------------------------------------------------
| Operational metrics
|--------------------------------------------------------------------------
*/

function createMetrics(orders) {
  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "cancelled",
  ).length;

  const customerOrders = new Map();

  orders.filter(isRevenueOrder).forEach((order) => {
    const userId = getOrderUserId(order);

    if (!userId) {
      return;
    }

    const key = String(userId);

    customerOrders.set(key, (customerOrders.get(key) || 0) + 1);
  });

  const purchasingCustomers = customerOrders.size;

  const repeatCustomers = [...customerOrders.values()].filter(
    (count) => count > 1,
  ).length;

  return {
    fulfillmentRate:
      totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0,

    cancellationRate:
      totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0,

    repeatPurchaseRate:
      purchasingCustomers > 0
        ? (repeatCustomers / purchasingCustomers) * 100
        : 0,
  };
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export default function useAdminAnalytics(range = "last_6_months") {
  const [orders, setOrders] = useState([]);

  const [products, setProducts] = useState([]);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    let active = true;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const [ordersResponse, productsResponse, usersResponse] =
          await Promise.all([
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

            getUsers({
              signal: controller.signal,
            }),
          ]);

        if (!active) {
          return;
        }

        setOrders(extractOrders(ordersResponse));

        setProducts(extractProducts(productsResponse));

        setUsers(extractUsers(usersResponse));
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

    loadAnalytics();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey]);

  const analytics = useMemo(() => {
    const now = new Date();

    const start = getRangeStart(range, now);

    const duration = now.getTime() - start.getTime();

    const previousStart = new Date(start.getTime() - duration);

    const currentOrders = orders.filter((order) =>
      isInsideRange(order.createdAt, start, now),
    );

    const previousOrders = orders.filter((order) =>
      isInsideRange(order.createdAt, previousStart, start),
    );

    const revenueOrders = currentOrders.filter(isRevenueOrder);

    const previousRevenueOrders = previousOrders.filter(isRevenueOrder);

    const totalRevenue = revenueOrders.reduce(
      (total, order) => total + (Number(order.total) || 0),
      0,
    );

    const previousRevenue = previousRevenueOrders.reduce(
      (total, order) => total + (Number(order.total) || 0),
      0,
    );

    const customers = users.filter((user) => user.role === "customer");

    const newCustomers = customers.filter((user) =>
      isInsideRange(user.createdAt, start, now),
    ).length;

    const previousCustomers = customers.filter((user) =>
      isInsideRange(user.createdAt, previousStart, start),
    ).length;

    return {
      statistics: {
        totalRevenue,

        totalOrders: currentOrders.length,

        totalCustomers: customers.length,

        newCustomers,

        averageOrderValue:
          revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0,

        revenueGrowth: calculateGrowth(totalRevenue, previousRevenue),

        orderGrowth: calculateGrowth(
          currentOrders.length,
          previousOrders.length,
        ),

        customerGrowth: calculateGrowth(newCustomers, previousCustomers),
      },

      timeSeries: createMonthlySeries(orders, users, start, now),

      categories: createCategoryData(revenueOrders, products),

      topProducts: createTopProducts(revenueOrders, products),

      metrics: createMetrics(currentOrders),
    };
  }, [orders, products, users, range]);

  const refresh = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  return {
    ...analytics,
    loading,
    error,
    refresh,
  };
}
