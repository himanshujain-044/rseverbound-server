const mongoose = require("mongoose");
const ProductsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const Products = mongoose.model("mmproducts", ProductsSchema);
module.exports = Products;
