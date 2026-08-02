import AppError from "../utils/AppError.js";

const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "You are not authorized to access this resource",
        403
      );
    }

    next();
  };
};

export default authorize;