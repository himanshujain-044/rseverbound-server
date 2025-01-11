const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const { Buyers } = require("../models/buyers");
const InvoiceDetails = require("../models/invoiceDetails");
const Sells = require("../models/sells");
const Users = require("../models/users");
const {
  decryptPassword,
  encryptPassword,
  uniqueArray,
} = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  saveInvoiceDetails: async (req, res, next) => {
    try {
      const invoiceDetailsBody = req.body;
      const invoice = new Sells(invoiceDetailsBody);
      await invoice.save();

      const invoiceDetails = await InvoiceDetails.findOne().select(
        "-_id nextInvoiceNo hsnCodes igst cgst sgst vehicles destinations products"
      );

      const hsnCodes = [];
      const products = [];
      invoiceDetailsBody?.productsSellDetails?.productsSell?.forEach(
        (productSell) => {
          hsnCodes.push(productSell?.hsnCode?.toUpperCase());
          products.push(productSell?.description?.toUpperCase());
        }
      );

      const gstPercentage = Number(
        invoiceDetailsBody?.productsSellDetails?.igst ||
          invoiceDetailsBody?.productsSellDetails?.sgst ||
          0
      );
      const updatedInvoiceDetails = {
        nextInvoiceNo: Number(invoiceDetails?.nextInvoiceNo) + 1,
        hsnCodes: uniqueArray(invoiceDetails?.hsnCodes, hsnCodes),
        products: uniqueArray(invoiceDetails?.products, products),
        vehicles: uniqueArray(invoiceDetails?.vehicles, [
          invoiceDetailsBody?.vehicleNo,
        ]),
        destinations: uniqueArray(invoiceDetails?.destinations, [
          invoiceDetailsBody?.destination,
        ]),
        igst: gstPercentage,
        sgst: gstPercentage / 2,
        cgst: gstPercentage / 2,
      };

      res.status(201).send({
        code: 201,
        message: "Invoice generated successfully !",
      });

      await InvoiceDetails.updateOne(
        {},
        {
          $set: updatedInvoiceDetails,
        }
      );
      const { name, state, address, gst } = invoiceDetailsBody.buyerDetails;
      const resul = await Buyers.findOneAndUpdate(
        { name },
        { name, state, address, gst },
        { new: true, upsert: true }
      );
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getSellsData: async (req, res, next) => {
    try {
      const data = await Sells.aggregate([
        {
          $project: {
            invoiceNo: 1,
            date: 1,
            vehicleNo: 1,
            name: "$buyerDetails.name",
            address: "$buyerDetails.address",
            gst: "$buyerDetails.gst",
            state: "$buyerDetails.state",
            grandTotal: "$productsSellDetails.grandTotal",
            gstAmount: "$productsSellDetails.gstAmount",
            otherExpensesText: "$productsSellDetails.otherExpensesText",
            otherExpenses: "$productsSellDetails.otherExpenses",
            _id: 0,
            id: "$invoiceNo",
          },
        },
      ]);
      res.status(200).send({
        code: 200,
        data,
        message: "Sells data fetched successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  getSpecificSellData: async (req, res, next) => {
    try {
      const { invoiceNo } = req.query;
      const data = await Sells.findOne({ invoiceNo }).select("-_id -__v");
      res.status(200).send({
        code: 200,
        data,
        message: "Sell data fetched successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
