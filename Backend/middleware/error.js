const errorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resouse not found. Invalid ${err.path}`;
    err = new errorHandler(message, 400);
  }

  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `User Already Exist With Given ${Object.keys(
      err.keyValue
    )}`;
    err = new errorHandler(message, 400);
  }

  //wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid Json Web Token, Try Again`;
    err = new errorHandler(message, 400);
  }

  //JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = `Expired Json Web Token, Try Again`;
    err = new errorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
