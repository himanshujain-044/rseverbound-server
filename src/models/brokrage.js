const mongoose = require("mongoose");
const { AMOUNT_PAID } = require("../constants/enum");

const brokrageSchema = new mongoose.Schema({
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: [AMOUNT_PAID.PAID, AMOUNT_PAID.NOT_PAID],
  },
});
const BrokrageSchema = new mongoose.Schema(
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
    brokrage: [brokrageSchema],
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const Brokrage = mongoose.model("brokrage", BrokrageSchema);

module.exports = Brokrage;
