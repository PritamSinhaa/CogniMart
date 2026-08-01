import { ZodError } from "zod";

const errorMiddleware = (err, req, res, next) => {
  // Zod Validation Error
  if (err instanceof ZodError) {
    const errors = {};

    err.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // MongoDB Duplicate Key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already exists",
    });
  }

  // Custom AppError
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;