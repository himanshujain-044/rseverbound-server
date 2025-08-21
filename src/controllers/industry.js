const Sells = require("../models/sells");

module.exports = {
  getIndustryPerfReport: async (req, res, next) => {
    try {
      const { financialYear } = req.query;
      const [startYear, endYear] = financialYear?.split("-");
      const regexDatePattern = new RegExp(
        `(?:\\d{1,2}-(?:Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-${startYear})|` +
          `(?:\\d{1,2}-(?:Jan|Feb|Mar)-${endYear})`
      );
      const data = await Sells.aggregate([
        {
          $match: { date: { $regex: regexDatePattern, $options: "i" } },
        },
        { $unwind: "$productsSellDetails.productsSell" },
        {
          $group: {
            _id: {
              description: "$productsSellDetails.productsSell.description",
            },
            weight: {
              $sum: { $toDouble: "$productsSellDetails.productsSell.quantity" },
            },
            amount: {
              $sum: { $toDouble: "$productsSellDetails.productsSell.amount" },
            },
            grandTotal: {
              $sum: { $toDouble: "$productsSellDetails.grandTotal" },
            },
          },
        },
        // {
        //   $group: {
        //     _id: null,
        //     description: { $push: "$$ROOT" },
        //     grandTotal: {
        //       $sum: { $toDouble: "$productsSellDetails.grandTotal" },
        //     },
        //   },
        // },
        {
          $project: {
            _id: 0, // Exclude the _id field from the final output
            // grandTotal: "$productsSellDetails.grandTotal",
            weight: 1,
            amount: 1,
            grandTotal: 1,
            description: "$_id.description",
            id: "$invoiceNo",
          },
        },
      ]);
      console.log("33", data);
      res.status(200).send({
        code: 200,
        data,
        message: "Industry perf report fetched successfully !",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
