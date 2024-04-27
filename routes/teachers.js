const express = require("express");
const router = express.Router();

const { test, addTeacher } = require("../controller/teachers");

router.route("/test").get(test);
router.route("/addTeacher").post(addTeacher);

module.exports = router;
