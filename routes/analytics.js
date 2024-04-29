const express = require("express");
const router = express.Router();

const {
  chipsData,
  totalGenderRatio,
  getEnrollmentStatus,
} = require("../controller/analytics");

router.route("/chipsData").get(chipsData);
router.route("/gender").get(totalGenderRatio);
router.route("/studentStatus").get(getEnrollmentStatus);

module.exports = router;
