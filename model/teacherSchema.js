const mongoose = require("mongoose");
const { isEmail, isMobilePhone } = require("validator");

const teacherSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter Teacher Full Name"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Please select a gender"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "{value} is not an valid gender option",
      },
    },
    DOB: {
      type: Date,
      required: [true, "Please enter date of birth of the Teacher"],
    },
    emailId: {
      type: String,
      required: [true, "Please add Teacher email id"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please add a valid email"],
    },

    mobileNumber: {
      type: String,
      required: [true, "Please enter mobile number"],
      unique: true,
      validate: [isMobilePhone, "Please add a valid number"],
    },
    homeAddress: {
      type: String,
      required: [true, "Please enter home address"],
    },
    salary: {
      type: Number,
      required: [true, "Please enter salary of the Teacher"],
      default: 0,
    },
    KYC_Details: {
      type: {
        bankName: {
          type: String,
          required: [true, "Please enter account details name"],
        },
        bankAccountNumber: {
          type: String,
          required: [true, "Please enter account number"],
        },
        bankIFSC: {
          type: String,
          required: [true, "Please enter bank IFSC"],
        },
        bankBranch: {
          type: String,
          required: [true, "Please enter bank branch"],
        },
        PAN: {
          type: String,
          required: [true, "Please enter PAN number"],
          maxLength: 10,
          minLength: 10,
        },
      },
      required: [true, "Please enter KYC details"],
      validate: [validateKYCDetails, "KYC details must be unique"],
      unique: true,
    },
    assignedClasses: {
      type: [
        {
          className: {
            type: String,
            required: [true, "Please enter assigned class name"],
          },
          classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "classes",
          },
        },
      ],
      default: [],
    },
    teacherType: {
      type: String,
      enum: {
        values: ["Regular", "Substitute", "Other"],
        message: "{value} is not an valid teacher type",
      },
      default: "Regular",
    },
  },
  { timestamps: true }
);

const Teachers = mongoose.model("teachers", teacherSchema);

async function validateKYCDetails(value) {
  const { PAN, bankBranch, bankIFSC, bankAccountNumber, bankName } = value;
  const existingTeacher = await Teachers.findOne({
    "KYC_Details.PAN": PAN,
    "KYC_Details.bankBranch": bankBranch,
    "KYC_Details.bankIFSC": bankIFSC,
    "KYC_Details.bankAccountNumber": bankAccountNumber,
    "KYC_Details.bankName": bankName,
  });
  return !existingTeacher;
}

module.exports = Teachers;

