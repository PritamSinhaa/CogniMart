import generateToken from "./generateToken.js";

export function getAuthCookieOptions() {
  const isProduction =
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 1000,
  };
}

const sendToken = (user, statusCode, res, message) => {
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  res.cookie(
    "accessToken",
    token,
    getAuthCookieOptions(),
  );

  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      user,
    },
  });
};

export default sendToken;