const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies || req.headers.authorization?.split(" ")[1];;

  if (!token) {
    return next(new ErrorHandler("Please LogIn to for following resorce", 401));
  }
  try {
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      return next(new ErrorHandler("JWT_SECRET is missing in environment variables", 500));
  }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
} catch (error) {
    return next(new ErrorHandler("Invalid token, please log in again", 401));
}
});

// to check Athorized admin
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resorce`,
          403
        )
      );
    }
    next();
  };
};
