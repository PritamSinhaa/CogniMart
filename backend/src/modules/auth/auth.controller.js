import asyncHandler from "../../utils/asyncHandler.js";
import {
  registerService,
  loginService,
} from "./auth.service.js";
import sendToken from "../../utils/sendToken.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);

  sendToken(user, 201, res, "Registration successful");
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginService(req.body);

  sendToken(user, 200, res, "Login successful");
});

export const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email, role, isEmailVerified } = req.user;

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: _id,
        name,
        email,
        role,
        isEmailVerified,
      },
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});