import {
  updateProfileService,
  changePasswordService,
  getUsersService,
  getUserByIdService,
  updateUserRoleService,
  deactivateUserService,
} from "./user.service.js";

export const updateProfile = async (req, res) => {
  const user = await updateProfileService(
    req.user._id,
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
};

export const changePassword = async (req, res) => {
  const {
    currentPassword,
    newPassword,
  } = req.body;

  await changePasswordService(
    req.user._id,
    currentPassword,
    newPassword
  );

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

export const getUsers = async (req, res) => {
  const users = await getUsersService();

  return res.status(200).json({
    success: true,
    data: users,
  });
};

export const getUserById = async (req, res) => {
  const user = await getUserByIdService(req.params.id);

  return res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
};

export const updateUserRole = async (req, res) => {
  const user = await updateUserRoleService(
    req.params.id,
    req.body.role,
    req.user._id
  );

  return res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: {
      user,
    },
  });
};

export const deactivateUser = async (req, res) => {
  const user = await deactivateUserService(
    req.params.id,
    req.user._id
  );

  return res.status(200).json({
    success: true,
    message: "User deactivated successfully",
    data: {
      user,
    },
  });
};