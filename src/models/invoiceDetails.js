const mongoose = require("mongoose");
const InvoiceDetailsSchema = new mongoose.Schema(
  {
    nextInvoiceNo: {
      type: String,
      required: true,
    },
    igst: {
      type: Number,
    },
    sgst: {
      type: Number,
    },
    cgst: {
      type: Number,
    },
    hsnCodes: [
      {
        type: String,
      },
    ],
    destinations: [{ type: String }],
    vehicles: [{ type: String }],
    products: [{ type: String }],
    transportCompanies: [{ type: String }],
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const InvoiceDetails = mongoose.model(
  "rsinvoice-details",
  InvoiceDetailsSchema
);
module.exports = InvoiceDetails;
