const express = require("express");
const { verifyAuthToken } = require("../middleware/auth");
const { getAllVehicles } = require("../controllers/vehicles");
// const { validateBody } = require("../middleware/joi");
// const { userSchema } = require("../apiSchemaValidation/users");
const vehiclesRoutes = express.Router();
vehiclesRoutes.get("/all-vehicles", verifyAuthToken, getAllVehicles);

module.exports = vehiclesRoutes;
