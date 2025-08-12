const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const { BuyerCredit } = require("../models/buyerCreditDetails");
const { Buyers } = require("../models/buyers");
const Users = require("../models/users");
const { decryptPassword, encryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  getAllBuyers: async (req, res, next) => {
    try {
      const allBuyers = await Buyers.find().select(
        "-_id name address state gst"
      );
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
  saveBuyerCreditDetails: async (req, res, next) => {
    try {
      const buyerCreditAmountDet = req.body;
      const buyerCrAmt = new BuyerCredit(buyerCreditAmountDet);
      await buyerCrAmt.save();
      res.status(201).send({
        code: 201,
        message: "Buyer's crdit amount info saved successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getBuyerCreditData: async (req, res, next) => {
    try {
      const { buyerDetails, financialYear } = req.query;
      const [startYear, endYear] = financialYear?.split("-");
      const [companyName, gst] = buyerDetails?.split(",");
      const regexDatePattern = new RegExp(
        `(?:\\d{1,2}-(?:Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-${startYear})|` +
          `(?:\\d{1,2}-(?:Jan|Feb|Mar)-${endYear})`
      );
      const buyerCreditDetailsData = await BuyerCredit.find({
        gst,
        date: { $regex: regexDatePattern, $options: "i" },
      });
      const totalFinanceYearCredAtm = buyerCreditDetailsData.reduce(
        (acc, currVal) => {
          return acc + currVal?.amount;
        },
        0
      );
      res.status(200).send({
        code: 200,
        message: "Buyer's crdit detail fetched successfully !",
        data: { data: buyerCreditDetailsData, totalFinanceYearCredAtm },
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
