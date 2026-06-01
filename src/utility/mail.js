const nodemailer = require("nodemailer");
const ErrorClass = require("./error");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.MAIL_ACCOUNT_USER,
    pass: process.env.MAIL_ACCOUNT_PASSWORD,
  },
});

async function sendEmail({
  to,
  subject,
  text,
  html,
  attachments,
  isBulkMail = false,
}) {
  try {
    const mailOptions = {
      to: isBulkMail ? "" : to,
      bcc: to,
      subject,
      text,
      html,
      attachments,
    };
    mailOptions.from = `Rock Sunn Private Limited <${process.env.MAIL_ACCOUNT_USER}>`;
    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (err) {
    throw new ErrorClass(err.message, 400);
  }
}

module.exports = {
  sendEmail,
};
