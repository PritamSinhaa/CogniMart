import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createAddress as createAddressRequest,
  deleteAddress as deleteAddressRequest,
  getAddresses as getAddressesRequest,
  setDefaultAddress as setDefaultAddressRequest,
  updateAddress as updateAddressRequest,
} from "../api/address.api";

import { useAuth } from "./AuthContext";

const AddressContext = createContext(null);

function getErrorMessage(error) {
  return (
    error?.data?.message ||
    error?.message ||
    "Something went wrong with your addresses"
  );
}

function extractAddresses(response) {
  const addresses = response?.data?.addresses || response?.addresses || [];

  return Array.isArray(addresses) ? addresses : [];
}

function extractAddress(response) {
  return response?.data?.address || response?.address || null;
}

export function AddressProvider({ children }) {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Choose the default address
  |--------------------------------------------------------------------------
  */

  const selectPreferredAddress = useCallback((addressList) => {
    if (!addressList.length) {
      setSelectedAddressId(null);
      return;
    }

    setSelectedAddressId((currentSelectedId) => {
      const selectionStillExists = addressList.some(
        (address) => String(address._id) === String(currentSelectedId),
      );

      if (selectionStillExists) {
        return currentSelectedId;
      }

      const defaultAddress = addressList.find((address) => address.isDefault);

      return defaultAddress?._id || addressList[0]._id;
    });
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load addresses
  |--------------------------------------------------------------------------
  */

  const refreshAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      setAddresses([]);
      setSelectedAddressId(null);

      return [];
    }

    setLoading(true);
    setError("");

    try {
      const response = await getAddressesRequest();

      const addressList = extractAddresses(response);

      setAddresses(addressList);
      selectPreferredAddress(addressList);

      return addressList;
    } catch (requestError) {
      setError(getErrorMessage(requestError));

      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectPreferredAddress]);

  /*
  |--------------------------------------------------------------------------
  | Restore addresses after login
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setAddresses([]);
      setSelectedAddressId(null);
      setError("");

      return;
    }

    let active = true;

    const loadAddresses = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getAddressesRequest();

        if (!active) {
          return;
        }

        const addressList = extractAddresses(response);

        setAddresses(addressList);
        selectPreferredAddress(addressList);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setAddresses([]);
        setSelectedAddressId(null);
        setError(getErrorMessage(requestError));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAddresses();

    return () => {
      active = false;
    };
  }, [authLoading, user?._id, selectPreferredAddress]);

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  const addAddress = async (addressData) => {
    setSaving(true);
    setError("");

    try {
      const response = await createAddressRequest(addressData);

      const newAddress = extractAddress(response);

      if (!newAddress) {
        await refreshAddresses();
        return response;
      }

      setAddresses((currentAddresses) => {
        let updatedAddresses = currentAddresses;

        if (newAddress.isDefault) {
          updatedAddresses = currentAddresses.map((address) => ({
            ...address,
            isDefault: false,
          }));
        }

        return [newAddress, ...updatedAddresses];
      });

      /*
       * Select the first or newly-default address.
       */
      if (newAddress.isDefault || addresses.length === 0) {
        setSelectedAddressId(newAddress._id);
      }

      return response;
    } catch (requestError) {
      setError(getErrorMessage(requestError));

      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  const editAddress = async (addressId, addressData) => {
    setSaving(true);
    setError("");

    try {
      const response = await updateAddressRequest(addressId, addressData);

      const updatedAddress = extractAddress(response);

      if (!updatedAddress) {
        await refreshAddresses();
        return response;
      }

      setAddresses((currentAddresses) =>
        currentAddresses.map((address) => {
          if (String(address._id) === String(updatedAddress._id)) {
            return updatedAddress;
          }

          if (updatedAddress.isDefault) {
            return {
              ...address,
              isDefault: false,
            };
          }

          return address;
        }),
      );

      return response;
    } catch (requestError) {
      setError(getErrorMessage(requestError));

      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const removeAddress = async (addressId) => {
    setSaving(true);
    setError("");

    try {
      const deletingSelectedAddress =
        String(selectedAddressId) === String(addressId);

      await deleteAddressRequest(addressId);

      /*
       * Refetch because the backend may automatically
       * make another address the default.
       */
      const updatedAddresses = await refreshAddresses();

      if (deletingSelectedAddress && updatedAddresses.length) {
        const defaultAddress = updatedAddresses.find(
          (address) => address.isDefault,
        );

        setSelectedAddressId(defaultAddress?._id || updatedAddresses[0]._id);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));

      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Set default
  |--------------------------------------------------------------------------
  */

  const makeDefaultAddress = async (addressId) => {
    setSaving(true);
    setError("");

    try {
      const response = await setDefaultAddressRequest(addressId);

      const defaultAddress = extractAddress(response);

      if (!defaultAddress) {
        await refreshAddresses();
        return response;
      }

      setAddresses((currentAddresses) =>
        currentAddresses
          .map((address) => ({
            ...address,
            isDefault: String(address._id) === String(defaultAddress._id),
          }))
          .sort(
            (firstAddress, secondAddress) =>
              Number(secondAddress.isDefault) - Number(firstAddress.isDefault),
          ),
      );

      setSelectedAddressId(defaultAddress._id);

      return response;
    } catch (requestError) {
      setError(getErrorMessage(requestError));

      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  const selectAddress = (addressId) => {
    const exists = addresses.some(
      (address) => String(address._id) === String(addressId),
    );

    if (exists) {
      setSelectedAddressId(addressId);
    }
  };

  const clearAddressError = () => {
    setError("");
  };

  const selectedAddress = useMemo(
    () =>
      addresses.find(
        (address) => String(address._id) === String(selectedAddressId),
      ) || null,
    [addresses, selectedAddressId],
  );

  const value = {
    addresses,
    selectedAddress,
    selectedAddressId,
    loading,
    saving,
    error,

    addAddress,
    editAddress,
    removeAddress,
    makeDefaultAddress,
    selectAddress,
    refreshAddresses,
    clearAddressError,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
}

export function useAddresses() {
  const context = useContext(AddressContext);

  if (!context) {
    throw new Error("useAddresses must be used inside AddressProvider");
  }

  return context;
}
