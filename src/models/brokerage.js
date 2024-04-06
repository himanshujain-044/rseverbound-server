const mongoose = require("mongoose");
const { AMOUNT_PAID } = require("../constants/enum");

const brokerageSchema = new mongoose.Schema({
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: [AMOUNT_PAID.PAID, AMOUNT_PAID.NOT_PAID, AMOUNT_PAID.PENDING],
  },
});
const BrokerageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    brokerage: [brokerageSchema],
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const Brokerage = mongoose.model("brokerage", BrokerageSchema);

module.exports = Brokerage;
