import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  // 1. Get access token from cookies
  const token = req.cookies.accessToken;

  // 2. Check if token exists
  if (!token) {
    throw new AppError("Please login to continue", 401);
  }

  // 3. Verify JWT
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }

  // 4. Find user from database
  const user = await User.findById(decoded.id);

  // 5. Check if user still exists
  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  // 6. Attach authenticated user to request object
  req.user = user;

  // 7. Continue to next middleware/controller
  next();
});

export default isAuthenticated;