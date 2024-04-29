const countDocs = require("../libs/countDocs");
const Classes = require("../model/classSchema");
const teachers = require("../model/teacherSchema");
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

const classCount = async (req, res) => {
  const count = await countDocs(Classes);
  res.status(200).json({ count });
};

const allClasses = async (req, res) => {
  const classes = await Classes.find({});
  const allTeachers = await teachers.find(
    {},
    {
      gender: 0,
      DOB: 0,
      emailId: 0,
      mobileNumber: 0,
      homeAddress: 0,
      salary: 0,
      KYC_Details: 0,
      assignedClasses: 0,
      teacherType: 0,
    }
  );
  res.status(200).json({ classes, allTeachers });
};

const assignTeacher = async (req, res) => {
  const { classId, teacherId } = req.body;
  console.log(classId, teacherId);
  if (req.method === "PATCH") {
    try {
      const classInfo = await Classes.findById(classId);
      const teacherInfo = await teachers.findById(teacherId);
      const updatedClass = await Classes.findByIdAndUpdate(
        classId,
        {
          $set: {
            "classTeacher.teacherId": teacherId,
            "classTeacher.name": teacherInfo.fullName,
          },
        },
        { new: true }
      );

      const updatedTeacher = await teachers.findByIdAndUpdate(
        teacherId,
        {
          $push: {
            assignedClasses: {
              classId: classId,
              className: classInfo.className,
            },
          },
        },
        { new: true }
      );
      res.status(200).json({ updatedClass, updatedTeacher });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const classInfo = await Classes.findById(classId);
      const teacherIdFromClass = classInfo.classTeacher.teacherId;
      const updatedClass = await Classes.findByIdAndUpdate(
        classId,
        { $set: { "classTeacher.teacherId": null, "classTeacher.name": null } },
        { new: true }
      );
      const updatedTeacher = await teachers.findByIdAndUpdate(
        teacherIdFromClass,
        { $pull: { assignedClasses: { classId: classId } } },
        { new: true }
      );

      res.status(200).json({ updatedClass, updatedTeacher });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

module.exports = {
  test,
  addAllClasses,
  addClass,
  classCount,
  allClasses,
  assignTeacher,
};
