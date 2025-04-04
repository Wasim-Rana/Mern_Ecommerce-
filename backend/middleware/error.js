const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  console.log("Error Middleware Triggered:", err); 
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  // wrong MongoDB Id error
  if (err.name === "CastError") {
    const message = `resurce not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  // wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token in invalid, try again`;
    err = new ErrorHandler(message, 400);
  }
  // JWT Expired error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is Expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
