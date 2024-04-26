const mongoose = require("mongoose");
const ClassSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, "Please enter a valid className"],
      trim: true,
    },
    classDetails: {
      type: {
        standard: {
          type: Number,
          required: [true, "Please enter a class number"],
        },
        section: {
          type: String,
          required: [true, "Please enter a section"],
          uppercase: true,
          maxLength: 1,
        },
      },
      required: [true, "please enter a class number and section"],
      unique: true,
    },
    studentMemberFee: {
      type: Number,
      required: [
        true,
        "Please enter an required fee for this class memebership",
      ],
    },
    classTeacher: {
      type: String,
    },
    classCapacity: {
      type: Number,
      required: [true, "set an maximum number of students per class"],
      default: 40,
    },
    duration: {
      type: String,
      required: [true, "Please enter a duration"],
    },
    frequency: {
      type: String,
      required: [true, "Please select the frequency of the class"],
      enum: {
        values: ["daily", "weekly", "bi-weekly"],
        message: "{value} is not an valid class frequency",
      },
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: [true, "Please enter the start date of the class"],
    },
    endDate: {
      type: Date,
      required: [true, "Please enter the end date of the class"],
    },
    students: {
      type: [
        {
          studentName: {
            type: String,
            required: [true, "Please enter a student Name"],
          },
          studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
          },
        },
      ],
    },
  },
  { timestamps: true },
);

ClassSchema.pre("save", function (next) {
  const classDetails = this.classDetails;
  this.className = `${classDetails.standard} ${classDetails.section}`;
  next();
});

ClassSchema.pre("save", function (next) {
  const numStudents = this.students.length;
  if (numStudents > this.classCapacity) {
    return next(new Error("The number of students exceeds the class capacity"));
  }
  next();
});

const classes = mongoose.model("classes", ClassSchema);
module.exports = classes;
