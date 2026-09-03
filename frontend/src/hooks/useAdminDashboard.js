import { useEffect, useMemo, useState } from "react";

import { getAllOrders } from "../api/order.api";

import { getAdminProducts } from "../api/products.api";

import { getUsers } from "../api/users.api";

import { mapProducts } from "../lib/productMapper";

const LOW_STOCK_LIMIT = 5;
const REVENUE_MONTH_COUNT = 6;
const RECENT_ORDER_LIMIT = 5;
const TOP_PRODUCT_LIMIT = 5;

/*
|--------------------------------------------------------------------------
| Response extraction
|--------------------------------------------------------------------------
*/

function extractOrders(response) {
  const orders = response?.data?.orders || response?.orders || [];

  return Array.isArray(orders) ? orders : [];
}

function extractUsers(response) {
  const users = Array.isArray(response?.data)
    ? response.data
    : response?.data?.users || response?.users || [];

  return Array.isArray(users) ? users : [];
}

function extractProducts(response) {
  const products = response?.data?.products || response?.products || [];

  return Array.isArray(products) ? products : [];
}

function getErrorMessage(error) {
  return (
    error?.data?.message ||
    error?.message ||
    "Unable to load dashboard information."
  );
}

/*
|--------------------------------------------------------------------------
| Revenue helpers
|--------------------------------------------------------------------------
*/

function isRevenueOrder(order) {
  return order?.orderStatus === "delivered" && order?.paymentStatus === "paid";
}

function getOrderTime(order) {
  const time = new Date(order?.createdAt).getTime();

  return Number.isNaN(time) ? 0 : time;
}

/*
|--------------------------------------------------------------------------
| Create six-month revenue data
|--------------------------------------------------------------------------
*/

function createMonthlyRevenue(orders) {
  const now = new Date();

  const months = Array.from(
    {
      length: REVENUE_MONTH_COUNT,
    },
    (_, index) => {
      const monthsBack = REVENUE_MONTH_COUNT - index - 1;

      const date = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,

        label: new Intl.DateTimeFormat("en-IN", {
          month: "short",
        }).format(date),

        year: date.getFullYear(),

        month: date.getMonth(),

        revenue: 0,

        orders: 0,
      };
    },
  );

  const monthMap = new Map(months.map((month) => [month.key, month]));

  orders.filter(isRevenueOrder).forEach((order) => {
    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    const month = monthMap.get(monthKey);

    /*
     * Ignore orders outside the
     * latest six-month range.
     */
    if (!month) {
      return;
    }

    month.revenue += Number(order.total) || 0;

    month.orders += 1;
  });

  return months;
}

/*
|--------------------------------------------------------------------------
| Create top-selling product data
|--------------------------------------------------------------------------
*/

function createTopProducts(orders) {
  const productSales = new Map();

  orders.filter(isRevenueOrder).forEach((order) => {
    if (!Array.isArray(order.items)) {
      return;
    }

    order.items.forEach((item) => {
      const populatedProduct =
        typeof item.product === "object" ? item.product : null;

      const productId = populatedProduct?._id || item.product || null;

      /*
       * Orders contain a saved product
       * name, so deleted products can
       * remain in historical reports.
       */
      const productName =
        item.name || populatedProduct?.name || "Unknown product";

      const mapKey = productId ? String(productId) : `deleted-${productName}`;

      const currentProduct = productSales.get(mapKey) || {
        id: productId,

        name: productName,

        category: populatedProduct?.category || "Uncategorized",

        image:
          populatedProduct?.images?.[0] || "/images/product-placeholder.png",

        unitsSold: 0,

        revenue: 0,
      };

      const quantity = Number(item.quantity) || 0;

      const itemRevenue =
        Number(item.subtotal) || (Number(item.price) || 0) * quantity;

      currentProduct.unitsSold += quantity;

      currentProduct.revenue += itemRevenue;

      productSales.set(mapKey, currentProduct);
    });
  });

  return [...productSales.values()]
    .sort((firstProduct, secondProduct) => {
      const unitsDifference = secondProduct.unitsSold - firstProduct.unitsSold;

      if (unitsDifference !== 0) {
        return unitsDifference;
      }

      return secondProduct.revenue - firstProduct.revenue;
    })
    .slice(0, TOP_PRODUCT_LIMIT);
}

/*
|--------------------------------------------------------------------------
| Admin dashboard hook
|--------------------------------------------------------------------------
*/

export default function useAdminDashboard() {
  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState([]);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Load dashboard data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller = new AbortController();

    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        /*
         * Load all independent resources
         * concurrently.
         */
        const [productsResponse, ordersResponse, usersResponse] =
          await Promise.all([
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

            getAllOrders({
              signal: controller.signal,
            }),

            getUsers({
              signal: controller.signal,
            }),
          ]);

        if (!active) {
          return;
        }

        setProducts(mapProducts(extractProducts(productsResponse)));

        setOrders(extractOrders(ordersResponse));

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

    loadDashboard();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey]);

  /*
  |--------------------------------------------------------------------------
  | Dashboard statistics
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const activeProducts = products.filter(
      (product) => product.isActive !== false,
    );

    const revenueOrders = orders.filter(isRevenueOrder);

    const totalRevenue = revenueOrders.reduce(
      (total, order) => total + (Number(order.total) || 0),
      0,
    );

    const customers = users.filter((user) => user.role === "customer");

    const pendingOrders = orders.filter((order) =>
      ["pending", "confirmed", "processing"].includes(order.orderStatus),
    );

    const lowStockProducts = activeProducts.filter((product) => {
      const stock = Number(product.stock) || 0;

      return stock > 0 && stock <= LOW_STOCK_LIMIT;
    });

    const outOfStockProducts = activeProducts.filter(
      (product) => (Number(product.stock) || 0) === 0,
    );

    const inventoryUnits = activeProducts.reduce(
      (total, product) => total + (Number(product.stock) || 0),
      0,
    );

    return {
      totalRevenue,

      totalOrders: orders.length,

      totalCustomers: customers.length,

      totalProducts: products.length,

      activeProducts: activeProducts.length,

      pendingOrders: pendingOrders.length,

      lowStockProducts: lowStockProducts.length,

      outOfStockProducts: outOfStockProducts.length,

      inventoryUnits,
    };
  }, [products, orders, users]);

  /*
  |--------------------------------------------------------------------------
  | Recent orders
  |--------------------------------------------------------------------------
  */

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (firstOrder, secondOrder) =>
          getOrderTime(secondOrder) - getOrderTime(firstOrder),
      )
      .slice(0, RECENT_ORDER_LIMIT);
  }, [orders]);

  /*
  |--------------------------------------------------------------------------
  | Chart and top-product data
  |--------------------------------------------------------------------------
  */

  const monthlyRevenue = useMemo(() => {
    return createMonthlyRevenue(orders);
  }, [orders]);

  const topProducts = useMemo(() => {
    return createTopProducts(orders);
  }, [orders]);

  /*
  |--------------------------------------------------------------------------
  | Manual refresh
  |--------------------------------------------------------------------------
  */

  const refresh = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  return {
    statistics,
    recentOrders,
    monthlyRevenue,
    topProducts,
    loading,
    error,
    refresh,
  };
}
