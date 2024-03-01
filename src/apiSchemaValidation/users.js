const Joi = require("joi");
const { PAYMENT_METHOD } = require("../constants/enum");

module.exports = {
  updatePaymentMethodSchemaVal: Joi.object({
    paymentMethod: Joi.object({
      method: Joi.string()
        .valid(
          PAYMENT_METHOD.GPAY,
          PAYMENT_METHOD.PHONEPE,
          PAYMENT_METHOD.PAYTM
        )
        .required(),
      paymentAddress: Joi.string().required(),
    }).required(),
  }),
};
