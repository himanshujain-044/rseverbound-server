const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const Users = require("../models/users");
const { decryptPassword, encryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const isUserExits = await Users.findOne({
        email,
      }).select("-_id -__v -createdAt -updatedAt");
      if (!isUserExits?.email) {
        throw new ErrorClass("User is not existed !", 400);
      }
      const deUserPassword = decryptPassword(password);
      const deStoredPassword = decryptPassword(isUserExits.password);
      if (deUserPassword !== deStoredPassword) {
        throw new ErrorClass("Incorrect Credentials !", 400);
      }
      const userDetails = {
        email: isUserExits.email,
        name: isUserExits.name,
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
};
