const mongoose = require("mongoose");

const teacherError = (error, request, response) => {
  const errorObject = {
    gender: "",
    DOB: "",
    emailId: "",
    mobileNumber: "",
    homeAddress: "",
    salary: "",
    KYC_Details: {
      bankName: "",
      bankAccountNumber: "",
      bankIFSC: "",
      bankBranch: "",
      PAN: "",
    },
    assignedClasses: [],
    teacherType: "",
  };
  let message = "Validation error!";

  if (error.code === 11000) {
    const duplicateKey = Object.keys(error.keyPattern);
    for (let key of duplicateKey) {
      errorObject[key] = `This ${key} already exists!`;
    }
    return response.status(422).json({
      error: errorObject,
      status: "Error",
      message: "this data already exists!",
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

module.exports = teacherError;

