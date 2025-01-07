const express = require("express");
const { verifyAuthToken } = require("../middleware/auth");
const { getAllBuyers } = require("../controllers/buyers");
// const { validateBody } = require("../middleware/joi");
// const { userSchema } = require("../apiSchemaValidation/users");
const buyersRoutes = express.Router();
buyersRoutes.get("/all-buyers", verifyAuthToken, getAllBuyers);

module.exports = buyersRoutes;
