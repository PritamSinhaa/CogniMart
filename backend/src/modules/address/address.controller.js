import {
  createAddressService,
  getAddressesService,
  getAddressByIdService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
} from "./address.service.js";

export const createAddress = async (req, res) => {
  const address = await createAddressService(
    req.user._id,
    req.body
  );

  return res.status(201).json({
    success: true,
    message: "Address created successfully",
    data: {
      address,
    },
  });
};

export const getAddresses = async (req, res) => {
  const addresses = await getAddressesService(
    req.user._id
  );

  return res.status(200).json({
    success: true,
    data: {
      addresses,
    },
  });
};

export const getAddressById = async (req, res) => {
  const address = await getAddressByIdService(
    req.user._id,
    req.params.id
  );

  return res.status(200).json({
    success: true,
    data: {
      address,
    },
  });
};

export const updateAddress = async (req, res) => {
  const address = await updateAddressService(
    req.user._id,
    req.params.id,
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: {
      address,
    },
  });
};

export const deleteAddress = async (req, res) => {
  await deleteAddressService(
    req.user._id,
    req.params.id
  );

  return res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
};

export const setDefaultAddress = async (req, res) => {
  const address = await setDefaultAddressService(
    req.user._id,
    req.params.id
  );

  return res.status(200).json({
    success: true,
    message: "Default address updated successfully",
    data: {
      address,
    },
  });
};
