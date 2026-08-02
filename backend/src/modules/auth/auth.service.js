import User from "../../models/User.model.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcryptjs";

export const registerService = async ({ name, email, password }) => {
  // Step 1: Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  // Step 2: Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
