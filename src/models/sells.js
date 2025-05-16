const mongoose = require("mongoose");
const { BuyersSchema } = require("./buyers");
const { required } = require("joi");

const ProductsSellSchema = new mongoose.Schema({
  sNo: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  bagsCount: { type: String },
  bagWeight: { type: String },
  hsnCode: {
    type: String,
  },
  quantity: { type: Number, required: true },
  ratePMT: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const ProductsSellDetailsSchema = new mongoose.Schema({
  productsSell: [ProductsSellSchema],
  igst: {
    type: Number,
  },
  sgst: {
    type: Number,
  },
  cgst: {
    type: Number,
  },
  gstAmount: { type: Number },
  otherExpenses: {
    type: Number,
  },
  otherExpensesText: {
    type: String,
  },
  otherExpensesGST: {
    type: Number,
  },
  otherExpensesGSTText: {
    type: String,
  },
  totalProductAmount: {
    type: Number,
  },
  grandTotal: { type: Number, required: true },
  roundOff: { type: Object, required: true },
});

const SellsSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: String,
      required: true,
    },
    buyerOrderNo: {
      type: String,
    },
    dated: {
      type: String,
      required: true,
    },
    dispatchThrough: {
      type: String,
    },
    destination: {
      type: String,
      required: true,
    },
    shipToDetails: {
      type: BuyersSchema,
    },
    isShiptoBDSame: {
      type: Boolean,
      required: true,
    },
    buyerDetails: {
      type: BuyersSchema,
      required: true,
    },
    buyerOrderNoValue: {
      type: String,
    },
    buyerOrderNoText: {
      type: String,
    },
    vehicleNo: {
      type: String,
      required: true,
    },
    etpNo: {
      type: String,
    },
    ewayBillNo: {
      type: String,
    },
    transportCompany: {
      type: String,
    },
    isInvoiceCancel: { type: Boolean, default: false },
    productsSellDetails: ProductsSellDetailsSchema,
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const Sells = mongoose.model("mmsells", SellsSchema);
module.exports = Sells;
