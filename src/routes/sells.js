const express = require("express");
const { verifyAuthToken } = require("../middleware/auth");
const {
  saveInvoiceDetails,
  getSellsData,
  getSpecificSellData,
  getSellsReports,
  updateInvoice,
  getBuyerSellData,
} = require("../controllers/sells");
const sellsRoutes = express.Router();
sellsRoutes.post("/save-invoice-details", verifyAuthToken, saveInvoiceDetails);
sellsRoutes.get("/sells-history", verifyAuthToken, getSellsData);
sellsRoutes.get("/sell-data", verifyAuthToken, getSpecificSellData);
sellsRoutes.get("/sells-reports", verifyAuthToken, getSellsReports);
sellsRoutes.patch("/update-invoice", verifyAuthToken, updateInvoice);
sellsRoutes.get("/buyer-sell-data", verifyAuthToken, getBuyerSellData);
module.exports = sellsRoutes;
