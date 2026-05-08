const mongoose = require("mongoose");
const BuyersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gst: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const Buyers = mongoose.model("rsbuyers", BuyersSchema);
module.exports = { Buyers, BuyersSchema };
