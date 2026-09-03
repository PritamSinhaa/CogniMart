import bcrypt from "bcryptjs";

import User from "../../models/User.model.js";

import AppError from "../../utils/AppError.js";

function createSafeUser(user) {
  return {
    _id: user._id,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const registerService = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  return createSafeUser(user);
};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const loginService = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  /*
   * Keep incorrect email and password
   * under the same message so account
   * existence is not revealed.
   */
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.isActive === false) {
    throw new AppError("This account has been deactivated", 403);
  }

  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    throw new AppError("Invalid email or password", 401);
  }

  return createSafeUser(user);
};
