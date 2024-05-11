const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const Brokerage = require("../models/brokerage");
const Users = require("../models/users");
const {
  decryptPassword,
  generateMailSubject,
  generateOTP,
  calculateTimeDifference,
} = require("../utility/common");
const ErrorClass = require("../utility/error");
const { sendEmail, getAttachments } = require("../utility/mail/mail");
const {
  customerPayoutRequest,
  welcomeMail,
  sendOTP,
} = require("../utility/mail/mailTemplates");

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
      const userBrokerage = await Brokerage.aggregate([
        { $match: { email, mobile } }, // Match the user document
        { $unwind: "$brokerage" }, // Unwind the brokerage array
        {
          $match: {
            $or: [
              { "brokerage.status": AMOUNT_PAID.NOT_PAID },
              { "brokerage.status": AMOUNT_PAID.PENDING },
            ],
          },
        }, // Filter brokerage array to only include entries with status "Not Paid"
        {
          $addFields: {
            "brokerage.convertedToDateObj": { $toDate: "$brokerage.date" },
          },
        }, // Convert date strings to Date objects
        { $sort: { "brokerage.convertedToDateObj": -1 } }, // Sort by date in descending order
        {
          $group: {
            _id: "$_id",
            email: { $first: "$email" },
            mobile: { $first: "$mobile" },
            brokerage: { $push: "$brokerage" }, // Group back the filtered brokerage entries
          },
        },
        {
          $addFields: {
            brokerage: {
              $map: {
                input: "$brokerage",
                as: "brokerageItem",
                in: {
                  date: "$$brokerageItem.date",
                  amount: "$$brokerageItem.amount",
                  status: "$$brokerageItem.status",
                  id: "$$brokerageItem._id",
                },
              },
            },
          },
        },
      ]);

      res.status(200).send({
        code: 200,
        message: "User's brokerage fetched successfully !",
        data: userBrokerage[0]?.brokerage || [],
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  updateUserBrokerage: async (req, res, next) => {
    try {
      const { email, mobile, paymentMethod, name, ucc } = req?.user;
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
          brokerage["status"] = AMOUNT_PAID.PENDING;
          totalAmountToPaid += brokerage["amount"];
          return brokerage;
        } else {
          return brokerageData;
        }
      });
      if (totalAmountToPaid < 50) {
        throw new ErrorClass("Total amount is less then Rs. 50", 400);
      }
      await sendEmail({
        to: [process.env.REQEST_PAYOUT_EMAIL, email], //todo: Promise all
        subject: "Requested for pay-out",
        html: customerPayoutRequest({
          name,
          email,
          totalAmountToPaid,
          dates,
          paymentMethod,
        }),
        attachments: getAttachments(["logo"]),
        isMultipleReceiver: true,
      });

      await Brokerage.findOneAndUpdate(
        // todo: Promise all
        { email, mobile },
        { $set: { brokerage: updatedBrokerageArr } },
        { new: true }
      );

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
        { $match: { "brokerage.status": AMOUNT_PAID.PAID } }, // Filter brokerage array to only include entries with status "paid"
        {
          $addFields: {
            "brokerage.convertedToDateObj": { $toDate: "$brokerage.date" },
          },
        }, // Convert date strings to Date objects
        { $sort: { "brokerage.convertedToDateObj": -1 } }, // Sort by date in descending order
        {
          $group: {
            _id: "$_id",
            email: { $first: "$email" },
            mobile: { $first: "$mobile" },
            brokerage: { $push: "$brokerage" }, // Group back the filtered brokerage entries
          },
        },
        {
          $project: {
            email: 1,
            mobile: 1,
            _id: 0,
            brokerage: {
              $map: {
                input: "$brokerage",
                as: "brokerageItem",
                in: {
                  date: "$$brokerageItem.date",
                  amount: "$$brokerageItem.amount",
                  status: "$$brokerageItem.status",
                  id: "$$brokerageItem._id",
                },
              },
            },
          },
        },
      ]);

      res.status(200).send({
        code: 200,
        message: "User's paid brokerage fetched successfully !",
        data: brokerage[0]?.brokerage || [],
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
        data: paymentMethod,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  sendOTP: async (req, res, next) => {
    try {
      const { email, type } = req?.body;
      const isUserExits = await Users.findOne({ email });
      const subject = generateMailSubject(type);
      if (isUserExits?.email) {
        const genOTP = generateOTP();
        const sendMailPromise = sendEmail({
          to: "himanshujain044@gmail.com",
          subject,
          html: sendOTP({
            name: isUserExits?.name,
            otp: genOTP,
            validity: "5 Mins",
          }),
          attachments: getAttachments(["logo"]),
        });
        const updateUserPromise = Users.findOneAndUpdate(
          { email },
          {
            otpDetails: {
              otp: genOTP,
              type,
              validity: new Date(),
            },
          }
        );
        await Promise.all([sendMailPromise, updateUserPromise]);
        res.status(STATUS.success).send({
          code: STATUS.success,
          message: "OTP sent on your email",
        });
      } else {
        throw new ErrorClass("User's email is not registered", 400);
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  verifyOTP: async (req, res, next) => {
    try {
      const { email, otp } = req?.body;
      const isUserExits = await Users.findOne({ email });
      if (isUserExits?.email) {
        const { validity, otp: storedOtp, type } = isUserExits?.otpDetails;
        console.log(
          calculateTimeDifference(
            isUserExits?.validity,
            new Date(),
            TIME_UNITS.SECONDS
          )
        );
        if (
          calculateTimeDifference(validity, new Date(), TIME_UNITS.SECONDS) >
          300
        ) {
          throw new ErrorClass("OTP is expired, Try again.", 400);
        }
        console.log("322", storedOtp, otp);
        if (storedOtp !== otp) {
          throw new ErrorClass("Incorrect OTP, Try again.", 400);
        }
        if (type === OTP_TYPE.FORGOT_PASSWORD) {
          await Users.findOneAndUpdate(
            { email },
            {
              $set: { password: req?.body?.newPassword },
              $unset: {
                otpDetails: {},
              },
            }
          );
        }
        res.status(201).send({
          code: 200,
          message: "Your password has been changed.",
        });
      } else {
        throw new ErrorClass("User's email is not registered", 400);
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  userData: async (req, res, next) => {
    console.log("test", req);
    res.status(201).send({
      code: 201,
      message: req.body,
    });
  },
};
