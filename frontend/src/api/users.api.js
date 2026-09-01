import { apiRequest } from "./client";

/*
|--------------------------------------------------------------------------
| Customer account
|--------------------------------------------------------------------------
*/

export function updateProfile(payload, options = {}) {
  return apiRequest("/users/profile", {
    ...options,
    method: "PATCH",
    body: payload,
  });
}

export function changePassword(payload, options = {}) {
  return apiRequest("/users/password", {
    ...options,
    method: "PATCH",
    body: payload,
  });
}

/*
|--------------------------------------------------------------------------
| Admin user management
|--------------------------------------------------------------------------
*/

export function getUsers(options = {}) {
  return apiRequest("/users", options);
}

export function getUserById(userId, options = {}) {
  return apiRequest(`/users/${userId}`, options);
}

export function updateUserRole(userId, role, options = {}) {
  return apiRequest(`/users/${userId}/role`, {
    ...options,
    method: "PATCH",
    body: {
      role,
    },
  });
}

export function deactivateUser(userId, options = {}) {
  return apiRequest(`/users/${userId}`, {
    ...options,
    method: "DELETE",
  });
}
