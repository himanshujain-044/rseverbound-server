const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const Sells = require("../models/sells");
const Users = require("../models/users");
const { decryptPassword, encryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  saveInvoiceDetails: async (req, res, next) => {
    try {
      const invoiceDetails = req.body;
      console.log("13", invoiceDetails);
      const invoice = new Sells(invoiceDetails);
      await invoice.save();
      res.status(201).send({
        code: 201,
        message: "Invoice generated successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
