const ejs = require("ejs");
const fs = require("fs");

function welcomeMail(data = {}) {
  const templateString = fs.readFileSync(
    __dirname + "/mailTemplates/welcome-customer.ejs",
    "utf-8"
  );
  const html = ejs.render(templateString, data);
  return html;
}

function customerPayoutRequest(data = {}) {
  const templateString = fs.readFileSync(
    __dirname + "/mailTemplates/payout-request.ejs",
    "utf-8"
  );
  const html = ejs.render(templateString, data);
  return html;
}

module.exports = { welcomeMail, customerPayoutRequest };
