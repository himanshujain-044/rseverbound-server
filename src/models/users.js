const mongoose = require("mongoose");
const { PAYMENT_METHOD } = require("../constants/enum");
const paymentMethod = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: {
      values: [
        PAYMENT_METHOD.GPAY,
        PAYMENT_METHOD.PHONEPE,
        PAYMENT_METHOD.PAYTM,
      ],
      message: "Invalid method !",
    },
  },
  paymentAddress: {
    type: String,
    required: true,
  },
});
const otpDetails = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  type: { type: String, required: true },
  validity: { type: String, required: true },
});
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    ucc: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    paymentMethod: paymentMethod,
    token: {
      type: String,
    },
    otpDetails: otpDetails,
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const Users = mongoose.model("users", UserSchema);
module.exports = Users;
