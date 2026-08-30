import generateToken from "./generateToken.js";

const sendToken = (user, statusCode, res, message) => {
  // Generate JWT
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  // Set HttpOnly Cookie
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 15 minutes
  });

  // Send Response
  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      user,
    },
  });
};

export default sendToken;