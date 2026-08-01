import asyncHandler from "../../utils/asyncHandler.js";
import { registerService } from "./auth.service.js";
import sendToken from "../../utils/sendToken.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);

  sendToken(user, 201, res, "Registration successful");
});