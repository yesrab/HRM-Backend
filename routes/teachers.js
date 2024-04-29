const express = require("express");
const router = express.Router();

const {
  test,
  addTeacher,
  addAllTeachers,
  findByKYC,
  teacherCount,
  allTeachers,
} = require("../controller/teachers");

router.route("/test").get(test).post(findByKYC);
router.route("/addTeacher").post(addTeacher);
router.route("/addAllTeachers").post(addAllTeachers);
router.route("/count").get(teacherCount);
router.route("/allTeachers").get(allTeachers);
module.exports = router;

