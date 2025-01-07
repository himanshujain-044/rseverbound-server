const { AMOUNT_PAID, TIME_UNITS, OTP_TYPE } = require("../constants/enum");
const { STATUS } = require("../constants/messages");
const { signToken } = require("../middleware/auth");
const Vehicles = require("../models/vehicles");
const { decryptPassword, encryptPassword } = require("../utility/common");
const ErrorClass = require("../utility/error");

module.exports = {
  getAllVehicles: async (req, res, next) => {
    try {
      const allVehicles = await Vehicles.find().select("-_id vehicleNumber");
      res.status(200).send({
        code: 200,
        message: "All Vehicles fetched successfully !",
        data: allVehicles,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
