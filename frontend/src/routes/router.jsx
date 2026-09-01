import { createBrowserRouter } from "react-router-dom";

// App and layouts
import App from "../App";
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/admin/layout/AdminLayout";
import FooterLayout from "../components/layout/FooterLayout";

// Route protection
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Customer pages
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Categories from "../pages/Categories/Categories";
import Deals from "../pages/Deals/Deals";
import Checkout from "../pages/Checkout/Checkout";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/OrderDetails/OrderDetails";
import Profile from "../pages/Profile/Profile";
import AIAssistant from "../pages/AIAssistant/AIAssistant";

// Authentication pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

// Admin pages
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminProducts from "../pages/Admin/Products/AdminProducts";
import AdminProductForm from "../pages/Admin/Products/AdminProductForm";
import AdminOrders from "../pages/Admin/Orders/AdminOrders";
import AdminOrderDetails from "../pages/Admin/Orders/AdminOrderDetails";
import AdminCustomers from "../pages/Admin/Customers/AdminCustomers";
import AdminCustomerDetails from "../pages/Admin/Customers/AdminCustomerDetails";
import AdminInventory from "../pages/Admin/Inventory/AdminInventory";
import AdminCategories from "../pages/Admin/Categories/AdminCategories";
import AdminCoupons from "../pages/Admin/Coupons/AdminCoupons";
import AdminAnalytics from "../pages/Admin/Analytics/AdminAnalytics";
import AdminAIInsights from "../pages/Admin/AIInsights/AdminAIInsights";
import AdminNotifications from "../pages/Admin/Notifications/AdminNotifications";
import AdminSettings from "../pages/Admin/Settings/AdminSettings";

/*
 * 404 PAGE
 *
 * You can move this into src/pages/NotFound/NotFound.jsx later.
 */
function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-5 dark:bg-slate-950">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          404
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  /*
   * CUSTOMER ROUTES
   *
   * MainLayout provides the customer navbar, page content
   * and footer through its <Outlet />.
   */
  {
    path: "/",
    element: <MainLayout />,

    children: [
      /*
       * Pages that display the footer
       */
      {
        element: <FooterLayout />,

        children: [
          {
            index: true,
            element: <App />,
          },
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "products/:id",
            element: <ProductDetails />,
          },
          {
            path: "categories",
            element: <Categories />,
          },
          {
            path: "deals",
            element: <Deals />,
          },
        ],
      },

      /*
       * Pages without the footer
       */
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "wishlist",
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "ai-assistant",
        element: <AIAssistant />,
      },

      /*
       * Protected pages without footer
       */
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:orderId",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-success/:orderId",
        element: (
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        ),
      },
      {
        path: "account/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  /*
   * ADMIN ROUTES
   *
   * Wrapping AdminLayout protects every child route.
   * Users must be authenticated and have role === "admin".
   */
  {
    path: "/admin",

    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),

    children: [
      /*
       * Admin dashboard
       */
      {
        index: true,
        element: <AdminDashboard />,
      },

      /*
       * Admin products
       */
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "products/new",
        element: <AdminProductForm />,
      },
      {
        path: "products/:productId/edit",
        element: <AdminProductForm />,
      },

      /*
       * Admin orders
       */
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "orders/:orderId",
        element: <AdminOrderDetails />,
      },

      /*
       * Admin customers
       */
      {
        path: "customers",
        element: <AdminCustomers />,
      },
      {
        path: "customers/:customerId",
        element: <AdminCustomerDetails />,
      },

      /*
       * Admin inventory
       */
      {
        path: "inventory",
        element: <AdminInventory />,
      },

      /*
       * Admin categories
       */
      {
        path: "categories",
        element: <AdminCategories />,
      },

      /*
       * Admin coupons
       */
      {
        path: "coupons",
        element: <AdminCoupons />,
      },

      /*
       * Admin analytics
       */
      {
        path: "analytics",
        element: <AdminAnalytics />,
      },

      /*
       * Admin AI business insights
       */
      {
        path: "ai-insights",
        element: <AdminAIInsights />,
      },

      /*
       * Admin notifications
       */
      {
        path: "notifications",
        element: <AdminNotifications />,
      },

      /*
       * Admin settings
       */
      {
        path: "settings",
        element: <AdminSettings />,
      },
    ],
  },

  /*
   * GLOBAL 404 ROUTE
   *
   * This must remain last.
   */
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
