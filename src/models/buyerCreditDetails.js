const mongoose = require("mongoose");
const BuyerCreditSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gst: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const BuyerCredit = mongoose.model("mmbuyercredit", BuyerCreditSchema);
module.exports = { BuyerCredit, BuyerCreditSchema };
