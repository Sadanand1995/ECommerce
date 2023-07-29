const errorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const Users = require("../model/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new errorHandler("Please login to access this resouce", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await Users.findById(decodedData.id);
  next();
});

exports.userRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorHandler(
          `Access denied! Role: ${req.user.role} is not authorised to access this resouce`,
          403
        )
      );
    }
    next();
  };
};
