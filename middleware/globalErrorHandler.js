const mongoose = require("mongoose");
const teacherError = require("../errors/teachersError");
const studentError = require("../errors/studentErrors");
const classError = require("../errors/classesErrors");
const globalErrorHandler = (error, request, response, next) => {
  console.log(
    "\x1b[31m",
    "You have triggered the server's global error handler",
  );

  console.log(error.message);

  if (error.code === 11000) {
    console.log("Duplicate key error");
    if (error.message.includes("teachers")) {
      return teacherError(error, request, response);
    }
    if (error.message.includes("students")) {
      return studentError(error, request, response);
    }

    if (error.message.includes("classes")) {
      return classError(error, request, response);
    }
  }

  if (
    error instanceof mongoose.Error.ValidationError &&
    error._message === "teachers validation failed"
  ) {
    return teacherError(error, request, response);
  }

  if (
    error instanceof mongoose.Error.ValidationError &&
    error._message === "student validation failed"
  ) {
    return studentError(error, request, response);
  }

  if (
    error instanceof mongoose.Error.ValidationError &&
    error._message === "Classes validation failed"
  ) {
    return classError(error, request, response);
  }

  return response.status(error.statusCode || 500).json({
    message: "You have triggered the server's global error handler",
    error: error.message,
    status: "Error",
  });
};
module.exports = globalErrorHandler;
