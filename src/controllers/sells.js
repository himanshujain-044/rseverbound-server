const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const { Buyers } = require("../models/buyers");
const DeliveryChallan = require("../models/deliveryChallan");
const InvoiceDetails = require("../models/invoiceDetails");
const Sells = require("../models/sells");
const Users = require("../models/users");
const {
  decryptPassword,
  encryptPassword,
  uniqueArray,
  getNextInvoiceNumber,
  getNextDeliveryChNumber,
  numberToWords,
} = require("../utility/common");
const ErrorClass = require("../utility/error");
const { sendEmail } = require("../utility/mail");
const InvoiceTemp = require("../utility/mailTemplate");
const ReportPdf = require("../utility/mailTemplate");

module.exports = {
  saveInvoiceDetails: async (req, res, next) => {
    try {
      const { default: ReactPDF, renderToBuffer } =
        await import("@react-pdf/renderer");
      const { Document, Page, Text, View, Image } = ReactPDF;
      const invoiceDetailsBody = req.body;
      const { billType } = req.body;
      if (billType === "invoice") {
        const invoice = new Sells(invoiceDetailsBody);
        await invoice.save();
      } else {
        const deliveryChallan = new DeliveryChallan(invoiceDetailsBody);
        await deliveryChallan.save();
      }

      const invoiceDetails = await InvoiceDetails.findOne().select(
        "-_id nextInvoiceNo nextDeliveryChNo hsnCodes igst cgst sgst vehicles destinations products transportCompanies",
      );

      const hsnCodes = [];
      const products = [];
      invoiceDetailsBody?.productsSellDetails?.productsSell?.forEach(
        (productSell) => {
          hsnCodes.push(productSell?.hsnCode?.toUpperCase()?.trim());
          products.push(productSell?.description?.toUpperCase()?.trim());
        },
      );

      const gstPercentage = Number(
        invoiceDetailsBody?.productsSellDetails?.igst ||
          invoiceDetailsBody?.productsSellDetails?.sgst ||
          0,
      );
      const updatedInvoiceDetails = {
        nextInvoiceNo:
          billType === "invoice"
            ? getNextInvoiceNumber(invoiceDetails?.nextInvoiceNo)
            : invoiceDetails?.nextInvoiceNo,
        nextDeliveryChNo:
          billType === "invoice"
            ? invoiceDetails?.nextDeliveryChNo
            : getNextDeliveryChNumber(invoiceDetails?.nextDeliveryChNo),
        hsnCodes: uniqueArray(invoiceDetails?.hsnCodes, hsnCodes),
        products: uniqueArray(invoiceDetails?.products, products),
        vehicles: uniqueArray(invoiceDetails?.vehicles, [
          invoiceDetailsBody?.vehicleNo,
        ]),
        destinations: uniqueArray(invoiceDetails?.destinations, [
          invoiceDetailsBody?.destination,
        ]),
        transportCompanies: uniqueArray(invoiceDetails?.transportCompanies, [
          invoiceDetailsBody?.transportCompany,
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
        },
      );
      const { name, state, address, gst, placeOfSupply } =
        invoiceDetailsBody.buyerDetails;
      await Buyers.findOneAndUpdate(
        { gst },
        { name, state, address, gst, placeOfSupply },
        { new: true, upsert: true },
      );
      const {
        name: n,
        state: s,
        address: a,
        gst: g,
      } = invoiceDetailsBody.shipToDetails;
      await Buyers.findOneAndUpdate(
        { gst: g },
        { name: n, state: s, address: a, gst: g, placeOfSupply: s },
        { new: true, upsert: true },
      );

      const pdfBuffer = await renderToBuffer(
        InvoiceTemp({
          Document,
          Page,
          Text,
          View,
          Image,
          data: invoiceDetailsBody,
        }),
      );
      await sendEmail({
        to: ["shubhanshuj2222@gmail.com", "rseverbound@gmail.com"],
        subject: `${invoiceDetailsBody?.invoiceNo ? "Invoice" : "Delivery Challan"} generated successfully !`,
        attachments: [
          {
            filename: `${invoiceDetailsBody?.invoiceNo ? invoiceDetailsBody?.invoiceNo : invoiceDetailsBody?.deliveryChNo}_${invoiceDetailsBody?.date}_${invoiceDetailsBody?.buyerDetails?.name}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getSellsData: async (req, res, next) => {
    try {
      const sellsData = await Sells.aggregate([
        {
          $project: {
            invoiceNo: 1,
            invoiceDate: 1,
            vehicleNo: 1,
            isInvoiceCancel: 1,
            name: "$buyerDetails.name",
            address: "$buyerDetails.address",
            gst: "$buyerDetails.gst",
            state: "$buyerDetails.state",
            grandTotal: "$productsSellDetails.grandTotal",
            gstAmount: "$productsSellDetails.gstAmount",
            otherExpensesText: "$productsSellDetails.otherExpensesText",
            otherExpenses: "$productsSellDetails.otherExpenses",
            _id: "$invoiceNo",
            id: "$invoiceNo",
          },
        },
      ]);
      const deliveryChallanData = await DeliveryChallan.aggregate([
        {
          $project: {
            deliveryChNo: 1,
            invoiceDate: 1,
            vehicleNo: 1,
            isInvoiceCancel: 1,
            name: "$buyerDetails.name",
            address: "$buyerDetails.address",
            gst: "$buyerDetails.gst",
            state: "$buyerDetails.state",
            totalProductAmount: "$productsSellDetails.totalProductAmount",
            grandTotal: "$productsSellDetails.grandTotal",
            gstAmount: "$productsSellDetails.gstAmount",
            otherExpensesText: "$productsSellDetails.otherExpensesText",
            otherExpenses: "$productsSellDetails.otherExpenses",
            _id: "$deliveryChNo",
            id: "$deliveryChNo",
          },
        },
      ]);
      res.status(200).send({
        code: 200,
        data: [...sellsData, ...deliveryChallanData],
        message: "Sells data fetched successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getSpecificSellData: async (req, res, next) => {
    try {
      const { invoiceNo, deliveryChNo } = req.query;
      let data = null;
      if (invoiceNo) {
        data = await Sells.findOne({ invoiceNo }).select("-_id -__v");
      } else {
        data = await DeliveryChallan.findOne({ deliveryChNo }).select(
          "-_id -__v",
        );
      }
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
  getSellsReports: async (req, res, next) => {
    try {
      const { month, year } = req.query;
      let filter = "";
      if (month) {
        filter = "-" + month;
      }
      if (year) {
        filter = filter + "-" + year;
      }
      const data = await Sells.aggregate([
        {
          $match: {
            invoiceDate: { $regex: new RegExp(filter, "i") },
            isInvoiceCancel: false,
          },
        },
        { $unwind: "$productsSellDetails.productsSell" },
        {
          $group: {
            _id: {
              invoiceDate: "$invoiceDate",
              name: "$buyerDetails.name",
              gst: "$buyerDetails.gst",
              invoiceNo: "$invoiceNo",
              igst: "$productsSellDetails.igst",
              sgst: "$productsSellDetails.sgst",
              gstAmount: "$productsSellDetails.gstAmount",
              otherExpensesGST: "$productsSellDetails.otherExpensesGST",
            },
            weight: {
              $sum: { $toDouble: "$productsSellDetails.productsSell.quantity" },
            },
            amount: {
              $sum: { $toDouble: "$productsSellDetails.productsSell.amount" },
            },
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field from the final output
            invoiceDate: "$_id.invoiceDate",
            weight: 1,
            amount: 1,
            name: "$_id.name",
            gst: "$_id.gst",
            invoiceNo: "$_id.invoiceNo",
            igst: "$_id.igst",
            sgst: "$_id.sgst",
            gstAmount: "$_id.gstAmount",
            otherExpensesGST: "$_id.otherExpensesGST",
            id: "$_id.invoiceNo",
          },
        },
      ]);
      res.status(200).send({
        code: 200,
        data,
        message: "Sells report data fetched successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  updateInvoice: async (req, res, next) => {
    try {
      const { default: ReactPDF, renderToBuffer } =
        await import("@react-pdf/renderer");
      const { Document, Page, Text, View, Image } = ReactPDF;
      const { invoiceNo, isWholeInvoiceUpdate, deliveryChNo } = req.body;
      const payload = req.body;
      if (isWholeInvoiceUpdate) {
        delete payload.isWholeInvoiceUpdate;
        const sellInvoiceDet = await Sells.findOne({ invoiceNo });
        if (
          sellInvoiceDet?.productsSellDetails?.igst &&
          payload?.productsSellDetails?.sgst
        ) {
          delete payload.productsSellDetails.igst;
        }
        if (
          sellInvoiceDet?.productsSellDetails?.sgst &&
          payload?.productsSellDetails?.igst
        ) {
          delete payload.productsSellDetails.sgst;
        }
        if (invoiceNo) {
          await Sells.findOneAndUpdate({ invoiceNo }, [
            { $set: { ...payload } },
          ]);
        } else {
          await DeliveryChallan.findOneAndUpdate({ deliveryChNo }, [
            { $set: { ...payload } },
          ]);
        }
      } else {
        if (invoiceNo) {
          await Sells.findOneAndUpdate({ invoiceNo }, [
            { $set: { isInvoiceCancel: { $eq: [false, "$isInvoiceCancel"] } } },
          ]);
        } else {
          await DeliveryChallan.findOneAndUpdate({ deliveryChNo }, [
            { $set: { isInvoiceCancel: { $eq: [false, "$isInvoiceCancel"] } } },
          ]);
        }
      }
      res.status(200).send({
        code: 200,
        message: invoiceNo
          ? "Invoice has been updated successfully !"
          : "Deliver Challan has been updated successfully !",
      });
      if (isWholeInvoiceUpdate) {
        const pdfBuffer = await renderToBuffer(
          InvoiceTemp({
            Document,
            Page,
            Text,
            View,
            Image,
            data: payload,
          }),
        );
        await sendEmail({
          to: ["shubhanshuj2222@gmail.com", "rseverbound@gmail.com"],
          subject: `${invoiceNo ? "Invoice" : "Delivery Challan"} updated successfully !`,
          attachments: [
            {
              filename: `${invoiceNo ? invoiceNo : deliveryChNo}_${payload?.invoiceDate}_${payload?.buyerDetails?.name}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getBuyerSellData: async (req, res, next) => {
    try {
      const { buyerDetails, financialYear } = req.query;
      const [startYear, endYear] = financialYear?.split("-");
      const [companyName, gst] = buyerDetails?.split(",");
      const regexDatePattern = new RegExp(
        `(?:\\d{1,2}-(?:Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-${startYear})|` +
          `(?:\\d{1,2}-(?:Jan|Feb|Mar)-${endYear})`,
      );
      const data = await Sells.find({
        "buyerDetails.gst": gst,
        invoiceDate: { $regex: regexDatePattern, $options: "i" },
        isInvoiceCancel: false,
      })
        .select("invoiceDate invoiceNo productsSellDetails")
        .lean();
      let totalFinanceYearDebitAtm = 0;
      const updatedData = data?.map((data) => {
        totalFinanceYearDebitAtm =
          totalFinanceYearDebitAtm + data?.productsSellDetails?.grandTotal;
        return {
          ...data,
          grandTotal: data?.productsSellDetails?.grandTotal,
          gstAmount: data?.productsSellDetails?.gstAmount,
        };
      });
      res.status(200).send({
        code: 200,
        data: { data: updatedData, totalFinanceYearDebitAtm },
        message: "Buyer sells data fetched successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
