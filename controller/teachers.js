const countDocs = require("../libs/countDocs");
const Teachers = require("../model/teacherSchema");
const test = (req, res) => {
  res.json({ lol: "lol" });
};

const addTeacher = async (request, response) => {
  const {
    fullName,
    gender,
    DOB,
    emailId,
    mobileNumber,
    homeAddress,
    salary,
    KYC_Details,
    teacherType,
  } = request.body;

  const addedTeacher = await Teachers.create({
    fullName,
    gender,
    DOB,
    emailId,
    mobileNumber,
    homeAddress,
    salary,
    KYC_Details,
    teacherType,
  });
  response.status(201).json({
    addedTeacher,
    success: "Teacher added",
  });
};

const addAllTeachers = async (request, response) => {
  const teachersArr = request.body;
  await Teachers.deleteMany();
  const inseartedData = [];
  for (let teacher of teachersArr) {
    const savedData = await Teachers.create(teacher);
    inseartedData.push(savedData);
  }
  response.json({ inseartedData });
};

const findByKYC = async (request, response) => {
  const { KYC_Details } = request.body;
  const { bankName, bankAccountNumber, bankIFSC, bankBranch, PAN } =
    KYC_Details;

  const retrivedData = await Teachers.findOne({
    "KYC_Details.PAN": PAN,
  });
  response.json({
    retrivedData,
  });
};

const teacherCount = async (req, res) => {
  const numberOfTeachers = await countDocs(Teachers);
  res.status(200).json({ count: numberOfTeachers });
};

const allTeachers = async (req, res) => {
  const teachers = await Teachers.find(
    {},
    {
      KYC_Details: 0,
      emailId: 0,
      mobileNumber: 0,
      homeAddress: 0,
    }
  );
  res.status(200).json(teachers);
};

module.exports = {
  test,
  addTeacher,
  addAllTeachers,
  findByKYC,
  teacherCount,
  allTeachers,
};

