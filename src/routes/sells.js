const express = require("express");
const { verifyAuthToken } = require("../middleware/auth");
const { saveInvoiceDetails } = require("../controllers/sells");
// const { validateBody } = require("../middleware/joi");
// const { userSchema } = require("../apiSchemaValidation/users");
const sellsRoutes = express.Router();
sellsRoutes.post("/save-invoice-details", verifyAuthToken, saveInvoiceDetails);

module.exports = sellsRoutes;
