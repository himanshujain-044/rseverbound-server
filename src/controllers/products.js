const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const Products = require("../models/products");
const { decryptPassword, encryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  getAllProducts: async (req, res, next) => {
    try {
      const allProducts = await Products.find().select("-_id name");
      res.status(200).send({
        code: 200,
        message: "All products fetched successfully !",
        data: allProducts,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
