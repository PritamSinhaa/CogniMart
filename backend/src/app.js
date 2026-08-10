import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import healthRoutes from "./modules/health/health.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/product/product.routes.js";

console.log("App.js is loaded");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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

app.use(errorMiddleware);

export default app;
