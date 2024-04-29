const mongoose = require("mongoose");

const classError = (error, request, response) => {
  const errorObject = {
    className: "",
    classDetails: {
      standard: "",
      section: "",
    },
    studentMemberFee: "",
    classTeacher: {
      name: "",
      teacherId: "",
    },
    classCapacity: "",
    duration: "",
    frequency: "",
    startDate: "",
    endDate: "",
    students: [],
  };
  let message = "Validation error!";

  if (error.code === 11000) {
    const duplicateKey = Object.keys(error.keyPattern);
    for (let key of duplicateKey) {
      errorObject[key] =
        `Duplicate key error for ${key}: ${error.keyValue[key]}`;
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
      errorObject[key] = validationErrors[key].message;
    }
    return response.status(422).json({
      error: errorObject,
      status: "Error",
      message: message,
    });
  }
};

module.exports = classError;
