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

// const axios = require("axios");

// const url = "https://api.upstox.com/v2/login/authorization/token";
// const headers = {
//   accept: "application/json",
//   "Content-Type": "application/x-www-form-urlencoded",
// };

// const data = {
//   code: "K3QxWL",
//   client_id: "33cffabe-b4f8-4a50-8af3-9d322cd378e2",
//   client_secret: "6fzfhx27ual",
//   redirect_uri: "https://aditishukla.org/",
//   grant_type: "authorization_code",
// };

// axios
//   .post(url, new URLSearchParams(data), { headers })
//   .then((response) => {
//     console.log(response.status);
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.error(error.response.status);
//     console.error(error.response.data);
//   });

// const axios = require("axios");

// const urlp =
//   "https://service.upstox.com/partner-dashboard/api/v1/ledger/report/brokerageReportSummary";
// const headersp = {
//   Accept: "application/json",
//   Authorization:
//     "Bearer eyJ0eXAiOiJKV1QiLCJraWQiOiJpZHQtODAxYzAxZmEtOWRmNy00YjMyLThjZmItNzE2MzgxZjQ0YzAxIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIzNTMwMTg1IiwianRpIjoiVnZuUmNNcHpsWE14cFdubE9uOFlkU0Q3N0xnIiwiaWF0IjoxNzA4Njc5MTM4LCJleHAiOjE3MDg2ODI3MzgsImlzcyI6ImxvZ2luLXNlcnZpY2UiLCJzY29wZSI6W10sImNsaWVudF9pZCI6IlBEQi1ReDFIVWNVN2NnSDRpZUVkOE5vNXc3V24iLCJrZXlfaWQiOiJpZHQtODAxYzAxZmEtOWRmNy00YjMyLThjZmItNzE2MzgxZjQ0YzAxIiwicmVmcmVzaF90b2tlbl9pZCI6IlF5VnJqYjJqLVpIdm9UNk1vRFlZaWM3Q0JiTSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJyb2xlIjoiQ1VTVE9NRVIiLCJ1c2VyX3R5cGUiOiJDVVNUT01FUiIsInVzZXJfaWQiOiJKRDE1MDUiLCJ2ZXJzaW9uIjoiVjIiLCJzdHAiOiJPTVMxIn0.j6FK-Nw4YQuh4l0FzBUGSv91P_m0LXyEp_6pyLKbXdGQ1I0HWyTE_kuVPMhRakmBEIGBZc0v6K7cGxxMYJXElY4Bqe2wTwkJi4I3xRetEkHZ5IzpwVK2TEiOBrTJKPhQsJ-UaBlE0ofzF7xHyJ2y3nA3wIoWDh0DmwtWcSX4LYuMxkGDWMS5OCF3TJy3PepX0o-tvDX8crR9s3EUh6DTVDBvTt2zaO7SODWvApysT4Ro4PdeHFc27BAE7fHcUt8k_uyvXhjO2U2AZUb8aHLsabZ5LgDXY2hdbvKczhEMnfzBx3nqVs5kSNCcEPHK3gKoj8MTEmJF9Fq5XneQe8dxfA",
// };

// axios
//   .get(urlp, { headers: headersp })
//   .then((response) => console.log(response.data))
//   .catch((error) => console.error(error.response.data));
