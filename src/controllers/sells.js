const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
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
        "-_id nextInvoiceNo hsnCodes igst cgst sgst vehicles destinations"
      );

      const hsnCodes =
        invoiceDetailsBody?.productsSellDetails?.productsSell?.map(
          (productSell) => productSell?.hsnCode?.toUpperCase()
        );

      const updatedInvoiceDetails = {
        nextInvoiceNo: Number(invoiceDetails?.nextInvoiceNo) + 1,
        hsnCodes: uniqueArray(invoiceDetails?.hsnCodes, hsnCodes),
        vehicles: uniqueArray(invoiceDetails?.vehicles, [
          invoiceDetailsBody?.vehicleNo,
        ]),
        destinations: uniqueArray(invoiceDetails?.destinations, [
          invoiceDetailsBody?.destination,
        ]),
        igst: Number(invoiceDetailsBody?.productsSellDetails?.igst || 0),
        sgst: Number(invoiceDetailsBody?.productsSellDetails?.sgst || 0) / 2,
        cgst: Number(invoiceDetailsBody?.productsSellDetails?.cgst || 0) / 2,
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
            _id: 1,
            id: "$_id",
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
};
