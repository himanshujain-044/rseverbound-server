const express = require("express");
const ErrorClass = require("./src/utility/error");
const usersRoutes = require("./src/routes/users");
const billsRoutes = require("./src/routes/bills");
const buyersRoutes = require("./src/routes/buyers");
const vehiclesRoutes = require("./src/routes/vehicles");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/bills", billsRoutes);
app.use("/api/buyers", buyersRoutes);
app.use("/api/vehicles", vehiclesRoutes);
// Define a route handler
app.get("/api", (req, res) => {
  res.send("Welcome to Madhuvan Minerals backend server!!!");
});

// Handling all other routes with a 404 error
app.all("*", (req, res, next) => {
  next(new ErrorClass(`Requested URL ${req.path} not found!`, 404));
});
// structuredClone();
// Error handling middleware
app.use((err, req, res, next) => {
  const errorCode =
    err.code && [400, 401, 404].includes(err.code) ? err.code : 500;
  res.status(errorCode).send({
    message: err.message || "Internal Server Error. Something went wrong!",
    code: errorCode,
  });
});

module.exports = app;
