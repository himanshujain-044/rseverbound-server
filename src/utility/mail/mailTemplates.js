const ejs = require("ejs");
const fs = require("fs");

const bodyCss = `
body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  padding: 0;
  color: #333333;
}
`;

function customersAddedNotification(data = {}) {
  return `
  <html>
    <head>
    <style>
      ${bodyCss}
    </style>
    </head>
    <body>
     <strong>Hey ${data?.name},</strong>
    </body>
  </html>`;
}
// function customerPayoutRequest(data = {}) {
//   return `
//   <html>
//     <head>
//     <style>
//       ${bodyCss}
//     </style>
//     </head>
//     <body>
//      <strong>Hey,</strong>
//      <p>Request created from <strong>${data?.name}</strong> for the pay-out for these dates - ${data?.dates}</p>
//      <strong>Total Amount - ${data?.totalAmountToPaid}</strong><br />
//      <strong>Payment Method - ${data?.paymentMethod?.method}</strong><br />
//      <strong>Payment Method - ${data?.paymentMethod?.paymentAddress}</strong><br /><br /><br />
//      <strong>Thanks</strong>
//     </body>
//   </html>`;
// }

function customerPayoutRequest(data = {}) {
  // Dynamic data
  // const data = {
  //   username: "John",
  //   signupDate: new Date().toLocaleDateString(),
  // };

  // Render HTML string
  // ejs.renderFile(__dirname
  // console.log("61", __dirname);
  const templateString = fs.readFileSync(
    __dirname + "/mailTemplates/welcome-customer.ejs",
    "utf-8"
  );
  const html = ejs.render(templateString, data);
  return html;
}

module.exports = { customersAddedNotification, customerPayoutRequest };
