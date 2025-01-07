const { required } = require("joi");
const mongoose = require("mongoose");
const VehiclesSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const Vehicles = mongoose.model("mmvechiles", VehiclesSchema);
module.exports = Vehicles;
