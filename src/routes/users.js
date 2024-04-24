const express = require("express");
const {
  login,
  logout,
  getUserBrokerageData,
  updateUserBrokerage,
  getPaidUserBrokerage,
  updatePaymentMethod,
  userData,
} = require("../controllers/users");
const { verifyAuthToken } = require("../middleware/auth");
const {
  updatePaymentMethodSchemaVal,
} = require("../apiSchemaValidation/users");
const { validateBody } = require("../middleware/joi");
const {
  updateBrokerageSchemaVal,
} = require("../apiSchemaValidation/brokerage");
const usersRoutes = express.Router();
usersRoutes.post("/login", login);
usersRoutes.get("/logout", verifyAuthToken, logout);
usersRoutes.get("/get-user-brokerage", verifyAuthToken, getUserBrokerageData);
usersRoutes.patch(
  "/update-user-brokerage",
  verifyAuthToken,
  validateBody(updateBrokerageSchemaVal),
  updateUserBrokerage
);
usersRoutes.get("/paid-user-brokerage", verifyAuthToken, getPaidUserBrokerage);
usersRoutes.patch(
  "/update-payment-method",
  verifyAuthToken,
  validateBody(updatePaymentMethodSchemaVal),
  updatePaymentMethod
);
usersRoutes.post("/userData", userData);

module.exports = usersRoutes;
