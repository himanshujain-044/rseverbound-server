const express = require("express");
const {
  getAllCustomers,
  getCustomersBrokerage,
} = require("../controllers/upstox");
const upstoxRoutes = express.Router();

upstoxRoutes.get("/get-all-customers", getAllCustomers);
upstoxRoutes.get("/get-customers-brokerage", getCustomersBrokerage);

module.exports = upstoxRoutes;
