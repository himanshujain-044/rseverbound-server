const express = require("express");
const { verifyAuthToken } = require("../middleware/auth");
const { getAllProducts } = require("../controllers/products");
// const { validateBody } = require("../middleware/joi");
// const { userSchema } = require("../apiSchemaValidation/users");
const productsRoutes = express.Router();
productsRoutes.get("/all-products", verifyAuthToken, getAllProducts);

module.exports = productsRoutes;
