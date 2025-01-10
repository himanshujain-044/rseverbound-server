const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const InvoiceDetails = require("../models/invoiceDetails");
const Sells = require("../models/sells");
const Users = require("../models/users");
const { decryptPassword, encryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  saveInvoiceDetails: async (req, res, next) => {
    try {
      const invoiceDetails = req.body;
      const invoice = new Sells(invoiceDetails);
      await invoice.save();
      res.status(201).send({
        code: 201,
        message: "Invoice generated successfully !",
      });

      await InvoiceDetails.updateOne(
        {},
        {
          $set: {
            nextInvoiceNo: Number(invoiceDetails?.invoiceNo) + 1,
            hsnCode:
              invoiceDetails?.productsSellDetails?.productsSell[0].hsnCode,
            igst: invoiceDetails?.productsSellDetails?.igst,
            sgst: invoiceDetails?.productsSellDetails?.sgst,
            cgst: invoiceDetails?.productsSellDetails?.cgst,
          },
          $addToSet: {},
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
            grandTotal: "$productsSellDetails.grandTotal",
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
