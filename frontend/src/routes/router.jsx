import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import MainLayout from "../components/layout/MainLayout";

import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Wishlist from "../pages/Wishlist/Wishlist";
import Categories from "../pages/Categories/Categories";
import Deals from "../pages/Deals/Deals";
import Checkout from "../pages/Checkout/Checkout";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import Orders from "../pages/Orders/Orders";
import OrderDetails from "@/pages/OrderDetails/OrderDetails";
import Profile from "@/pages/Profile/Profile";
import AIAssistant from "@/pages/AIAssistant/AIAssistant";

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
          The page you're looking for doesn't exist yet.
        </p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
        path: "categories",
        element: <Categories />,
      },
      {
        path: "deals",
        element: <Deals />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetails />,
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
        path: "account/profile",
        element: <Profile />,
      },
      {
        path: "ai-assistant",
        element: <AIAssistant />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
