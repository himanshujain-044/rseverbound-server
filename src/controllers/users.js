const { AMOUNT_PAID } = require("../constants/enum");
const { signToken } = require("../middleware/auth");
const Brokrage = require("../models/brokrage");
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
        throw new ErrorClass("Incorrect Credentials !", 401);
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
  getUserBrokrageData: async (req, res, next) => {
    try {
      const { email, mobile } = req?.user;
      const userBrokrage = await Brokrage.findOne(
        { email, mobile },
        { "brokrage._id": 0 }
      ).select("-_id -__v -createdAt -updatedAt");
      res.status(200).send({
        code: 200,
        message: "User's brokrage fetched successfully !",
        data: userBrokrage,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  updateUserBrokrage: async (req, res, next) => {
    try {
      const { email, mobile, paymentMethod, name } = req?.user;
      if (!paymentMethod?.method || !paymentMethod?.paymentAddress) {
        throw new ErrorClass("Select the payment method", 400);
      }
      const { dates } = req?.body;
      const { brokrage } = await Brokrage.findOne(
        {
          email,
          mobile,
        },
        { "brokrage._id": 0 }
      );

      if (!brokrage?.length) {
        throw new ErrorClass("No brokrage available !");
      }
      let totalAmountToPaid = 0;
      const updatedBrokrageArr = brokrage.map((brokrageData) => {
        const isDateExits = dates.find((date) => date === brokrageData?.date);
        if (isDateExits && brokrageData?.status !== AMOUNT_PAID.NOT_PAID) {
          throw new ErrorClass(
            "Please send the unpaid amount dates only !",
            400
          );
        }
        if (isDateExits && brokrageData?.status === AMOUNT_PAID.NOT_PAID) {
          const brokrage = brokrageData;
          brokrage["status"] = AMOUNT_PAID.PAID;
          totalAmountToPaid += brokrage["amount"];
          return brokrage;
        } else {
          return brokrageData;
        }
      });
      if (totalAmountToPaid < 50) {
        throw new ErrorClass(
          "Total paying amount is less then 50, try it later",
          400
        );
      }
      await Brokrage.findOneAndUpdate(
        { email, mobile },
        { $set: { brokrage: updatedBrokrageArr } },
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
        message: "User's brokrage updated successfully !",
        data: updatedBrokrageArr,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getPaidUserBrokrage: async (req, res, next) => {
    try {
      const { email, mobile } = req?.user;
      const brokrage = await Brokrage.aggregate([
        { $match: { email, mobile } }, // Match the user document
        { $unwind: "$brokrage" }, // Unwind the brokrage array
        { $match: { "brokrage.status": "paid" } }, // Filter brokrage array to only include entries with status "paid"
        {
          $group: {
            _id: "$_id",
            email: { $first: "$email" },
            mobile: { $first: "$mobile" },
            brokrage: { $push: "$brokrage" }, // Group back the filtered brokrage entries
          },
        },
        { $project: { _id: 0 } }, // Exclude _id field
      ]);

      res.status(200).send({
        code: 200,
        message: "User's paid brokrage fetched successfully !",
        data: brokrage,
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
