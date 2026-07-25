export const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    status: "healthy",
    message: "CogniMart API is running",
    timestamp: new Date().toISOString(),
  });
};