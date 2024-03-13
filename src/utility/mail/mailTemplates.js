const ejs = require("ejs");
const fs = require("fs");

const welcomeMail = (data = {}) => {
  const templateString = fs.readFileSync(
    __dirname + "/mailTemplates/welcome-customer.ejs",
    "utf-8"
  );
  const html = ejs.render(templateString, data);
  return html;
};

const customerPayoutRequest = (data = {}) => {
  const templateString = fs.readFileSync(
    __dirname + "/mailTemplates/payout-request.ejs",
    "utf-8"
  );
  const html = ejs.render(templateString, data);
  return html;
};

const openDematAccount = () => {
  const templateString = fs.readFileSync(
    __dirname + "/mailTemplates/open-demat-account.ejs",
    "utf-8"
  );
  const html = ejs.render(templateString);
  return html;
};

module.exports = { welcomeMail, customerPayoutRequest, openDematAccount };
