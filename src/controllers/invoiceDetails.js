const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const InvoiceDetails = require("../models/invoiceDetails");
const Users = require("../models/users");
const { decryptPassword, encryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  invoiceDetails: async (req, res, next) => {
    try {
      const invoiceDetails =
        (await InvoiceDetails.findOne().select(
          "-_id nextInvoiceNo hsnCodes igst cgst sgst vehicles destinations units gsts products transportCompanies",
        )) || {};
      res.status(200).send({
        code: 200,
        message: "Invoice details fetched successfully !",
        data: invoiceDetails,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
