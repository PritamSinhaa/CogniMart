import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import healthRoutes from "./modules/health/health.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import addressRoutes from "./modules/address/address.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";
import wishlistRoutes from "./modules/wishlist/wishlist.routes.js";
import couponRoutes from "./modules/coupon/coupon.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";

console.log("App.js is loaded");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/v1/health", healthRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "CogniMart API is running",
  });
});

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", wishlistRoutes);
app.use("/api/v1", couponRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.use(errorMiddleware);

export default app;
