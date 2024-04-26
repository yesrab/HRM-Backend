const mongoose = require("mongoose");
const { isEmail, isMobilePhone } = require("validator");
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: {
        f_name: {
          type: String,
          required: [true, "Please enter student First Name"],
          trim: true,
        },
        m_name: {
          type: String,
          trim: true,
        },
        l_name: {
          type: String,
          required: [true, "Please enter student Last Name"],
          trim: true,
        },
      },
    },
    fullName: {
      type: String,
      required: [true, "Please enter student full Name"],
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
          name: {
            type: String,
            required: [true, "Please enter guardian Name"],
            trim: true,
          },
          mobileNumber: {
            type: String,
            required: [true, "Please enter mobile number"],
            unique: true,
            validate: [isMobilePhone, "Please add a valid number"],
          },
          emailId: {
            type: String,
            required: [true, "Please add guardian email"],
            unique: true,
            lowercase: true,
            validate: [isEmail, "Please add a valid email"],
          },
          isParent: {
            type: Boolean,
            default: false,
          },
          homeAddress: {
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
  { timestamps: true },
);
studentSchema.pre("save", function (next) {
  const studentNameObj = this.name;
  this.fullName = `${studentNameObj.f_name} ${studentNameObj.m_name} ${studentNameObj.l_name}`;
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
