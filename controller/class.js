const Classes = require("../model/classSchema");
const test = (req, res) => {
  res.json({ message: "class route hit" });
};
const addAllClasses = async (req, res) => {
  const classArray = req.body;
  // console.log(classArray);
  await Classes.deleteMany({});
  const result = [];
  for (let classesObj of classArray) {
    // console.log(classesObj);

    const data = await Classes.create(classesObj);
    result.push(data);
  }
  res.status(201).json({ result });
};

const addClass = async (req, res) => {
  const {
    classDetails,
    studentMemberFee,
    classTeacher,
    classCapacity,
    duration,
    frequency,
    startDate,
    endDate,
  } = req.body;
  const createdClass = await Classes.create({
    classDetails,
    studentMemberFee,
    classTeacher,
    classCapacity,
    duration,
    frequency,
    startDate,
    endDate,
  });
  res.status(201).json(createdClass);
};

module.exports = { test, addAllClasses, addClass };
