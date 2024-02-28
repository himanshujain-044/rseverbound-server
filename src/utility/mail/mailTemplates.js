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
function customerPayoutRequest(data = {}) {
  return `
  <html>
    <head>
    <style>
      ${bodyCss}
    </style>
    </head>
    <body>
     <strong>Hey,</strong>
     <p>Request created from <strong>${data?.name}</strong> for the pay-out for these dates - ${data?.dates}</p>
     <strong>Total Amount - ${data?.totalAmountToPaid}</strong><br />
     <strong>Payment Method - ${data?.paymentMethod?.method}</strong><br />
     <strong>Payment Method - ${data?.paymentMethod?.paymentAddress}</strong><br /><br /><br />
     <strong>Thanks</strong>
    </body>
  </html>`;
}

module.exports = { customersAddedNotification, customerPayoutRequest };
