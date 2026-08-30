import { apiRequest } from "./client";

export function updateProfile(
  payload,
  options = {},
) {
  return apiRequest(
    "/users/profile",
    {
      method: "PATCH",
      body: payload,
      ...options,
    },
  );
}

export function changePassword(
  payload,
  options = {},
) {
  return apiRequest(
    "/users/password",
    {
      method: "PATCH",
      body: payload,
      ...options,
    },
  );
}