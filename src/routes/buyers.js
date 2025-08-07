const express = require("express");
const { verifyAuthToken } = require("../middleware/auth");
const {
  getAllBuyers,

  saveBuyerCreditDetails,
  getBuyerCreditData,
} = require("../controllers/buyers");
const buyersRoutes = express.Router();
buyersRoutes.get("/all-buyers", verifyAuthToken, getAllBuyers);
buyersRoutes.post(
  "/buyer-credit-amount",
  verifyAuthToken,
  saveBuyerCreditDetails
);
buyersRoutes.get("/buyer-credit-amount", verifyAuthToken, getBuyerCreditData);
module.exports = buyersRoutes;
