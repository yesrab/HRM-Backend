const express = require("express");
const router = express.Router();
const {
  test,
  addAllClasses,
  addClass,
  classCount,
  allClasses,
  assignTeacher,
} = require("../controller/class");

router.route("/test").get(test);
router.route("/addAllClasses").post(addAllClasses);
router.route("/addClass").post(addClass);
router.route("/allClass").get(allClasses);
router.route("/count").get(classCount);
router.route("/setTeacher").patch(assignTeacher).delete(assignTeacher);

module.exports = router;
