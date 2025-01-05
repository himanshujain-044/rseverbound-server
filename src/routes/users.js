const express = require("express");
const { login, logout } = require("../controllers/users");
const { verifyAuthToken } = require("../middleware/auth");
const { validateBody } = require("../middleware/joi");
const { userSchema } = require("../apiSchemaValidation/users");
const usersRoutes = express.Router();
usersRoutes.post("/login", validateBody(userSchema), login);
usersRoutes.get("/logout", verifyAuthToken, logout);

module.exports = usersRoutes;
