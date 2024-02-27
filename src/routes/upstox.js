const express = require("express");
const {
  getAllCustomers,
  getCustomersBrokrage,
} = require("../controllers/upstox");
const upstoxRoutes = express.Router();

upstoxRoutes.get("/get-all-customers", getAllCustomers);
upstoxRoutes.get("/get-customers-brokrage", getCustomersBrokrage);

module.exports = upstoxRoutes;
