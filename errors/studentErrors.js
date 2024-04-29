const mongoose = require("mongoose");

const studentError = (error, request, response) => {
  const errorObject = {
    fullName: "",
    gender: "",
    DOB: "",
    emailId: "",
    mobileNumber: "",
    homeAddress: "",
    guardians: [],
    totalFeePaid: "",
    enrolledClass: "",
    enrollmentStatus: "",
    subject: "",
  };
  let message = "Validation error!";

  if (error.code === 11000) {
    const duplicateKey = Object.keys(error.keyPattern);
    for (let key of duplicateKey) {
      if (key.startsWith("guardians.")) {
        const guardianIndex = key.split(".")[1];
        const guardianField = key.split(".")[2];
        if (!errorObject.guardians[guardianIndex]) {
          errorObject.guardians[guardianIndex] = {};
        }
        errorObject.guardians[guardianIndex][guardianField] =
          `Duplicate key error for ${key}: ${error.keyValue[key]}`;
      } else {
        errorObject[key] =
          `Duplicate key error for ${key}: ${error.keyValue[key]}`;
      }
    }
    return response.status(422).json({
      error: errorObject,
      status: "Error",
      message: "Duplicate key error!",
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const validationErrors = error.errors;
    for (let key in validationErrors) {
      const path = key.split(".");
      let target = errorObject;
      for (let i = 0; i < path.length - 1; i++) {
        if (!target[path[i]]) {
          target[path[i]] = {};
        }
        target = target[path[i]];
      }
      target[path[path.length - 1]] = validationErrors[key].message;
    }
    return response.status(422).json({
      error: errorObject,
      status: "Error",
      message: message,
    });
  }
};

module.exports = studentError;
