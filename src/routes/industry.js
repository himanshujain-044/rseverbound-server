const express = require("express");
const { verifyAuthToken } = require("../middleware/auth");
const { getIndustryPerfReport } = require("../controllers/industry");
const industryRoutes = express.Router();
industryRoutes.get(
  "/industry-perf-report",
  verifyAuthToken,
  getIndustryPerfReport
);

module.exports = industryRoutes;
