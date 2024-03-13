const express = require("express");
const {
  getAllCustomers,
  getCustomersBrokerage,
  sendOpenDematAccMail,
} = require("../controllers/upstox");
const upstoxRoutes = express.Router();

upstoxRoutes.get("/get-all-customers", getAllCustomers);
upstoxRoutes.get("/get-customers-brokerage", getCustomersBrokerage);
upstoxRoutes.post("/send-open-demat-mail", sendOpenDematAccMail);

module.exports = upstoxRoutes;
