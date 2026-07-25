import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoutes from "./modules/health/health.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

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

app.use(errorMiddleware);

export default app;
