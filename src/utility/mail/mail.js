const nodemailer = require("nodemailer");
const ErrorClass = require("../error");
const { attachments } = require("./mailAttachments");
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
  attachments = [],
  isMultipleReceiver = false,
}) => {
  try {
    const mailOptions = {
      to: isMultipleReceiver ? "" : to,
      bcc: to,
      subject,
      html,
      attachments,
    };
    mailOptions.from = `Brokerage Sharing Under Himanshu <${process.env.MAIL_ACCOUNT_USER}>`;
    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (err) {
    throw new ErrorClass(err.message, 400);
  }
};

module.exports.getAttachments = (attachmentsKeys = []) => {
  const d = attachmentsKeys.map((attachmentKey) => attachments[attachmentKey]);
  console.log("38", d);
  return d;
};
