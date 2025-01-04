require("dotenv").config();
const https = require("node:https");
const http = require("node:http");
const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT;
let server = http.createServer(app);
if (process.env.PRIVATE_KEY) {
  const key = fs.readFileSync(process.env.PRIVATE_KEY);
  const cert = fs.readFileSync(process.env.CERTIFICATE);
  server = https.createServer({ key, cert }, app);
}

async function startServer() {
  try {
    mongoose
      .connect(process.env.MONGODB_ATLAS_URL)
      .then(() => {
        server.listen(port, () => {
          console.log(
            `Connected to local - Database for ${
              process.env.PRIVATE_KEY ? "https" : "http"
            } server to port ${port}`
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.error("Error connecting to database", err);
    process.exit(1);
  }
}

startServer();
