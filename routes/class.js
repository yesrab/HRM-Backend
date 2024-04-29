const express = require("express");
const router = express.Router();
const { test, addAllClasses, addClass } = require("../controller/class");

router.route("/test").get(test);
router.route("/addAllClasses").post(addAllClasses);
router.route("/addClass").post(addClass);

module.exports = router;
