const mongoose = require("mongoose");
const { isEmail, isMobilePhone } = require("validator");
const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Please enter student full Name"],
    },
    gender: {
      type: String,
      required: [true, "Please select a gender"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "{value} is not an valid Gender option",
      },
    },
    DOB: {
      type: Date,
      required: [true, "Please enter date of birth of the student"],
    },
    emailId: {
      type: String,
      required: [true, "Please add student email"],
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
    guardians: {
      type: [
        {
          guardianName: {
            type: String,
            required: [true, "Please enter guardian Name"],
            trim: true,
          },
          guardianMobileNumber: {
            type: String,
            required: [true, "Please enter mobile number"],
            validate: [isMobilePhone, "Please add a valid number"],
          },
          guardianEmailId: {
            type: String,
            required: [true, "Please add guardian email"],
            validate: [isEmail, "Please add a valid email"],
            lowercase: true,
          },
          isParent: {
            type: Boolean,
            default: false,
          },
          guardianHomeAddress: {
            type: String,
            required: [true, "Please enter guardian home address"],
          },
        },
      ],
      required: [true, "Please add at least one guardian"],
    },
    totalFeePaid: {
      type: Number,
      required: [true, "Please enter total fee paid"],
      default: 0,
    },
    enrolledClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
    },
    enrollmentStatus: {
      type: String,
      required: [true, "Please select enrollment status"],
      enum: {
        values: [
          "Active",
          "Suspended",
          "Expired",
          "Inactive",
          "Pending Approval",
          "Graduated",
          "Withdrawn",
          "On Leave",
          "Probation",
          "Dismissed",
        ],
        message: "{value} is not an valid Enrollment Status",
      },
    },
  },
  { timestamps: true }
);

studentSchema.pre("validate", function (next) {
  this.guardians.forEach((guardian) => {
    console.log(guardian);
    if (guardian.isParent === "on") {
      guardian.isParent = true;
    } else if (guardian.isParent === "no") {
      guardian.isParent = false;
    }
  });
  next();
});

studentSchema.pre("save", function (next) {
  const guardians = this.guardians;
  const numParents = guardians.filter((guardian) => guardian.isParent).length;
  if (numParents > 2) {
    return next(new Error("Only two guardians can be marked as parents."));
  }
  next();
});
const student = mongoose.model("student", studentSchema);
module.exports = student;

