const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const Buyers = require("../models/buyers");
const Users = require("../models/users");
const { decryptPassword, encryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  getAllBuyers: async (req, res, next) => {
    try {
      const allBuyers = await Buyers.find().select("-_id name address state gst");
      res.status(200).send({
        code: 200,
        message: "All buyers fetched successfully !",
        data: allBuyers,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
