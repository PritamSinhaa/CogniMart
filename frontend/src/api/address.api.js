import { apiRequest } from "./client";

export function getAddresses() {
  return apiRequest("/addresses");
}

export function getAddressById(addressId) {
  return apiRequest(`/addresses/${addressId}`);
}

export function createAddress(addressData) {
  return apiRequest("/addresses", {
    method: "POST",
    body: addressData,
  });
}

export function updateAddress(
  addressId,
  addressData,
) {
  return apiRequest(`/addresses/${addressId}`, {
    method: "PATCH",
    body: addressData,
  });
}

export function deleteAddress(addressId) {
  return apiRequest(`/addresses/${addressId}`, {
    method: "DELETE",
  });
}

export function setDefaultAddress(addressId) {
  return apiRequest(
    `/addresses/${addressId}/default`,
    {
      method: "PATCH",
    },
  );
}