import bcrypt from "bcryptjs";

import User from "../../models/User.model.js";
import AppError from "../../utils/AppError.js";

export const updateProfileService = async (userId, userData) => {
  const updates = {};

  if (userData.name !== undefined) {
    updates.name = userData.name;
  }

  if (userData.email !== undefined) {
    updates.email = userData.email;
  }

  // Continue duplicate-email check...

  return User.findByIdAndUpdate(userId, updates, {
    returnDocument: "after",
    runValidators: true,
  });
};

export const changePasswordService = async (
  userId,
  currentPassword,
  newPassword,
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;

  await user.save();

  return true;
};

export const getUsersService = async () => {
  const users = await User.find().sort({ createdAt: -1 });

  return users;
};

export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updateUserRoleService = async (userId, role, currentUserId) => {
  // Prevent admin from changing their own role
  if (userId.toString() === currentUserId.toString()) {
    throw new AppError("You cannot change your own role", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const deactivateUserService = async (userId, currentUserId) => {
  // Prevent admin from deactivating themselves
  if (userId.toString() === currentUserId.toString()) {
    throw new AppError("You cannot deactivate your own account", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
