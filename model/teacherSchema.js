const mongoose = require("mongoose");
const { isEmail, isMobilePhone } = require("validator");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: {
        f_name: {
          type: String,
          required: [true, "Please enter Teacher First Name"],
          trim: true,
        },
        m_name: {
          type: String,
          trim: true,
        },
        l_name: {
          type: String,
          required: [true, "Please enter Teacher Last Name"],
          trim: true,
        },
      },
    },
    fullName: {
      type: String,
      required: [true, "Please enter Teacher Last Name"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Please select a gender"],
      enum: {
        values: ["Male", "Female", "OTHERS"],
        message: "{value} is not an valid Gender option",
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
      },
      required: [true, "Please enter KYC details"],
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
  { timestamps: true },
);
teacherSchema.pre("save", function (next) {
  const teacherNameObj = this.name;
  this.fullName = `${teacherNameObj.f_name} ${teacherNameObj.m_name} ${teacherNameObj.l_name}`;
  next();
});
