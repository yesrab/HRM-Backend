const express = require("express");
const router = express.Router();
const {
  test,
  addAllStudents,
  addStudent,
  studentCount,
  getStudents,
} = require("../controller/students");
router.route("/test").get(test);
router.route("/addAllStudents").post(addAllStudents);
router.route("/addStudent").post(addStudent);
router.route("/studentCount").get(studentCount);
router.route("/allStudents").get(getStudents);
module.exports = router;
