const { AMOUNT_PAID } = require("../constants/enum");
const { signToken } = require("../middleware/auth");
const Brokerage = require("../models/brokerage");
const Users = require("../models/users");
const { decryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");
const { sendEmail } = require("../utility/mail/mail");
const { customerPayoutRequest } = require("../utility/mail/mailTemplates");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, mobile, password } = req.body;
      const isUserExits = await Users.findOne({
        $or: [{ email }, { mobile }],
      }).select("-_id -__v -createdAt -updatedAt -paymentMethod._id");
      if (!isUserExits?.email || !isUserExits?.mobile) {
        throw new ErrorClass("User is not existed !", 400);
      }
      const deUserPassword = decryptPassword(password);
      const deStoredPassword = decryptPassword(isUserExits.password);
      if (deUserPassword !== deStoredPassword) {
        throw new ErrorClass("Incorrect Credentials !", 400);
      }
      const userDetails = {
        email: isUserExits.email,
        ucc: isUserExits.ucc,
        mobile: isUserExits.mobile,
        name: isUserExits.name,
        paymentMethod: isUserExits?.paymentMethod,
      };

      const token = signToken(userDetails);
      await Users.findOneAndUpdate({ email: isUserExits.email }, { token });
      res.status(201).send({
        code: 201,
        message: "User login successfully !",
        data: {
          token,
          ...userDetails,
        },
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { email } = req?.user;
      await Users.findOneAndUpdate({ email }, { token: "" });
      res.status(200).send({
        code: 200,
        message: "User logout successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getUserBrokerageData: async (req, res, next) => {
    try {
      const { email, mobile } = req?.user;
      const userBrokerage = await Brokerage.findOne(
        { email, mobile },
        { "brokerage._id": 0 }
      ).select("-_id -__v -createdAt -updatedAt");
      res.status(200).send({
        code: 200,
        message: "User's brokerage fetched successfully !",
        data: userBrokerage,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  updateUserBrokerage: async (req, res, next) => {
    try {
      const { email, mobile, paymentMethod, name } = req?.user;
      if (!paymentMethod?.method || !paymentMethod?.paymentAddress) {
        throw new ErrorClass("Select the payment method", 400);
      }
      const { dates } = req?.body;
      const { brokerage } = await Brokerage.findOne(
        {
          email,
          mobile,
        },
        { "brokerage._id": 0 }
      );

      if (!brokerage?.length) {
        throw new ErrorClass("No brokerage available !");
      }
      let totalAmountToPaid = 0;
      const updatedBrokerageArr = brokerage.map((brokerageData) => {
        const isDateExits = dates.find((date) => date === brokerageData?.date);
        if (isDateExits && brokerageData?.status !== AMOUNT_PAID.NOT_PAID) {
          throw new ErrorClass(
            "Please send the unpaid amount dates only !",
            400
          );
        }
        if (isDateExits && brokerageData?.status === AMOUNT_PAID.NOT_PAID) {
          const brokerage = brokerageData;
          brokerage["status"] = AMOUNT_PAID.PAID;
          totalAmountToPaid += brokerage["amount"];
          return brokerage;
        } else {
          return brokerageData;
        }
      });
      if (totalAmountToPaid < 50) {
        throw new ErrorClass(
          "Total paying amount is less then 50, try it later",
          400
        );
      }
      await Brokerage.findOneAndUpdate(
        { email, mobile },
        { $set: { brokerage: updatedBrokerageArr } },
        { new: true }
      );
      await sendEmail({
        to: [process.env.REQEST_PAYOUT_EMAIL, "himanshujain044@gmail.com"],
        subject: "Requested for pay-out",
        html: customerPayoutRequest({
          name,
          totalAmountToPaid,
          dates,
          paymentMethod,
        }),
        isMultipleReceiver: true,
      });
      res.status(200).send({
        code: 200,
        message: "User's brokerage updated successfully !",
        data: updatedBrokerageArr,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getPaidUserBrokerage: async (req, res, next) => {
    try {
      const { email, mobile } = req?.user;
      const brokerage = await Brokerage.aggregate([
        { $match: { email, mobile } }, // Match the user document
        { $unwind: "$brokerage" }, // Unwind the brokerage array
        { $match: { "brokerage.status": "paid" } }, // Filter brokerage array to only include entries with status "paid"
        {
          $group: {
            _id: "$_id",
            email: { $first: "$email" },
            mobile: { $first: "$mobile" },
            brokerage: { $push: "$brokerage" }, // Group back the filtered brokerage entries
          },
        },
        { $project: { _id: 0 } }, // Exclude _id field
      ]);

      res.status(200).send({
        code: 200,
        message: "User's paid brokerage fetched successfully !",
        data: brokerage,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  updatePaymentMethod: async (req, res, next) => {
    try {
      const { email, mobile } = req?.user;
      const { paymentMethod } = req?.body;
      await Users.findOneAndUpdate({ email, mobile }, { paymentMethod });
      res.status(201).send({
        code: 201,
        message: "Payment method updated successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
