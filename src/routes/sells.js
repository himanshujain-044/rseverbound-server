const express = require("express");
const { verifyAuthToken } = require("../middleware/auth");
const {
  saveInvoiceDetails,
  getSellsData,
  getSpecificSellData,
  getSellsReports,
} = require("../controllers/sells");
// const { validateBody } = require("../middleware/joi");
// const { userSchema } = require("../apiSchemaValidation/users");
const sellsRoutes = express.Router();
sellsRoutes.post("/save-invoice-details", verifyAuthToken, saveInvoiceDetails);
sellsRoutes.get("/sells-history", verifyAuthToken, getSellsData);
sellsRoutes.get("/sell-data", verifyAuthToken, getSpecificSellData);
sellsRoutes.get("/sells-reports", verifyAuthToken, getSellsReports);
module.exports = sellsRoutes;
