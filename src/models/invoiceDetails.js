const mongoose = require("mongoose");
const InvoiceDetailsSchema = new mongoose.Schema(
  {
    nextInvoiceNo: {
      type: String,
      required: true,
    },
    hsnCode: {
      type: String,
    },
    igst: {
      type: String,
    },
    sgst: {
      type: String,
    },
    cgst: {
      type: String,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const InvoiceDetails = mongoose.model(
  "mminvoice-details",
  InvoiceDetailsSchema
);
module.exports = InvoiceDetails;
