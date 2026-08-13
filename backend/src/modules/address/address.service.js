import Address from "../../models/Address.model.js";
import AppError from "../../utils/AppError.js";

// Create address
export const createAddressService = async (userId, addressData) => {
  const { isDefault = false } = addressData;

  // If this is the first address, automatically make it default
  const addressCount = await Address.countDocuments({
    user: userId,
  });

  const shouldBeDefault = addressCount === 0 || isDefault;

  // If making this address default,
  // remove default status from all other addresses
  if (shouldBeDefault) {
    await Address.updateMany(
      { user: userId },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    ...addressData,
    user: userId,
    isDefault: shouldBeDefault,
  });

  return address;
};

// Get all addresses
export const getAddressesService = async (userId) => {
  const addresses = await Address.find({
    user: userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return addresses;
};

// Get one address
export const getAddressByIdService = async (
  userId,
  addressId
) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  return address;
};

// Update address
export const updateAddressService = async (
  userId,
  addressId,
  addressData
) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  if (addressData.isDefault === true) {
    await Address.updateMany(
      {
        user: userId,
        _id: { $ne: addressId },
      },
      {
        isDefault: false,
      }
    );
  }

  Object.assign(address, addressData);

  await address.save();

  return address;
};

// Delete address
export const deleteAddressService = async (
  userId,
  addressId
) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  const wasDefault = address.isDefault;

  await address.deleteOne();

  // If the deleted address was default,
  // make another address default
  if (wasDefault) {
    const nextAddress = await Address.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  return true;
};

// Make address default
export const setDefaultAddressService = async (
  userId,
  addressId
) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  await Address.updateMany(
    {
      user: userId,
      _id: { $ne: addressId },
    },
    {
      isDefault: false,
    }
  );

  address.isDefault = true;

  await address.save();

  return address;
};