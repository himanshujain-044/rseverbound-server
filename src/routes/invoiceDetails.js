const express = require("express");
const { invoiceDetails } = require("../controllers/invoiceDetails");
const { verifyAuthToken } = require("../middleware/auth");
// const { validateBody } = require("../middleware/joi");
// const { userSchema } = require("../apiSchemaValidation/users");
const invoiceDetailsRoutes = express.Router();
invoiceDetailsRoutes.get(
  "/invoice-details",
  verifyAuthToken,
  invoiceDetails
);

module.exports = invoiceDetailsRoutes;
