import asyncHandler from "../../utils/asyncHandler.js";
import { registerService, loginService } from "./auth.service.js";
import sendToken, { getAuthCookieOptions } from "../../utils/sendToken.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);

  sendToken(user, 201, res, "Registration successful");
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginService(req.body);

  sendToken(user, 200, res, "Login successful");
});

export const getMe = asyncHandler(async (req, res) => {
  const {
    _id,
    id,
    name,
    email,
    role,
    isActive,
    isEmailVerified,
    createdAt,
    updatedAt,
  } = req.user;

  return res.status(200).json({
    success: true,

    data: {
      user: {
        _id,
        id,
        name,
        email,
        role,
        isActive,
        isEmailVerified,
        createdAt,
        updatedAt,
      },
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", getAuthCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const adminDashboard = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome Admin",
  });
};
