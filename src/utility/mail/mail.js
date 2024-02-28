const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.MAIL_ACCOUNT_USER,
    pass: process.env.MAIL_ACCOUNT_PASSWORD,
  },
});

module.exports.sendEmail = async ({
  to,
  subject,
  html,
  isMultipleReceiver = false,
}) => {
  try {
    const mailOptions = {
      to: isMultipleReceiver ? "" : to,
      bcc: to,
      subject,
      html,
    };
    mailOptions.from = `Brokrage Sharing Under Himanshu <${process.env.MAIL_ACCOUNT_USER}>`;
    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (err) {
    throw new ErrorClass(err.message, 400);
  }
};
