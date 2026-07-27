import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement:<NotFound/>,
    children: [
      { index: true, element: <Home />},
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default AppRouter;
