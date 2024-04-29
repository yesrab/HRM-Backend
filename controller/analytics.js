const studentModel = require("../model/studentSchema");
const classModel = require("../model/classSchema");
const teacherModel = require("../model/teacherSchema");

const expens = [
  {
    $group: {
      _id: null,
      expenses: {
        $sum: "$salary",
      },
    },
  },
  {
    $project: {
      _id: 0,
      expenses: 1,
    },
  },
];

const totalFeesPipeLine = [
  {
    $group: {
      _id: null,
      totalFees: {
        $sum: "$studentMemberFee",
      },
    },
  },
];

const teacherGenderPipeline = [
  {
    $group: {
      _id: "$gender",
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      gender: "$_id",
      count: 1,
    },
  },
];

const studentEnrollmentStatusPipeline = [
  {
    $group: {
      _id: "$enrollmentStatus",
      count: {
        $sum: 1,
      },
    },
  },
];

const chipsData = async (req, res) => {
  const studentCount = await studentModel.countDocuments();
  const teacherCount = await teacherModel.countDocuments();
  const classCount = await classModel.countDocuments();
  const totalFee = await classModel.aggregate(totalFeesPipeLine);
  const totalSalary = await teacherModel.aggregate(expens);
  const [{ totalFees }] = totalFee;
  const [{ expenses }] = totalSalary;
  res
    .status(200)
    .json({ studentCount, teacherCount, classCount, totalFees, expenses });
};

const totalGenderRatio = async (req, res) => {
  const teacherGender = await teacherModel.aggregate(teacherGenderPipeline);
  const studentGender = await studentModel.aggregate(teacherGenderPipeline);
  const genderObj = {
    Other: 0,
    Male: 0,
    Female: 0,
  };
  for (let genderBox of teacherGender) {
    genderObj[genderBox.gender] += genderBox.count;
  }
  for (let genderBox of studentGender) {
    genderObj[genderBox.gender] += genderBox.count;
  }

  const genderArray = Object.keys(genderObj).map((key) => ({
    label: key,
    value: genderObj[key],
  }));

  res.status(200).json({ genderObj, genderArray });
};

const getEnrollmentStatus = async (req, res) => {
  const enrollmentData = await studentModel.aggregate(
    studentEnrollmentStatusPipeline
  );
  const status = {
    "Active": 0,
    "Suspended": 0,
    "Expired": 0,
    "Inactive": 0,
    "Pending Approval": 0,
    "Graduated": 0,
    "Withdrawn": 0,
    "On Leave": 0,
    "Probation": 0,
    "Dismissed": 0,
  };
  for (data of enrollmentData) {
    status[data._id] = data.count;
  }

  const statusArray = Object.keys(status).map((key) => ({
    label: key,
    value: status[key],
  }));

  res.json({ status, statusArray });
};

module.exports = { chipsData, totalGenderRatio, getEnrollmentStatus };
