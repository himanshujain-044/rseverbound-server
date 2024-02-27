const express = require("express");
const {
  login,
  logout,
  getUserBrokrageData,
  updateUserBrokrage,
  getPaidUserBrokrage,
  updatePaymentMethod,
} = require("../controllers/users");
const { verifyAuthToken } = require("../middleware/auth");
const {
  updatePaymentMethodSchemaVal,
} = require("../apiSchemaValidation/users");
const { validateBody } = require("../middleware/joi");
const { updateBrokrageSchemaVal } = require("../apiSchemaValidation/brokrage");
const usersRoutes = express.Router();
usersRoutes.post("/login", login);
usersRoutes.get("/logout", verifyAuthToken, logout);
usersRoutes.get("/get-user-brokrage", verifyAuthToken, getUserBrokrageData);
usersRoutes.patch(
  "/update-user-brokrage",
  verifyAuthToken,
  validateBody(updateBrokrageSchemaVal),
  updateUserBrokrage
);
usersRoutes.get("/paid-user-brokrage", verifyAuthToken, getPaidUserBrokrage);
usersRoutes.patch(
  "/update-payment-method",
  verifyAuthToken,
  validateBody(updatePaymentMethodSchemaVal),
  updatePaymentMethod
);
module.exports = usersRoutes;
