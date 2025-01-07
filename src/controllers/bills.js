const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const Bill = require("../models/bill");
const Users = require("../models/users");
const { decryptPassword, encryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  billNumber: async (req, res, next) => {
    try {
      const billNumber = await Bill.findOne().select("-_id nextBillNumber");
      res.status(200).send({
        code: 200,
        message: "Next Bill number fetched successfully !",
        data: billNumber,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
