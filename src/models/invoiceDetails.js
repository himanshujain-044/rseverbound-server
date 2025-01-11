const mongoose = require("mongoose");
const InvoiceDetailsSchema = new mongoose.Schema(
  {
    nextInvoiceNo: {
      type: String,
      required: true,
    },
    hsnCodes: [
      {
        type: String,
      },
    ],
    igst: {
      type: Number,
    },
    sgst: {
      type: Number,
    },
    cgst: {
      type: Number,
    },
    destinations: [{ type: String }],
    vehicles: [{ type: String }],
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
