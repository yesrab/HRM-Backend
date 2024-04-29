const students = require("../model/studentSchema");
const classes = require("../model/classSchema.js");
const test = (req, res) => {
  res.json({ lol: "lol" });
};

const addStudent = async (req, res) => {
  const {
    fullName,
    gender,
    DOB,
    emailId,
    mobileNumber,
    homeAddress,
    guardians,
    totalFeePaid,
    enrolledClass,
    enrollmentStatus,
  } = req.body;

  guardians.forEach((guardian) => {
    console.log(guardian);
    if (guardian.isParent === "on") {
      guardian.isParent = true;
    } else if (guardian.isParent === "no") {
      guardian.isParent = false;
    }
  });
  // console.log(req.body);

  const data = await students.create({
    fullName,
    gender,
    DOB,
    emailId,
    mobileNumber,
    homeAddress,
    guardians,
    totalFeePaid,
    enrolledClass,
    enrollmentStatus,
  });

  res.status(201).json({ data, success: "Student added" });
};

const addAllStudents = async (req, res) => {
  const studentArr = req.body;
  await students.deleteMany({});
  const results = [];
  for (let student of studentArr) {
    const data = await students.create(student);
    results.push(data);
  }
  res.status(201).json({ results });
};

const countDocs = require("../libs/countDocs.js");

const studentCount = async (req, res) => {
  const numberOfStudents = await countDocs(students);
  res.status(200).json({ count: numberOfStudents });
};

const getStudents = async (req, res) => {
  const allStudents = await students.find(
    {},
    { guardians: 0, homeAddress: 0, emailId: 0, mobileNumber: 0 }
  );
  const studentData = JSON.parse(JSON.stringify(allStudents));
  for (let data of studentData) {
    if (data.enrolledClass) {
      data.enrolledClass = "none";
    } else {
      data.enrolledClass = "none";
    }
    console.log(data);
  }
  res.status(200).json({ studentData });
};

module.exports = {
  test,
  addAllStudents,
  addStudent,
  studentCount,
  getStudents,
};
