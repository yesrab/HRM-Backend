const mongoose = require("mongoose");
const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      trim: true,
      unique: true,
      validate: [validateClassName, "Class with the same name already exists"],
    },
    // subject: {
    //   type: String,
    //   trim: true,
    //   required: [true, "please enter name of the subject"],
    // },
    classDetails: {
      type: {
        standard: {
          type: Number,
          required: [true, "Please enter a class number"],
          min: 1,
          max: 12,
        },
        section: {
          type: String,
          required: [true, "Please enter a section"],
          uppercase: true,
          maxLength: 1,
        },
      },
      required: [true, "please enter a class number and section"],
    },
    studentMemberFee: {
      type: Number,
      required: [
        true,
        "Please enter an required fee for this class memebership",
      ],
    },
    classTeacher: {
      type: {
        name: {
          type: String,
          trim: true,
        },
        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "teacher",
        },
      },
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
  { timestamps: true }
);

classSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error("End date must be greater than start date"));
  }
  next();
});

classSchema.pre("save", function (next) {
  const classDetails = this.classDetails;
  this.className = `${classDetails.standard} ${classDetails.section}`;
  next();
});

classSchema.pre("save", function (next) {
  const numStudents = this.students.length;
  if (numStudents > this.classCapacity) {
    return next(new Error("The number of students exceeds the class capacity"));
  }
  next();
});

const Classes = mongoose.model("Classes", classSchema);

async function validateClassName(value) {
  const classExists = await Classes.findOne({ className: value });
  if (classExists) throw new Error("Class with the same name already exists");
}

module.exports = Classes;

