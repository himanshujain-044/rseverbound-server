const mongoose = require("mongoose");
const BillSchema = new mongoose.Schema(
  {
    nextBillNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const Bill = mongoose.model("mmbills", BillSchema);
module.exports = Bill;
