import User from "../../models/User.model.js";
import AppError from "../../utils/AppError.js";

export const registerService = async ({ name, email, password }) => {
  // Step 1: Check if email already exists
  const existingUser = await User.findOne({email});

  if(existingUser){
    throw new AppError("Email already exist", 409)
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