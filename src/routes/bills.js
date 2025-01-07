const express = require("express");
const { billNumber } = require("../controllers/bills");
const { verifyAuthToken } = require("../middleware/auth");
// const { validateBody } = require("../middleware/joi");
// const { userSchema } = require("../apiSchemaValidation/users");
const billsRoutes = express.Router();
billsRoutes.get("/bill-number", verifyAuthToken, billNumber);

module.exports = billsRoutes;
