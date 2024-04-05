const express = require("express");
const {
  getAllCustomers,
  getCustomersBrokerage,
  sendOpenDematAccMail,
  getAllSavedUsers,
} = require("../controllers/upstox");
const upstoxRoutes = express.Router();

upstoxRoutes.get("/get-all-customers", getAllCustomers);
upstoxRoutes.get("/get-customers-brokerage", getCustomersBrokerage);
upstoxRoutes.post("/send-open-demat-mail", sendOpenDematAccMail);
upstoxRoutes.get("/all-saved-random-users", getAllSavedUsers)

module.exports = upstoxRoutes;
